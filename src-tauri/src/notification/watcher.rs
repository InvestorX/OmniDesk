use serde::{Deserialize, Serialize};
use regex::Regex;
use tauri::AppHandle;

/// 通知情報を表す構造体
#[derive(Clone, Serialize, Deserialize)]
pub struct NotificationPayload {
    /// サービスID
    pub service_id: String,
    /// 未読カウント数
    pub count: u32,
}

/// 通知監視を行う構造体
/// 各WebviewのDOMタイトル変更を監視し、未読数を検出する
pub struct NotificationWatcher {}

impl NotificationWatcher {
    /// 通知監視を開始する
    /// @param _app - Tauriアプリハンドル
    /// @param _service_id - 監視対象のサービスID
    pub fn start_watching(&self, _app: &AppHandle, _service_id: &str) {
        // Tauri v2ではon_page_title_changedはWebViewWindowに紐付けるため、生成時に実施する。
        // ここでは責務として定義のみ残す
    }

    /// タイトル文字列から未読数を抽出する（ユーティリティ関数）
    /// 
    /// `(3) Gmail` や `(99+) Chat` のような形式から数値を抽出します。
    /// 
    /// @param title - 解析対象のタイトル文字列
    /// @return u32 - 抽出した未読数 (マッチしない場合は0)
    pub fn extract_count(title: &str) -> u32 {
        // (数字) または (数字+) の形式を抽出する
        static PATTERN: once_cell::sync::Lazy<Regex> = once_cell::sync::Lazy::new(|| {
            Regex::new(r"\((?P<count>\d+)\+?\)").unwrap()
        });
        if let Some(caps) = PATTERN.captures(title) {
            if let Some(m) = caps.name("count") {
                return m.as_str().parse::<u32>().unwrap_or(0);
            }
        }
        0
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_extract_count() {
        assert_eq!(NotificationWatcher::extract_count("(3) Gmail"), 3);
        assert_eq!(NotificationWatcher::extract_count("(99+) Chat"), 99);
        assert_eq!(NotificationWatcher::extract_count("Inbox (5)"), 5);
        assert_eq!(NotificationWatcher::extract_count("No notifications"), 0);
        assert_eq!(NotificationWatcher::extract_count("Title with (brackets) but no digits"), 0);
        assert_eq!(NotificationWatcher::extract_count("(123) Multiple (456)"), 123);
    }
}
