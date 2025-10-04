use tauri_plugin_sql::{Migration, MigrationKind};

pub struct YMigrations;

impl YMigrations {
    pub fn get_migrations() -> Vec<Migration> {
        let days_table_migration = Migration {
            version: 1,
            description: "Create Days Table",
            sql: "CREATE TABLE days (day TEXT PRIMARY KEY, notes TEXT, doodle TEXT);",
            kind: MigrationKind::Up,
        };
        
        let settings_table_migration = Migration {
            version: 2,
            description: "Create Settings Table",
            sql: "CREATE TABLE settings (code TEXT PRIMARY KEY, value TEXT NOT NULL);",
            kind: MigrationKind::Up,
        };

        let activities_table_migration = Migration {
            version: 3,
            description: "Create Activities Table",
            sql: "CREATE TABLE activities (name TEXT PRIMARY KEY, description TEXT, categories TEXT, color TEXT, status TEXT);",
            kind: MigrationKind::Up,
        };

        let sessions_table_migration = Migration {
            version: 4,
            description: "Create Sessions Table",
            sql: "
                CREATE TABLE sessions (
                    id INTEGER PRIMARY KEY,
                    title TEXT NOT NULL,
                    notes TEXT,
                    activity TEXT,
                    startTime TEXT,
                    endTime TEXT,
                    day TEXT,
                    status TEXT,
                    FOREIGN KEY(day) REFERENCES days(day),
                    FOREIGN KEY(activity) REFERENCES activities(name) ON UPDATE CASCADE ON DELETE CASCADE
                );
                CREATE INDEX idx_sessions_day ON sessions(day);
                CREATE INDEX idx_sessions_activity ON sessions(activity);
            ",
            kind: MigrationKind::Up,
        };

        let tasks_table_migration = Migration {
            version: 5,
            description: "Create Tasks Table",
            sql: "CREATE TABLE tasks (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                activity TEXT,
                session INTEGER NULL,
                isToday INTEGER NOT NULL DEFAULT 0,
                completedDay TEXT,
                status TEXT NOT NULL,
                FOREIGN KEY(session) REFERENCES sessions(id) ON DELETE SET NULL,
                FOREIGN KEY(activity) REFERENCES activities(name) ON UPDATE CASCADE ON DELETE CASCADE
            );
            CREATE INDEX idx_tasks_completedDay ON tasks(completedDay);
            ",
            kind: MigrationKind::Up,
        };

        let remembers_table_migration = Migration {
            version: 6,
            description: "Create Remembers Table",
            sql: "CREATE TABLE remembers (id INTEGER PRIMARY KEY, title TEXT NOT NULL, highlights TEXT);",
            kind: MigrationKind::Up,
        };

        
        // let gratitude_table_migration = Migration {
        //     version: 7,
        //     description: "Create Gratitudes Table",
        //     sql: "CREATE TABLE gratitudes (id INTEGER PRIMARY KEY, title TEXT NOT NULL, description TEXT, category TEXT CHECK(category IN ('Family', 'Partnership', 'Parenting', 'Social', 'Career', 'Personal Growth', 'Recreation', 'Spirituality', 'Community', 'Fitness')) NOT NULL, highlights TEXT, day TEXT NOT NULL, FOREIGN KEY (day) REFERENCES days(day) ON DELETE CASCADE); CREATE INDEX idx_gratitudes_day ON gratitudes(day);",
        //     kind: MigrationKind::Up,
        // };

        vec![
            days_table_migration,
            settings_table_migration,
            activities_table_migration,
            sessions_table_migration,
            tasks_table_migration,
            remembers_table_migration,
        ]
    }
}
