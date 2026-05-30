use crate::AppState;
use serde::{Deserialize, Serialize};
use tauri::State;

#[derive(Debug, Serialize, Deserialize)]
pub struct ConnectResponse {
    pub status: String,
    pub title: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
}

/// Server support is not yet implemented in the Tauri migration.
/// Always returns `is_connected: false`.
#[tauri::command]
pub fn server_is_connected(state: State<AppState>) -> serde_json::Value {
    let connected = *state.server_connected.lock().unwrap();
    serde_json::json!({ "is_connected": connected })
}

#[tauri::command]
pub fn server_connect(_address: String, _password: String) -> ConnectResponse {
    ConnectResponse {
        status: "error".into(),
        title: "Server support coming soon".into(),
        description: Some("Remote vnstat-server connections are not yet implemented in the Tauri migration. Track progress in issue #46.".into()),
    }
}

#[tauri::command]
pub fn server_disconnect(state: State<AppState>) -> ConnectResponse {
    *state.server_connected.lock().unwrap() = false;
    ConnectResponse {
        status: "warning".into(),
        title: "Server has been disconnected".into(),
        description: None,
    }
}
