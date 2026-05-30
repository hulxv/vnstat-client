use std::process::Command;

/// Run `vnstat --{format} {limit}` and return the raw output string.
/// `format` is one of: json, csv, xml
/// `limit` controls which period to export (e.g. "-d", "-m", "-h", "", etc.)
#[tauri::command]
pub fn export_db_view(format: String, limit: String) -> Result<String, String> {
    let output = Command::new("vnstat")
        .arg(format!("--{format}"))
        .args(if limit.is_empty() {
            vec![]
        } else {
            vec![limit.as_str()]
        })
        .output()
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }
    Ok(String::from_utf8_lossy(&output.stdout).to_string())
}

/// Show a native save-file dialog and write `data` to the chosen path.
#[tauri::command]
pub async fn export_to_file(
    app: tauri::AppHandle,
    data: String,
    ext: String,
) -> Result<(), String> {
    use tauri_plugin_dialog::DialogExt;
    let path = app
        .dialog()
        .file()
        .set_title(format!("Save as {}", ext.to_uppercase()))
        .set_file_name(format!("vnstat-client.{ext}"))
        .add_filter(ext.to_uppercase(), &[&ext])
        .blocking_save_file();

    match path {
        Some(p) => {
            let path_buf = p.into_path().map_err(|e| e.to_string())?;
            std::fs::write(path_buf, data).map_err(|e| e.to_string())
        }
        None => Ok(()), // user cancelled
    }
}

/// Export a database table as CSV and prompt the user to save it.
#[tauri::command]
pub async fn export_as_csv(
    app: tauri::AppHandle,
    table: String,
    state: tauri::State<'_, crate::AppState>,
) -> Result<(), String> {
    use vnstat_rs::Database;
    let db_path = state.db_path.lock().unwrap().clone();
    let db = Database::open(db_path.as_deref()).map_err(|e| e.to_string())?;

    // Get raw rows as JSON and convert to CSV
    let rows: Vec<vnstat_rs::types::TrafficEntry> = match table.as_str() {
        "day" => db.daily().map_err(|e| e.to_string())?,
        "hour" => db.hourly().map_err(|e| e.to_string())?,
        "month" => db.monthly().map_err(|e| e.to_string())?,
        _ => return Err(format!("Unknown table: {table}")),
    };

    let mut csv = String::from("id,interface,date,rx,tx\n");
    for r in &rows {
        csv.push_str(&format!(
            "{},{},{},{},{}\n",
            r.id, r.interface, r.date, r.rx, r.tx
        ));
    }

    export_to_file(app, csv, "csv".into()).await
}
