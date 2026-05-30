use crate::AppState;
use std::collections::HashMap;
use tauri::State;

/// Returns the full app config object.
#[tauri::command]
pub fn get_app_config(state: State<AppState>) -> serde_json::Value {
    state.app_config.lock().unwrap().clone()
}

/// Set a single key (dot-separated path supported for nested keys like "appearance.globalTheme").
#[tauri::command]
pub fn set_app_config(
    key: String,
    value: serde_json::Value,
    state: State<AppState>,
    app: tauri::AppHandle,
) -> Result<serde_json::Value, String> {
    let mut config = state.app_config.lock().unwrap();
    set_nested(&mut config, &key, value);
    crate::persist_app_config(&app, &config).map_err(|e| e.to_string())?;
    Ok(config.clone())
}

/// Read `/etc/vnstat.conf` and return as a key->value object.
#[tauri::command]
pub fn get_vn_configs(state: State<AppState>) -> Result<HashMap<String, String>, String> {
    let vn_conf_path = state.vn_conf_path.lock().unwrap().clone();
    vnstat_rs::config::read(vn_conf_path.as_deref()).map_err(|e| e.to_string())
}

/// Apply an array of `{ key, value }` changes to `/etc/vnstat.conf`.
#[tauri::command]
pub fn set_vn_configs(
    changes: Vec<HashMap<String, String>>,
    state: State<AppState>,
) -> Result<(), String> {
    let vn_conf_path = state.vn_conf_path.lock().unwrap().clone();
    let pairs: Vec<(String, String)> = changes
        .into_iter()
        .filter_map(|mut m| {
            let k = m.remove("key")?;
            let v = m.remove("value")?;
            Some((k, v))
        })
        .collect();
    vnstat_rs::config::write(&pairs, vn_conf_path.as_deref()).map_err(|e| e.to_string())
}

/// Walk a dot-separated key path and set the value in the config JSON.
fn set_nested(config: &mut serde_json::Value, key: &str, value: serde_json::Value) {
    let parts: Vec<&str> = key.splitn(2, '.').collect();
    if parts.len() == 1 {
        if let Some(obj) = config.as_object_mut() {
            obj.insert(key.to_owned(), value);
        }
    } else {
        let head = parts[0];
        let tail = parts[1];
        if let Some(obj) = config.as_object_mut() {
            let child = obj
                .entry(head)
                .or_insert_with(|| serde_json::Value::Object(Default::default()));
            set_nested(child, tail, value);
        }
    }
}
