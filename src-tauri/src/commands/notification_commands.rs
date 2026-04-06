use tauri::{command, AppHandle, State};
use crate::notification::tray_badge::TrayBadgeManager;

/// トレイのバッジを更新するためのコマンド
/// @param app - Tauriアプリハンドル
/// @param manager - TrayBadgeManagerのステート
/// @param service_id - 発生元のサービスID
/// @param count - 更新後の未読数
/// @return Result<(), String> - 成功/失敗
#[command]
pub async fn update_tray_badge(
    app: AppHandle,
    manager: State<'_, TrayBadgeManager>,
    service_id: String,
    count: u32,
) -> Result<(), String> {
    manager.update_count(&app, &service_id, count)
}

/// 全体の通知数を取得する
/// @param app - Tauriアプリハンドル
/// @param manager - TrayBadgeManagerのステート
/// @return Result<u32, String> - 未読数合計
#[command]
pub async fn get_notification_count(
    _app: AppHandle,
    manager: State<'_, TrayBadgeManager>,
) -> Result<u32, String> {
    Ok(manager.get_total_count())
}
