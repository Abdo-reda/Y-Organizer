mod migrations;
mod seeders;
mod commands;
use migrations::YMigrations;
use seeders::YSeeders;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut migrations = YMigrations::get_migrations();
    migrations.extend(YSeeders::get_seeders());

    let mut builder = tauri::Builder::default();
    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .set_focus();
        }));
    }

    builder
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations("sqlite:y.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![commands::export_database, commands::import_database])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
