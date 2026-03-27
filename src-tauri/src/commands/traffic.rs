use tauri::State;
use vnstat_rs::{Database, types::Interface, types::TrafficData, types::VnInfo};
use crate::AppState;

#[tauri::command]
pub fn get_traffic(state: State<AppState>) -> Result<TrafficData, String> {
    let db_path = state.db_path.lock().unwrap().clone();
    let db = Database::open(db_path.as_deref()).map_err(|e| e.to_string())?;
    db.traffic().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_interfaces(state: State<AppState>) -> Result<Vec<Interface>, String> {
    let db_path = state.db_path.lock().unwrap().clone();
    let db = Database::open(db_path.as_deref()).map_err(|e| e.to_string())?;
    db.interfaces().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_vnstat_info(state: State<AppState>) -> Result<Vec<VnInfo>, String> {
    let db_path = state.db_path.lock().unwrap().clone();
    let db = Database::open(db_path.as_deref()).map_err(|e| e.to_string())?;
    db.info().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn is_vnstat_detect() -> bool {
    vnstat_rs::daemon::is_installed()
}
