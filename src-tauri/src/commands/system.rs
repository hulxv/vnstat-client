use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AppInfo {
    pub name: String,
    pub value: String,
}

/// Returns basic app / vnstat version information.
#[tauri::command]
pub fn get_infos(app: tauri::AppHandle) -> Vec<AppInfo> {
    let pkg_version = app.package_info().version.to_string();
    let vnstat_version = std::process::Command::new("vnstat")
        .arg("--version")
        .output()
        .ok()
        .and_then(|o| {
            String::from_utf8(o.stdout).ok().map(|s| {
                s.lines().next().unwrap_or("").to_owned()
            })
        })
        .unwrap_or_else(|| "unknown".into());

    vec![
        AppInfo { name: "version".into(), value: pkg_version },
        AppInfo { name: "vnstat".into(), value: vnstat_version },
    ]
}

/// Open a URL in the default browser using the opener plugin.
#[tauri::command]
pub fn open_url(app: tauri::AppHandle, url: String) -> Result<(), String> {
    use tauri_plugin_opener::OpenerExt;
    app.opener().open_url(url, None::<&str>).map_err(|e| e.to_string())
}
