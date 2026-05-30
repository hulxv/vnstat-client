use serde::{Deserialize, Serialize};

/// A row from the day / month / year / hour tables.
/// `date` is stored by vnstat as text: "YYYY-MM-DD" (day/month/year)
/// or "YYYY-MM-DD HH:00:00" (hour). rx/tx are bytes.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TrafficEntry {
    pub id: i64,
    pub interface: i64,
    pub date: String,
    pub rx: i64,
    pub tx: i64,
}

/// A row from the `interface` table.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Interface {
    pub id: i64,
    pub name: String,
    pub alias: String,
    pub active: i64,
    pub created: String,
    pub updated: String,
    pub rxtotal: i64,
    pub txtotal: i64,
}

/// A row from the `info` table (name/value store).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VnInfo {
    pub name: String,
    pub value: String,
}

/// All traffic data returned in a single call.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TrafficData {
    /// Daily rows — used for the month and week views.
    pub month: Vec<TrafficEntry>,
    /// Hourly rows — used for the day view.
    pub day: Vec<TrafficEntry>,
    /// Monthly rows — used for the year view.
    pub year: Vec<TrafficEntry>,
    /// Daily rows again — week view filters client-side.
    pub week: Vec<TrafficEntry>,
    pub summary: Vec<SummaryEntry>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SummaryEntry {
    pub interval: String,
    pub data: SummaryData,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SummaryData {
    pub date: String,
    /// Already converted to MB.
    pub rx: f64,
    /// Already converted to MB.
    pub tx: f64,
}
