use std::fs;
use std::path::PathBuf;
use tauri::AppHandle;
use tauri::Manager;

#[tauri::command]
pub async fn export_database(app_handle: AppHandle, target_path: String) -> Result<String, String> {
    let source_path = get_active_db_path(&app_handle)
        .map_err(|e| format!("Failed to get database path: {}", e))?;
    
    let destination = std::path::PathBuf::from(target_path);

    match fs::copy(&source_path, &destination) {
        Ok(_) => Ok(format!("Database exported successfully to: {}", destination.display())),
        Err(e) => Err(format!("Failed to copy database: {}", e)),
    }
}


#[tauri::command]
pub async fn import_database(app_handle: AppHandle, source_path: String) -> Result<String, String> {
    let destination_path = get_active_db_path(&app_handle)
        .map_err(|e| format!("Failed to get database path: {}", e))?;

    let source = PathBuf::from(&source_path);
    if !source.exists() {
        return Err(format!("Source database file not found at: {}", source_path));
    }

    let backup_path = destination_path.with_file_name("y-import-backup").with_extension("db");
    if destination_path.exists() {
        if let Err(e) = fs::copy(&destination_path, &backup_path) {
            return Err(format!("Failed to create backup: {}", e));
        }
    }

    match fs::copy(&source, &destination_path) {
        Ok(_) => Ok(format!("Database imported successfully from: {}. Backup created at: {}", source_path, backup_path.display())),
        Err(e) => {
            // If import fails, try to restore from backup
            if backup_path.exists() {
                let _ = fs::copy(&backup_path, &destination_path);
            }
            Err(format!("Failed to import database: {}", e))
        },
    }
}

fn get_active_db_path(app: &AppHandle) -> Result<PathBuf, String> {
    let db_file_name = "y.db"; 

    let app_config_dir = app.path()
        .app_config_dir()
        .map_err(|e| format!("Failed to get app config directory: {}", e))?;

    let db_path = app_config_dir.join(db_file_name);
    
    if !db_path.exists() {
        return Err(format!("Database file not found at: {}", db_path.display()));
    }

    Ok(db_path)
}