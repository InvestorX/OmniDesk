use tauri::{command, AppHandle, State};
use crate::webview::manager::WebviewManager;

/// Webviewを生成するコマンド
/// @param app - Tauriアプリハンドル
/// @param manager - アプリに登録されたWebviewManagerのステート
/// @param service_id - 生成対象のサービスID
/// @param url - 読み込むURL
/// @return Result<(), String> - 成功/失敗
#[command]
pub async fn create_webview(
    app: AppHandle,
    manager: State<'_, WebviewManager>,
    service_id: String,
    url: String,
) -> Result<(), String> {
    manager.create_webview(&app, &service_id, &url)
}

/// Webviewを切り替えるコマンド
/// @param app - Tauriアプリハンドル
/// @param manager - アプリに登録されたWebviewManagerのステート
/// @param service_id - 切り替え先のサービスID
/// @param rect - 表示時の配置矩形
/// @return Result<(), String> - 成功/失敗
#[command]
pub async fn switch_webview(
    app: AppHandle,
    manager: State<'_, WebviewManager>,
    service_id: String,
    rect: crate::webview::manager::WebviewRect,
) -> Result<(), String> {
    manager.switch_to(&app, &service_id, rect)
}

/// Webviewをサスペンドするコマンド
/// @param app - Tauriアプリハンドル
/// @param manager - アプリに登録されたWebviewManagerのステート
/// @param service_id - サスペンド対象のサービスID
/// @return Result<(), String> - 成功/失敗
#[command]
pub async fn suspend_webview(
    app: AppHandle,
    manager: State<'_, WebviewManager>,
    service_id: String,
) -> Result<(), String> {
    manager.suspend_webview(&app, &service_id)
}

/// Webviewを復帰するコマンド
/// @param app - Tauriアプリハンドル
/// @param manager - アプリに登録されたWebviewManagerのステート
/// @param service_id - 復帰対象のサービスID
/// @return Result<(), String> - 成功/失敗
#[command]
pub async fn resume_webview(
    app: AppHandle,
    manager: State<'_, WebviewManager>,
    service_id: String,
) -> Result<(), String> {
    manager.resume_webview(&app, &service_id)
}

/// 新しいウィンドウでサービスを開くコマンド
/// @param app - Tauriアプリハンドル
/// @param manager - アプリに登録されたWebviewManagerのステート
/// @param service_id - 生成対象のサービスID
/// @param url - 読み込むURL
/// @return Result<(), String> - 成功/失敗
#[command]
pub async fn open_in_new_window(
    app: AppHandle,
    manager: State<'_, WebviewManager>,
    service_id: String,
    url: String,
) -> Result<(), String> {
    manager.open_in_new_window(&app, &service_id, &url)
}

/// Webviewの位置・サイズを更新するコマンド
/// @param app - Tauriアプリハンドル
/// @param manager - アプリに登録されたWebviewManagerのステート
/// @param rect - 配置先の矩形情報
/// @return Result<(), String> - 成功/失敗
#[command]
pub async fn resize_webviews(
    app: AppHandle,
    manager: State<'_, WebviewManager>,
    rect: crate::webview::manager::WebviewRect,
) -> Result<(), String> {
    manager.resize_webviews(&app, rect)
}
