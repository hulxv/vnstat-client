use tauri::Emitter;
use tauri_plugin_updater::UpdaterExt;

/// Re-check for an update and download+install it, emitting progress events
/// to the frontend so AvailableUpdateAlert can show progress.
#[tauri::command]
pub async fn start_download_new_update(app: tauri::AppHandle) -> Result<(), String> {
    let updater = app.updater().map_err(|e| e.to_string())?;
    let update = updater.check().await.map_err(|e| e.to_string())?;

    let Some(update) = update else {
        return Err("No update available".into());
    };

    let app_chunk = app.clone();
    let app_finish = app.clone();
    let mut downloaded_bytes: u64 = 0;

    update
        .download_and_install(
            move |chunk_length, content_length| {
                downloaded_bytes += chunk_length as u64;
                let percent = content_length
                    .map(|total| downloaded_bytes as f64 / total as f64 * 100.0)
                    .unwrap_or(0.0);
                let _ = app_chunk.emit(
                    "download-update-progress",
                    serde_json::json!({ "percent": percent }),
                );
            },
            move || {
                let _ = app_finish.emit("update-downloaded", ());
            },
        )
        .await
        .map_err(|e| {
            let _ = app.emit("download-update-error", ());
            e.to_string()
        })
}

/// Exit the app so the downloaded update takes effect on next launch.
#[tauri::command]
pub fn quit_and_update(app: tauri::AppHandle) {
    app.exit(0);
}
