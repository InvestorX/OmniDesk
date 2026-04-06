pub mod commands;
pub mod webview;
pub mod notification;
pub mod session;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Webviewマネージャの登録
            app.manage(webview::manager::WebviewManager::new());
            
            // タスクバーバッジマネージャの登録
            app.manage(notification::tray_badge::TrayBadgeManager::new());
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::webview_commands::create_webview,
            commands::webview_commands::switch_webview,
            commands::webview_commands::suspend_webview,
            commands::webview_commands::resume_webview,
            commands::webview_commands::open_in_new_window,
            commands::webview_commands::resize_webviews,
            commands::notification_commands::get_notification_count,
            commands::notification_commands::update_tray_badge,
            commands::custom_url_commands::add_custom_url,
            commands::custom_url_commands::remove_custom_url,
            commands::custom_url_commands::list_custom_urls,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
