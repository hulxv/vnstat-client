use std::collections::HashMap;
use std::fs;
use crate::error::{Result, VnstatError};

const DEFAULT_CONFIG_PATH: &str = "/etc/vnstat.conf";

/// Read `/etc/vnstat.conf` and return a key→value map.
/// Lines starting with `#` or `;` and blank lines are ignored.
pub fn read(path: Option<&str>) -> Result<HashMap<String, String>> {
    let path = path.unwrap_or(DEFAULT_CONFIG_PATH);
    if !std::path::Path::new(path).exists() {
        return Err(VnstatError::ConfigNotFound(path.to_owned()));
    }
    let content = fs::read_to_string(path)?;
    let map = content
        .lines()
        .map(str::trim)
        .filter(|l| !l.is_empty() && !l.starts_with('#') && !l.starts_with(';'))
        .filter_map(|l| {
            let mut parts = l.splitn(2, ' ');
            let key = parts.next()?.to_owned();
            let val = parts.next().unwrap_or("").trim().to_owned();
            Some((key, val))
        })
        .collect();
    Ok(map)
}

/// Write `changes` (key→value pairs) back to the config file using `pkexec sed`.
/// Keys that already exist are updated in-place; missing keys are appended.
pub fn write(changes: &[(String, String)], path: Option<&str>) -> Result<()> {
    let path = path.unwrap_or(DEFAULT_CONFIG_PATH);
    let current = read(Some(path)).unwrap_or_default();

    let (existing, new): (Vec<_>, Vec<_>) =
        changes.iter().partition(|(k, _)| current.contains_key(k));

    // Build a sed script for existing keys
    if !existing.is_empty() {
        let sed_expr = existing
            .iter()
            .map(|(k, v)| format!("s|^{k} .*|{k} {v}|"))
            .collect::<Vec<_>>()
            .join(";");
        let status = std::process::Command::new("pkexec")
            .args(["sed", "-i", &sed_expr, path])
            .status()?;
        if !status.success() {
            return Err(VnstatError::CommandFailed(
                "sed failed to update vnstat.conf".into(),
            ));
        }
    }

    // Append new keys
    if !new.is_empty() {
        let append = new
            .iter()
            .map(|(k, v)| format!("{k} {v}"))
            .collect::<Vec<_>>()
            .join("\n");
        let status = std::process::Command::new("pkexec")
            .args(["sh", "-c", &format!("echo '\\n# Added by vnstat-client\\n{append}' >> {path}")])
            .status()?;
        if !status.success() {
            return Err(VnstatError::CommandFailed(
                "failed to append new keys to vnstat.conf".into(),
            ));
        }
    }

    Ok(())
}
