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

        let remember_table_migration = Migration {
            version: 2,
            description: "Create Remembers Table",
            sql: "CREATE TABLE remembers (id INTEGER PRIMARY KEY, title TEXT NOT NULL, highlights TEXT);",
            kind: MigrationKind::Up,
        };

        // let gratitude_table_migration = Migration {
        //     version: 2,
        //     description: "Create Gratitudes Table",
        //     sql: "CREATE TABLE gratitudes (id INTEGER PRIMARY KEY, title TEXT NOT NULL, description TEXT, category TEXT CHECK(category IN ('Family', 'Partnership', 'Parenting', 'Social', 'Career', 'Personal Growth', 'Recreation', 'Spirituality', 'Community', 'Fitness')) NOT NULL, highlights TEXT, day TEXT NOT NULL, FOREIGN KEY (day) REFERENCES days(day) ON DELETE CASCADE); CREATE INDEX idx_gratitudes_day ON gratitudes(day);",
        //     kind: MigrationKind::Up,
        // };

        // let tasks_table_migration = Migration {
        //     version: 2,
        //     description: "Create Tasks Table",
        //     sql: "CREATE TABLE tasks (id INTEGER PRIMARY KEY, name TEXT);",
        //     kind: MigrationKind::Up,
        // };

        vec![days_table_migration, remember_table_migration]
    }
}
