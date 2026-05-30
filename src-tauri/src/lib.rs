use serde_json::{json, Value};
use std::sync::Mutex;
use tauri::Manager;

pub mod commands;

use commands::logs::LogEntry;

/// Shared app state accessible to all commands.
pub struct AppState {
    pub app_config: Mutex<Value>,
    pub db_path: Mutex<Option<String>>,
    pub vn_conf_path: Mutex<Option<String>>,
    pub server_connected: Mutex<bool>,
    pub logs: Mutex<Vec<LogEntry>>,
}

impl AppState {
    fn new(config: Value, db_path: Option<String>, vn_conf_path: Option<String>) -> Self {
        Self {
            app_config: Mutex::new(config),
            db_path: Mutex::new(db_path),
            vn_conf_path: Mutex::new(vn_conf_path),
            server_connected: Mutex::new(false),
            logs: Mutex::new(Vec::new()),
        }
    }
}

// ---------------------------------------------------------------------------
// Config helpers
// ---------------------------------------------------------------------------

fn default_config() -> Value {
    json!({
        "netStatsRefreshTime": 1000,
        "checkUpdatesOnStartup": true,
        "interface": 1,
        "appearance": {
            "globalTheme": "green",
            "lineChart": {
                "hasArea": true,
                "areaOpacity": 0.5,
                "colors": "nivo",
                "curve": "cardinal"
            },
            "barChart": {
                "colors": "nivo",
                "isGrouped": true,
                "layout": "horizontal"
            }
        }
    })
}

fn load_app_config(app: &tauri::AppHandle) -> Value {
    let path = match app.path().app_config_dir() {
        Ok(d) => d.join("config.json"),
        Err(_) => return default_config(),
    };
    if let Ok(content) = std::fs::read_to_string(&path) {
        serde_json::from_str(&content).unwrap_or_else(|_| default_config())
    } else {
        default_config()
    }
}

pub fn persist_app_config(app: &tauri::AppHandle, config: &Value) -> std::io::Result<()> {
    let dir = app
        .path()
        .app_config_dir()
        .map_err(|e| std::io::Error::other(e.to_string()))?;
    std::fs::create_dir_all(&dir)?;
    let content = serde_json::to_string_pretty(config).unwrap_or_default();
    std::fs::write(dir.join("config.json"), content)
}

// ---------------------------------------------------------------------------
// System tray
// ---------------------------------------------------------------------------

/// Build a tooltip string with today's rx/tx totals from the vnstat DB.
fn tray_tooltip(db_path: Option<&str>) -> String {
    if let Ok(db) = vnstat_rs::db::Database::open(db_path) {
        if let Ok(data) = db.traffic() {
            if let Some(today) = data.summary.iter().find(|e| e.interval == "today") {
                return format!(
                    "vnStat Client\n\u{2193} {:.1} MB  \u{2191} {:.1} MB",
                    today.data.rx, today.data.tx
                );
            }
        }
    }
    "vnStat Client".into()
}

fn setup_tray(app: &tauri::App) -> tauri::Result<()> {
    use tauri::{
        menu::{Menu, MenuItem},
        tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    };

    let check_item = MenuItem::with_id(
        app,
        "check_updates",
        "Check for updates",
        true,
        None::<&str>,
    )?;
    let quit_item = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&check_item, &quit_item])?;

    let db_path = app
        .try_state::<AppState>()
        .and_then(|s| s.db_path.lock().ok().and_then(|g| g.clone()));
    let tooltip = tray_tooltip(db_path.as_deref());

    TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .tooltip(tooltip)
        .menu(&menu)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "quit" => app.exit(0),
            "check_updates" => {
                let handle = app.clone();
                tauri::async_runtime::spawn(async move {
                    check_for_updates(handle).await;
                });
            }
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
        })
        .build(app)?;

    Ok(())
}

// ---------------------------------------------------------------------------
// App menu bar
// ---------------------------------------------------------------------------

fn setup_menu(app: &tauri::App) -> tauri::Result<()> {
    use tauri::menu::{Menu, MenuItem, PredefinedMenuItem, Submenu};

    // File
    let quit = PredefinedMenuItem::quit(app, Some("Quit"))?;
    let file_menu = Submenu::with_items(app, "File", true, &[&quit])?;

    // View
    let reload = MenuItem::with_id(app, "reload", "Reload", true, None::<&str>)?;
    #[cfg(debug_assertions)]
    let devtools = MenuItem::with_id(app, "devtools", "Developer Tools", true, Some("F12"))?;
    #[cfg(debug_assertions)]
    let view_menu = Submenu::with_items(app, "View", true, &[&reload, &devtools])?;
    #[cfg(not(debug_assertions))]
    let view_menu = Submenu::with_items(app, "View", true, &[&reload])?;

    // Help
    let report_issue = MenuItem::with_id(app, "report_issue", "Report Issue", true, None::<&str>)?;
    let help_menu = Submenu::with_items(app, "Help", true, &[&report_issue])?;

    let menu = Menu::with_items(app, &[&file_menu, &view_menu, &help_menu])?;
    app.set_menu(menu)?;

    app.on_menu_event(|app, event| match event.id().as_ref() {
        "reload" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.eval("window.location.reload()");
            }
        }
        #[cfg(debug_assertions)]
        "devtools" => {
            if let Some(window) = app.get_webview_window("main") {
                window.open_devtools();
            }
        }
        "report_issue" => {
            use tauri_plugin_opener::OpenerExt;
            let _ = app.opener().open_url(
                "https://github.com/Hulxv/vnstat-client/issues",
                None::<&str>,
            );
        }
        _ => {}
    });

    Ok(())
}

// ---------------------------------------------------------------------------
// Auto-updater
// ---------------------------------------------------------------------------

pub async fn check_for_updates(app: tauri::AppHandle) {
    use tauri::Emitter;
    use tauri_plugin_updater::UpdaterExt;

    let updater = match app.updater() {
        Ok(u) => u,
        Err(_) => return,
    };

    if let Ok(Some(update)) = updater.check().await {
        let payload = json!({
            "tag": update.version,
            "releaseNotes": update.body.as_deref().unwrap_or(""),
            "releaseDate": update.date.map(|d| d.to_string()).unwrap_or_default(),
            "files": [],
        });
        let _ = app.emit("update-available", payload);
    }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .setup(|app| {
            let config = load_app_config(app.handle());

            let db_path = vnstat_rs::config::read(None)
                .ok()
                .and_then(|c| c.get("DatabaseDir").cloned())
                .map(|dir| {
                    let dir = dir.trim_matches(|c| c == '"' || c == '\'').to_owned();
                    format!("{dir}/vnstat.db")
                });

            let refresh_ms = config
                .get("netStatsRefreshTime")
                .and_then(Value::as_u64)
                .unwrap_or(1000);

            let check_updates_on_startup = config
                .get("checkUpdatesOnStartup")
                .and_then(Value::as_bool)
                .unwrap_or(true);

            let state = AppState::new(config, db_path, None);
            app.manage(state);

            setup_tray(app)?;
            setup_menu(app)?;

            commands::network::start_network_stats_polling(app.handle().clone(), refresh_ms);

            if check_updates_on_startup {
                let handle = app.handle().clone();
                tauri::async_runtime::spawn(async move {
                    check_for_updates(handle).await;
                });
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // traffic
            commands::traffic::get_traffic,
            commands::traffic::get_interfaces,
            commands::traffic::get_vnstat_info,
            commands::traffic::is_vnstat_detect,
            // config
            commands::config::get_app_config,
            commands::config::set_app_config,
            commands::config::get_vn_configs,
            commands::config::set_vn_configs,
            // daemon
            commands::daemon::daemon_status,
            commands::daemon::daemon_start,
            commands::daemon::daemon_stop,
            commands::daemon::daemon_restart,
            // export
            commands::export::export_db_view,
            commands::export::export_to_file,
            commands::export::export_as_csv,
            // logs
            commands::logs::get_logs,
            commands::logs::clear_logs,
            // system
            commands::system::get_infos,
            commands::system::open_url,
            // server
            commands::server::server_is_connected,
            commands::server::server_connect,
            commands::server::server_disconnect,
            // update
            commands::update::start_download_new_update,
            commands::update::quit_and_update,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
