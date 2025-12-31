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
    
    //TODO: possible macos fix
//    builder = builder.setup(|app| {
//       let win_builder =
//         WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
//             .title("y")
//             .inner_size(1366.0, 768.0)
//             .min_inner_size(640.0, 360.0)
//             .shadow(false)
//             .transparent(true)
//             .zoom_hotkeys_enabled(false);

//       #[cfg(target_os = "macos")]
//       let win_builder = win_builder.title_bar_style(TitleBarStyle::Transparent);

//       #[cfg(target_os = "windows")]
//       let win_builder = win_builder.decorations(false);

//       let window = win_builder.build().unwrap();

//       Ok(())
//     });

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
