use tauri_plugin_sql::{Migration, MigrationKind};

pub struct YMigrations;

impl YMigrations {
    pub fn get_migrations() -> Vec<Migration> {
        let days_table_migration = Migration {
            version: 1,
            description: "Create Days Table",
            sql: "CREATE TABLE days (day TEXT PRIMARY KEY, notes TEXT);",
            kind: MigrationKind::Up,
        };

        // let remember_table_migrations = Migration {
        //     version: 1,
        //     description: "Create Days Table",
        //     sql: "CREATE TABLE days (day TEXT PRIMARY KEY, notes TEXT);",
        //     kind: MigrationKind::Up,
        // };

        let tasks_table_migration = Migration {
            version: 2,
            description: "Create Tasks Table",
            sql: "CREATE TABLE tasks (id INTEGER PRIMARY KEY, name TEXT);",
            kind: MigrationKind::Up,
        };

        vec![days_table_migration, tasks_table_migration]
    }
}
