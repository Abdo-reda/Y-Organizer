use tauri_plugin_sql::{Migration, MigrationKind};

pub struct YSeeders;

impl YSeeders {
    pub fn get_seeders() -> Vec<Migration> {
        vec![]
    }
}
