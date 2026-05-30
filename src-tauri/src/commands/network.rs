use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::time::Duration;
use tauri::{AppHandle, Emitter, Manager};

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
pub struct NetworkErrors {
    pub rx: u64,
    pub tx: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkDropped {
    pub rx: u64,
    pub tx: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkInterfaceStats {
    /// Instantaneous throughput in bytes/sec.
    pub speed: NetworkSpeed,
    /// Cumulative bytes transferred since boot.
    pub bytes: NetworkBytes,
    /// Cumulative packet errors since boot.
    pub errors: NetworkErrors,
    /// Cumulative dropped packets since boot.
    pub dropped: NetworkDropped,
    /// Length of the sampling window in milliseconds (0 for the first sample).
    pub ms: u64,
    /// Interface link state (e.g. "up", "down").
    pub operstate: String,
}

/// One raw read of an interface's `/sys/class/net/<iface>/statistics` counters.
struct NetSample {
    rx_bytes: u64,
    tx_bytes: u64,
    rx_errors: u64,
    tx_errors: u64,
    rx_dropped: u64,
    tx_dropped: u64,
    operstate: String,
}

/// Start polling network interface stats and emit "send-network-stats" events.
/// Called once at app startup from lib.rs. The refresh interval is read from
/// the live app config on every tick, so changes from the settings UI
/// (`netStatsRefreshTime`) take effect on the next cycle.
pub fn start_network_stats_polling(app: AppHandle) {
    std::thread::spawn(move || {
        use std::collections::HashMap;
        use std::time::Instant;

        let iface = default_interface();
        // Previous byte counters + timestamp, used to derive instantaneous
        // speed (bytes/sec) from the delta between two consecutive samples.
        let mut prev: Option<(u64, u64, Instant)> = None;

        loop {
            if let Some(ref iface_name) = iface {
                if let Some(sample) = read_net_sample(iface_name) {
                    let now = Instant::now();
                    let (speed, ms) = match prev {
                        Some((prev_rx, prev_tx, prev_time)) => {
                            let elapsed = now.duration_since(prev_time).as_secs_f64();
                            let ms = now.duration_since(prev_time).as_millis() as u64;
                            if elapsed > 0.0 {
                                // saturating_sub guards against counter resets
                                // (e.g. the interface going down/up).
                                let speed = NetworkSpeed {
                                    rx: (sample.rx_bytes.saturating_sub(prev_rx) as f64 / elapsed)
                                        as u64,
                                    tx: (sample.tx_bytes.saturating_sub(prev_tx) as f64 / elapsed)
                                        as u64,
                                };
                                (speed, ms)
                            } else {
                                (NetworkSpeed { rx: 0, tx: 0 }, ms)
                            }
                        }
                        // First sample has no baseline to diff against.
                        None => (NetworkSpeed { rx: 0, tx: 0 }, 0),
                    };
                    prev = Some((sample.rx_bytes, sample.tx_bytes, now));

                    let mut payload: HashMap<String, NetworkInterfaceStats> = HashMap::new();
                    payload.insert(
                        iface_name.clone(),
                        NetworkInterfaceStats {
                            speed,
                            bytes: NetworkBytes {
                                rx: sample.rx_bytes,
                                tx: sample.tx_bytes,
                            },
                            errors: NetworkErrors {
                                rx: sample.rx_errors,
                                tx: sample.tx_errors,
                            },
                            dropped: NetworkDropped {
                                rx: sample.rx_dropped,
                                tx: sample.tx_dropped,
                            },
                            ms,
                            operstate: sample.operstate,
                        },
                    );
                    let _ = app.emit("send-network-stats", &payload);
                }
            }
            // Re-read each tick so settings changes apply without a restart.
            std::thread::sleep(Duration::from_millis(current_refresh_ms(&app)));
        }
    });
}

/// Current `netStatsRefreshTime` (ms) from the live app config, with a sane
/// floor so a bad value can't turn the loop into a busy-spin. Defaults to 1000.
fn current_refresh_ms(app: &AppHandle) -> u64 {
    let ms = app
        .try_state::<crate::AppState>()
        .and_then(|state| {
            state
                .app_config
                .lock()
                .ok()
                .and_then(|config| config.get("netStatsRefreshTime").and_then(Value::as_u64))
        })
        .unwrap_or(1000);
    ms.max(50)
}

/// Reads the cumulative byte/error/drop counters and link state for an
/// interface from `/sys/class/net/<iface>/`. rx/tx bytes are required; the
/// error/drop counters fall back to 0 if the kernel doesn't expose them.
fn read_net_sample(iface: &str) -> Option<NetSample> {
    let base = format!("/sys/class/net/{iface}/statistics");

    let operstate = std::fs::read_to_string(format!("/sys/class/net/{iface}/operstate"))
        .unwrap_or_default()
        .trim()
        .to_owned();

    Some(NetSample {
        rx_bytes: read_u64(&format!("{base}/rx_bytes"))?,
        tx_bytes: read_u64(&format!("{base}/tx_bytes"))?,
        rx_errors: read_u64(&format!("{base}/rx_errors")).unwrap_or(0),
        tx_errors: read_u64(&format!("{base}/tx_errors")).unwrap_or(0),
        rx_dropped: read_u64(&format!("{base}/rx_dropped")).unwrap_or(0),
        tx_dropped: read_u64(&format!("{base}/tx_dropped")).unwrap_or(0),
        operstate,
    })
}

fn read_u64(path: &str) -> Option<u64> {
    std::fs::read_to_string(path).ok()?.trim().parse().ok()
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
