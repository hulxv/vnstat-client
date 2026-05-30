use crate::AppState;
use serde::{Deserialize, Serialize};
use tauri::{Manager, State};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LogEntry {
    pub content: String,
    pub date: String,
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LogsResult {
    pub path: String,
    pub lines: Vec<LogEntry>,
}

#[tauri::command]
pub fn get_logs(app: tauri::AppHandle, state: State<AppState>) -> LogsResult {
    let entries = state.logs.lock().unwrap().clone();
    let path = log_file_path(&app)
        .map(|p| p.display().to_string())
        .unwrap_or_default();
    LogsResult {
        path,
        lines: entries,
    }
}

#[tauri::command]
pub fn clear_logs(app: tauri::AppHandle, state: State<AppState>) -> LogsResult {
    state.logs.lock().unwrap().clear();
    if let Some(path) = log_file_path(&app) {
        let _ = std::fs::write(&path, "");
    }
    LogsResult {
        path: String::new(),
        lines: vec![],
    }
}

fn log_file_path(app: &tauri::AppHandle) -> Option<std::path::PathBuf> {
    app.path()
        .app_log_dir()
        .ok()
        .map(|d| d.join("vnstat-client.log"))
}

/// Append a log entry to both in-memory state and the log file.
pub fn append_log(app: &tauri::AppHandle, state: &AppState, status: &str, content: &str) {
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();
    let date = format_timestamp(now);
    let entry = LogEntry {
        content: content.to_owned(),
        date: date.clone(),
        status: status.to_owned(),
    };
    state.logs.lock().unwrap().push(entry);

    if let Some(path) = log_file_path(app) {
        if let Some(parent) = path.parent() {
            let _ = std::fs::create_dir_all(parent);
        }
        let line = format!("[{date}] [{status}] {content}\n");
        use std::io::Write;
        if let Ok(mut file) = std::fs::OpenOptions::new()
            .append(true)
            .create(true)
            .open(&path)
        {
            let _ = file.write_all(line.as_bytes());
        }
    }
}

fn format_timestamp(secs: u64) -> String {
    // Simple UTC timestamp formatter
    let days = secs / 86400;
    let time_in_day = secs % 86400;
    let h = time_in_day / 3600;
    let m = (time_in_day % 3600) / 60;
    let s = time_in_day % 60;

    let z = days as i64 + 719468;
    let era = if z >= 0 { z } else { z - 146096 } / 146097;
    let doe = z - era * 146097;
    let yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let mo = if mp < 10 { mp + 3 } else { mp - 9 };
    let y = if mo <= 2 { y + 1 } else { y };
    format!("{y:04}-{mo:02}-{d:02} {h:02}:{m:02}:{s:02}")
}
