use tauri::{AppHandle, Manager};
use std::path::PathBuf;

/// 指定アプリの共有データディレクトリのパスを取得する
/// @param app - Tauriアプリハンドル
/// @return PathBuf - 共有データディレクトリの絶対パス
pub fn get_shared_data_dir(app: &AppHandle) -> PathBuf {
    app.path().app_data_dir().unwrap_or_else(|_| PathBuf::from("."))
}
