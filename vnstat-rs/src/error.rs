use thiserror::Error;

#[derive(Debug, Error)]
pub enum VnstatError {
    #[error("Database error: {0}")]
    Database(#[from] rusqlite::Error),

    #[error("Database not found at {0}")]
    DatabaseNotFound(String),

    #[error("vnstat config file not found at {0}")]
    ConfigNotFound(String),

    #[error("vnstat is not installed")]
    NotInstalled,

    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Command failed: {0}")]
    CommandFailed(String),
}

pub type Result<T> = std::result::Result<T, VnstatError>;
