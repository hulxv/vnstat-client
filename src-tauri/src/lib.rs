use std::sync::Mutex;
use serde_json::{json, Value};
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

/// Default app config — mirrors the electron-store schema.
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

/// Read the persisted config from disk, falling back to defaults.
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

/// Write the current config to disk.
pub fn persist_app_config(app: &tauri::AppHandle, config: &Value) -> std::io::Result<()> {
    let dir = app.path().app_config_dir().map_err(|e| {
        std::io::Error::new(std::io::ErrorKind::Other, e.to_string())
    })?;
    std::fs::create_dir_all(&dir)?;
    let content = serde_json::to_string_pretty(config).unwrap_or_default();
    std::fs::write(dir.join("config.json"), content)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let config = load_app_config(app.handle());

            // Derive db_path from vnstat.conf DatabaseDir if possible
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

            let state = AppState::new(config, db_path, None);
            app.manage(state);

            // Kick off network stats polling in a background thread
            commands::network::start_network_stats_polling(app.handle().clone(), refresh_ms);

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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
