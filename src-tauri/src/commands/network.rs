use serde::{Deserialize, Serialize};
use std::time::Duration;
use tauri::{AppHandle, Emitter};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkSpeed {
    pub rx: u64,
    pub tx: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkBytes {
    pub rx: u64,
    pub tx: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkInterfaceStats {
    pub speed: NetworkSpeed,
    pub bytes: NetworkBytes,
    pub operstate: String,
}

/// Start polling network interface stats and emit "send-network-stats" events.
/// Called once at app startup from lib.rs.
pub fn start_network_stats_polling(app: AppHandle, refresh_ms: u64) {
    std::thread::spawn(move || {
        use std::collections::HashMap;

        let iface = default_interface();
        loop {
            if let Some(ref iface_name) = iface {
                if let Some(stats) = read_net_stats(iface_name) {
                    let mut payload: HashMap<String, NetworkInterfaceStats> = HashMap::new();
                    payload.insert(iface_name.clone(), stats);
                    let _ = app.emit("send-network-stats", &payload);
                }
            }
            std::thread::sleep(Duration::from_millis(refresh_ms));
        }
    });
}

/// Reads rx/tx bytes and speed from `/sys/class/net/{iface}/statistics/`.
fn read_net_stats(iface: &str) -> Option<NetworkInterfaceStats> {
    let base = format!("/sys/class/net/{iface}/statistics");
    let rx_bytes = read_u64(&format!("{base}/rx_bytes"))?;
    let tx_bytes = read_u64(&format!("{base}/tx_bytes"))?;

    // operstate
    let operstate = std::fs::read_to_string(format!("/sys/class/net/{iface}/operstate"))
        .unwrap_or_default()
        .trim()
        .to_owned();

    Some(NetworkInterfaceStats {
        speed: NetworkSpeed { rx: 0, tx: 0 }, // instantaneous speed requires two samples
        bytes: NetworkBytes { rx: rx_bytes, tx: tx_bytes },
        operstate,
    })
}

fn read_u64(path: &str) -> Option<u64> {
    std::fs::read_to_string(path)
        .ok()?
        .trim()
        .parse()
        .ok()
}

/// Returns the name of the default network interface (first non-loopback active one).
fn default_interface() -> Option<String> {
    // Try /proc/net/route to find the default route interface
    let content = std::fs::read_to_string("/proc/net/route").ok()?;
    for line in content.lines().skip(1) {
        let fields: Vec<&str> = line.split_whitespace().collect();
        if fields.len() >= 2 && fields[1] == "00000000" {
            return Some(fields[0].to_owned());
        }
    }
    // Fallback: first non-loopback interface in /sys/class/net
    std::fs::read_dir("/sys/class/net")
        .ok()?
        .filter_map(|e| e.ok())
        .map(|e| e.file_name().to_string_lossy().to_string())
        .find(|name| name != "lo")
}
