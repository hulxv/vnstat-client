use crate::error::{Result, VnstatError};
use std::process::Command;

/// Returns `true` if `vnstatd` is currently active.
pub fn is_active() -> bool {
    Command::new("systemctl")
        .args(["is-active", "--quiet", "vnstat"])
        .status()
        .map(|s| s.success())
        .unwrap_or(false)
}

/// Start the vnstatd service (requires polkit privilege escalation).
pub fn start() -> Result<()> {
    run_privileged(&["systemctl", "start", "vnstat"])
}

/// Stop the vnstatd service.
pub fn stop() -> Result<()> {
    run_privileged(&["systemctl", "stop", "vnstat"])
}

/// Restart the vnstatd service.
pub fn restart() -> Result<()> {
    run_privileged(&["systemctl", "restart", "vnstat"])
}

fn run_privileged(args: &[&str]) -> Result<()> {
    let status = Command::new("pkexec").args(args).status()?;
    if !status.success() {
        return Err(VnstatError::CommandFailed(format!(
            "pkexec {:?} failed",
            args
        )));
    }
    Ok(())
}

/// Returns `true` if `vnstat` is installed (i.e. on PATH).
pub fn is_installed() -> bool {
    Command::new("which")
        .arg("vnstat")
        .output()
        .map(|o| o.status.success())
        .unwrap_or(false)
}
