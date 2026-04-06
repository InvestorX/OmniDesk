/// メモリ管理の設定値
pub struct MemoryPolicy {
    /// サスペンドまでの非アクティブ時間（秒）
    pub suspend_after_secs: u64,
    /// サスペンド対象から除外するサービスID
    pub exclude_from_suspend: Vec<String>,
}

impl Default for MemoryPolicy {
    /// デフォルトのメモリポリシーを返す
    /// @return MemoryPolicy - 15分タイムアウト、Gmail/Chatは除外
    fn default() -> Self {
        Self {
            suspend_after_secs: 900, // 15分
            exclude_from_suspend: vec![
                "gmail".to_string(),
                "chat".to_string(),
            ],
        }
    }
}
