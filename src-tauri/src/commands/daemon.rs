use vnstat_rs::daemon;

#[tauri::command]
pub fn daemon_status() -> bool {
    daemon::is_active()
}

#[tauri::command]
pub fn daemon_start() -> Result<(), String> {
    daemon::start().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn daemon_stop() -> Result<(), String> {
    daemon::stop().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn daemon_restart() -> Result<(), String> {
    daemon::restart().map_err(|e| e.to_string())
}
