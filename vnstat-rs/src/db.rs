use rusqlite::Connection;
use crate::error::{Result, VnstatError};
use crate::types::{Interface, SummaryData, SummaryEntry, TrafficData, TrafficEntry, VnInfo};

const DEFAULT_DB_PATH: &str = "/var/lib/vnstat/vnstat.db";

pub struct Database {
    conn: Connection,
}

impl Database {
    pub fn open(path: Option<&str>) -> Result<Self> {
        let path = path.unwrap_or(DEFAULT_DB_PATH);
        if !std::path::Path::new(path).exists() {
            return Err(VnstatError::DatabaseNotFound(path.to_owned()));
        }
        let conn = Connection::open(path)?;
        Ok(Self { conn })
    }

    /// Read all rows from a traffic table (day / month / year / hour).
    fn traffic_from_table(&self, table: &str) -> Result<Vec<TrafficEntry>> {
        let sql = format!("SELECT id, interface, date, rx, tx FROM {table}");
        let mut stmt = self.conn.prepare(&sql)?;
        let rows = stmt.query_map([], |row| {
            Ok(TrafficEntry {
                id: row.get(0)?,
                interface: row.get(1)?,
                date: row.get(2)?,
                rx: row.get(3)?,
                tx: row.get(4)?,
            })
        })?;
        rows.collect::<rusqlite::Result<Vec<_>>>().map_err(Into::into)
    }

    pub fn daily(&self) -> Result<Vec<TrafficEntry>> {
        self.traffic_from_table("day")
    }

    pub fn hourly(&self) -> Result<Vec<TrafficEntry>> {
        self.traffic_from_table("hour")
    }

    pub fn monthly(&self) -> Result<Vec<TrafficEntry>> {
        self.traffic_from_table("month")
    }

    pub fn interfaces(&self) -> Result<Vec<Interface>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, name, alias, active, created, updated, rxtotal, txtotal FROM interface",
        )?;
        let rows = stmt.query_map([], |row| {
            Ok(Interface {
                id: row.get(0)?,
                name: row.get(1)?,
                alias: row.get::<_, Option<String>>(2)?.unwrap_or_default(),
                active: row.get(3)?,
                created: row.get(4)?,
                updated: row.get(5)?,
                rxtotal: row.get(6)?,
                txtotal: row.get(7)?,
            })
        })?;
        rows.collect::<rusqlite::Result<Vec<_>>>().map_err(Into::into)
    }

    pub fn info(&self) -> Result<Vec<VnInfo>> {
        let mut stmt = self.conn.prepare("SELECT name, value FROM info")?;
        let rows = stmt.query_map([], |row| {
            Ok(VnInfo {
                name: row.get(0)?,
                value: row.get(1)?,
            })
        })?;
        rows.collect::<rusqlite::Result<Vec<_>>>().map_err(Into::into)
    }

    /// Returns today's date as "YYYY-MM-DD".
    fn today() -> String {
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs();
        secs_to_date(now as i64)
    }

    /// Returns yesterday's date as "YYYY-MM-DD".
    fn yesterday() -> String {
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs();
        secs_to_date(now as i64 - 86400)
    }

    /// Returns the first day of the current month as "YYYY-MM-DD".
    fn this_month_start() -> String {
        // Quick implementation: parse today and reset day to 01
        let today = Self::today();
        let parts: Vec<&str> = today.split('-').collect();
        if parts.len() == 3 {
            format!("{}-{}-01", parts[0], parts[1])
        } else {
            today
        }
    }

    pub fn traffic(&self) -> Result<TrafficData> {
        let daily = self.daily()?;
        let hourly = self.hourly()?;
        let monthly = self.monthly()?;

        let today = Self::today();
        let yesterday = Self::yesterday();
        let month_start = Self::this_month_start();

        let zero_entry = |date: &str| TrafficEntry {
            id: 0, interface: 0, date: date.to_owned(), rx: 0, tx: 0,
        };

        let today_data = daily.iter()
            .find(|e| e.date == today)
            .cloned()
            .unwrap_or_else(|| zero_entry(&today));

        let yesterday_data = daily.iter()
            .find(|e| e.date == yesterday)
            .cloned()
            .unwrap_or_else(|| zero_entry(&yesterday));

        let this_month_data = monthly.iter()
            .find(|e| e.date == month_start)
            .cloned()
            .unwrap_or_else(|| zero_entry(&month_start));

        let mb = |bytes: i64| bytes as f64 / 1_048_576.0;

        let summary = vec![
            SummaryEntry {
                interval: "this month".into(),
                data: SummaryData {
                    date: this_month_data.date.clone(),
                    rx: mb(this_month_data.rx),
                    tx: mb(this_month_data.tx),
                },
            },
            SummaryEntry {
                interval: "today".into(),
                data: SummaryData {
                    date: today_data.date.clone(),
                    rx: mb(today_data.rx),
                    tx: mb(today_data.tx),
                },
            },
            SummaryEntry {
                interval: "yesterday".into(),
                data: SummaryData {
                    date: yesterday_data.date.clone(),
                    rx: mb(yesterday_data.rx),
                    tx: mb(yesterday_data.tx),
                },
            },
        ];

        Ok(TrafficData {
            month: daily.clone(),
            day: hourly,
            year: monthly.clone(),
            week: daily,
            summary,
        })
    }
}

/// Very small date helper: Unix seconds -> "YYYY-MM-DD".
fn secs_to_date(secs: i64) -> String {
    // Days since epoch
    let days = secs / 86400;
    // Gregorian calendar calculation (no external dep)
    let z = days + 719468;
    let era = if z >= 0 { z } else { z - 146096 } / 146097;
    let doe = z - era * 146097;
    let yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = if mp < 10 { mp + 3 } else { mp - 9 };
    let y = if m <= 2 { y + 1 } else { y };
    format!("{:04}-{:02}-{:02}", y, m, d)
}
