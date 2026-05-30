use crate::error::{Result, VnstatError};
use std::collections::HashMap;
use std::fs;

const DEFAULT_CONFIG_PATH: &str = "/etc/vnstat.conf";

fn defaults() -> HashMap<String, String> {
    [
        // General
        ("Interface", "\"\""),
        ("DatabaseDir", "\"/var/lib/vnstat\""),
        ("Locale", "\"-\""),
        // Date formats
        ("DayFormat", "\"%Y-%m-%d\""),
        ("MonthFormat", "\"%Y-%m\""),
        ("TopFormat", "\"%Y-%m-%d\""),
        // Visual characters
        ("RXCharacter", "\"%\""),
        ("TXCharacter", "\":\""),
        ("RXHourCharacter", "\"r\""),
        ("TXHourCharacter", "\"t\""),
        // Units
        ("UnitMode", "0"),
        ("RateUnit", "1"),
        ("RateUnitMode", "1"),
        // Output
        ("OutputStyle", "3"),
        ("EstimateBarVisible", "1"),
        ("DefaultDecimals", "2"),
        ("HourlyDecimals", "1"),
        ("HourlySectionStyle", "2"),
        ("Sampletime", "5"),
        ("LiveSpinner", "1"),
        ("QueryMode", "0"),
        // List limits
        ("List5Mins", "24"),
        ("ListHours", "24"),
        ("ListDays", "30"),
        ("ListMonths", "12"),
        ("ListYears", "0"),
        ("ListTop", "10"),
        // Interface matching
        ("InterfaceMatchMethod", "3"),
        ("EstimateVisible", "1"),
        ("EstimateText", "\"estimated\""),
        ("InterfaceOrder", "0"),
        // Daemon
        ("DaemonUser", "\"\""),
        ("DaemonGroup", "\"\""),
        ("BandwidthDetection", "1"),
        ("MaxBandwidth", "1000"),
        // Retention
        ("5MinuteHours", "48"),
        ("HourlyDays", "4"),
        ("DailyDays", "62"),
        ("MonthlyMonths", "25"),
        ("YearlyYears", "-1"),
        ("TopDayEntries", "20"),
        // Intervals
        ("UpdateInterval", "20"),
        ("PollInterval", "5"),
        ("SaveInterval", "5"),
        ("OfflineSaveInterval", "30"),
        ("RescanDatabaseOnSave", "1"),
        ("AlwaysAddNewInterfaces", "0"),
        ("MonthRotate", "1"),
        ("MonthRotateAffectsYears", "0"),
        ("CheckDiskSpace", "1"),
        ("BootVariation", "15"),
        ("TrafficlessEntries", "1"),
        ("TimeSyncWait", "5"),
        ("BandwidthDetectionInterval", "5"),
        ("SaveOnStatusChange", "1"),
        // Logging
        ("UseLogging", "2"),
        ("CreateDirs", "1"),
        ("UpdateFileOwner", "1"),
        ("LogFile", "\"/var/log/vnstat/vnstat.log\""),
        ("PidFile", "\"/var/run/vnstat/vnstat.pid\""),
        // Database
        ("64bitInterfaceCounters", "-2"),
        ("DatabaseWriteAheadLogging", "0"),
        ("DatabaseSynchronous", "-1"),
        ("UseUTC", "0"),
        ("VacuumOnStartup", "1"),
        ("VacuumOnHUPSignal", "1"),
        // vnstati
        ("HeaderFormat", "\"%Y-%m-%d %H:%M\""),
        ("HourlyRate", "1"),
        ("SummaryRate", "1"),
        ("TransparentBg", "0"),
        ("LargeFonts", "0"),
        ("LineSpacingAdjustment", "0"),
        ("ImageScale", "100"),
        ("5MinuteGraphResultCount", "576"),
        ("5MinuteGraphHeight", "300"),
        ("HourlyGraphMode", "0"),
        ("SummaryGraph", "0"),
        ("EstimateStyle", "1"),
        ("BarColumnShowsRate", "0"),
        // Colors
        ("CBackground", "\"FFFFFF\""),
        ("CEdge", "\"AEAEAE\""),
        ("CHeader", "\"606060\""),
        ("CHeaderTitle", "\"FFFFFF\""),
        ("CHeaderDate", "\"FFFFFF\""),
        ("CText", "\"000000\""),
        ("CLine", "\"B0B0B0\""),
        ("CLineL", "\"-\""),
        ("CPercentileLine", "\"CF0045\""),
        ("CRx", "\"92CF00\""),
        ("CTx", "\"606060\""),
        ("CRxD", "\"-\""),
        ("CTxD", "\"-\""),
        ("CTotal", "\"0098CF\""),
    ]
    .into_iter()
    .map(|(k, v)| (k.to_owned(), v.to_owned()))
    .collect()
}

fn parse_kv(line: &str) -> Option<(String, String)> {
    let mut parts = line.splitn(2, ' ');
    let key = parts.next()?.trim().to_owned();
    if key.is_empty() {
        return None;
    }
    let val = parts.next().unwrap_or("").trim().to_owned();
    Some((key, val))
}

/// Read `/etc/vnstat.conf` and return a key->value map.
/// Starts from hardcoded defaults, then overrides with any active
/// (non-commented) lines found in the file.
pub fn read(path: Option<&str>) -> Result<HashMap<String, String>> {
    let path = path.unwrap_or(DEFAULT_CONFIG_PATH);
    if !std::path::Path::new(path).exists() {
        return Err(VnstatError::ConfigNotFound(path.to_owned()));
    }
    let content = fs::read_to_string(path)?;

    let mut map = defaults();

    for line in content.lines() {
        let line = line.trim();
        if line.is_empty() || line.starts_with('#') || line.starts_with(';') {
            continue;
        }
        if let Some((k, v)) = parse_kv(line) {
            map.insert(k, v);
        }
    }

    Ok(map)
}

/// Write `changes` (key->value pairs) back to the config file using `pkexec sed`.
/// Handles both active lines and `;`-commented default lines (uncompomments them).
/// Keys not found in the file are appended.
pub fn write(changes: &[(String, String)], path: Option<&str>) -> Result<()> {
    let path = path.unwrap_or(DEFAULT_CONFIG_PATH);

    // Determine which keys exist in the file (active or commented)
    let content = fs::read_to_string(path).unwrap_or_default();
    let in_file: std::collections::HashSet<String> = content
        .lines()
        .filter_map(|l| {
            let l = l.trim();
            let l = l.strip_prefix(';').unwrap_or(l);
            parse_kv(l.trim()).map(|(k, _)| k)
        })
        .collect();

    let (existing, new): (Vec<_>, Vec<_>) = changes
        .iter()
        .partition(|(k, _)| in_file.contains(k.as_str()));

    // Use sed -E: `s|^;?Key .*|Key value|` handles both active and commented lines
    if !existing.is_empty() {
        let sed_expr = existing
            .iter()
            .map(|(k, v)| format!("s|^;?{k} .*|{k} {v}|"))
            .collect::<Vec<_>>()
            .join(";");
        let status = std::process::Command::new("pkexec")
            .args(["sed", "-E", "-i", &sed_expr, path])
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
            .args([
                "sh",
                "-c",
                &format!("printf '\\n# Added by vnstat-client\\n{append}\\n' >> {path}"),
            ])
            .status()?;
        if !status.success() {
            return Err(VnstatError::CommandFailed(
                "failed to append new keys to vnstat.conf".into(),
            ));
        }
    }

    Ok(())
}
