use tauri::{command, AppHandle, Manager};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

/// カスタムURLエントリ
#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CustomUrlEntry {
    pub id: String,
    pub label: String,
    pub url: String,
    pub icon: String,
    pub created_at: String,
}

/// カスタムURLの保存ファイルのパスを取得
/// @param app - Tauriアプリハンドル
/// @return PathBuf - JSONファイルのパス
fn get_custom_urls_path(app: &AppHandle) -> PathBuf {
    let mut path = app.path().app_data_dir().unwrap_or_else(|_| std::env::current_dir().unwrap());
    if let Err(e) = fs::create_dir_all(&path) {
        eprintln!("Failed to create data directory: {}", e);
    }
    path.push("custom_urls.json");
    path
}

/// 保存されているカスタムURLを読み込む
/// @param app - Tauriアプリハンドル
/// @return Vec<CustomUrlEntry> - エントリのリスト
fn load_custom_urls(app: &AppHandle) -> Vec<CustomUrlEntry> {
    let path = get_custom_urls_path(app);
    if let Ok(data) = fs::read_to_string(path) {
        if let Ok(urls) = serde_json::from_str(&data) {
            return urls;
        }
    }
    Vec::new()
}

/// カスタムURL一覧を保存する
/// @param app - Tauriアプリハンドル
/// @param urls - 保存するリスト
/// @return Result<(), String> - 成功/失敗
fn save_custom_urls(app: &AppHandle, urls: &Vec<CustomUrlEntry>) -> Result<(), String> {
    let path = get_custom_urls_path(app);
    let data = serde_json::to_string(urls).map_err(|e| e.to_string())?;
    fs::write(path, data).map_err(|e| e.to_string())
}

/// カスタムURLを追加するコマンド
/// @param app - Tauriアプリハンドル
/// @param entry - 追加するカスタムURLエントリ
/// @return Result<(), String> - 成功/失敗
#[command]
pub async fn add_custom_url(
    app: AppHandle,
    entry: CustomUrlEntry,
) -> Result<(), String> {
    let mut urls = load_custom_urls(&app);
    // 重複チェック
    if !urls.iter().any(|u| u.id == entry.id) {
        urls.push(entry);
        save_custom_urls(&app, &urls)?;
    }
    Ok(())
}

/// カスタムURLを削除するコマンド
/// @param app - Tauriアプリハンドル
/// @param service_id - 削除対象のサービスID
/// @return Result<(), String> - 成功/失敗
#[command]
pub async fn remove_custom_url(
    app: AppHandle,
    service_id: String,
) -> Result<(), String> {
    let mut urls = load_custom_urls(&app);
    let initial_len = urls.len();
    urls.retain(|u| u.id != service_id);
    if urls.len() != initial_len {
        save_custom_urls(&app, &urls)?;
    }
    Ok(())
}

/// 保存済みカスタムURL一覧を取得するコマンド
/// @param app - Tauriアプリハンドル
/// @return Result<Vec<CustomUrlEntry>, String> - カスタムURL一覧
#[command]
pub async fn list_custom_urls(
    app: AppHandle,
) -> Result<Vec<CustomUrlEntry>, String> {
    Ok(load_custom_urls(&app))
}
