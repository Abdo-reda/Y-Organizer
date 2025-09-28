use tauri_plugin_sql::{Migration, MigrationKind};

pub struct YSeeders;

impl YSeeders {
    pub fn get_seeders() -> Vec<Migration> {
        let settings_table_seeder = Migration {
            version: 11,
            description: "Seed Settings Table",
            sql: r#"INSERT OR IGNORE INTO settings (code, value) VALUES 
    ('DAY_LAYOUT', '[
        {
            "x": 0,
            "y": 0,
            "w": 4,
            "h": 6,
            "id": "now-card"
        },
        {
            "x": 4,
            "y": 0,
            "w": 3,
            "h": 6,
            "id": "notes-card"
        },
        {
            "x": 7,
            "y": 0,
            "w": 3,
            "h": 6,
            "id": "activity-card"
        },
        {
            "x": 10,
            "y": 0,
            "w": 2,
            "h": 12,
            "id": "schedule-card"
        },
        {
            "x": 0,
            "y": 6,
            "w": 4,
            "h": 6,
            "id": "doodle-card"
        },
        {
            "x": 4,
            "y": 6,
            "w": 3,
            "h": 6,
            "id": "remember-card"
        }
    ]');"#,
            kind: MigrationKind::Up,
        };

        vec![settings_table_seeder]
    }
}