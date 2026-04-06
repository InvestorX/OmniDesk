use tauri::AppHandle;
use std::collections::HashMap;
use std::sync::Mutex;

/// タスクバー（システムトレイ）のバッジ表示を管理する構造体
pub struct TrayBadgeManager {
    /// 各サービスの未読カウントを保持
    pub counts: Mutex<HashMap<String, u32>>,
}

impl TrayBadgeManager {
    /// TrayBadgeManagerの新規インスタンスを生成する
    /// @return TrayBadgeManager - 初期化済みのマネージャ
    pub fn new() -> Self {
        Self {
            counts: Mutex::new(HashMap::new()),
        }
    }

    /// 特定サービスの未読数を更新し、タスクバーバッジを再描画する
    /// @param _app - Tauriアプリハンドル
    /// @param service_id - サービスID
    /// @param count - 未読通知数
    /// @return Result<(), String> - 成功時
    pub fn update_count(
        &self,
        _app: &AppHandle,
        service_id: &str,
        count: u32,
    ) -> Result<(), String> {
        // 1. counts マップを更新
        {
            let mut counts = self.counts.lock().unwrap_or_else(|p| p.into_inner());
            counts.insert(service_id.to_string(), count);
        }

        // 2. 実際のバッジ更新 (Tauriプラグイン等を使用してOS固有APIを叩く)
        // macOSの場合は set_badge_count()
        // Windowsの場合はタスクバーのオーバーレイアイコン表示 等
        Ok(())
    }

    /// 全サービスの合計未読数を取得する
    /// @return u32 - 合計未読数
    pub fn get_total_count(&self) -> u32 {
        let counts = self.counts.lock().unwrap_or_else(|p| p.into_inner());
        counts.values().sum()
    }
}
