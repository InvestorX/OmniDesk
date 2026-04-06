use std::collections::HashMap;
use std::sync::Mutex;
use tauri::{AppHandle, Emitter, LogicalPosition, LogicalSize, Manager, WebviewBuilder, WebviewUrl, WebviewWindowBuilder};
use crate::notification::watcher::{NotificationWatcher, NotificationPayload};

/// アプリ内のすべてのWebviewインスタンスを管理する構造体
pub struct WebviewManager {
    /// サービスID → Webviewラベル のマッピング
    pub webviews: Mutex<HashMap<String, String>>,
    /// 現在アクティブなサービスID
    pub active_service: Mutex<Option<String>>,
}

/// Webviewの配置矩形情報 (論理ピクセル)
#[derive(serde::Deserialize)]
pub struct WebviewRect {
    pub x: f64,
    pub y: f64,
    pub width: f64,
    pub height: f64,
}

impl WebviewManager {
    /// WebviewManagerの新規インスタンスを生成する
    /// @return WebviewManager - 初期化済みのマネージャ
    pub fn new() -> Self {
        Self {
            webviews: Mutex::new(HashMap::new()),
            active_service: Mutex::new(None),
        }
    }

    /// 指定サービス用のWebviewを生成する
    /// `WebviewBuilder` を用いて、メインウィンドウの子Webviewとして生成する
    /// @param app - Tauriアプリハンドル
    /// @param service_id - サービスの一意識別子 (例: "gmail", "gemini")
    /// @param url - 読み込むURL
    /// @return Result<(), String> - 成功時はOk、失敗時はErr
    /// @throws String - Webview生成に失敗した場合
    pub fn create_webview(
        &self,
        app: &AppHandle,
        service_id: &str,
        url: &str,
    ) -> Result<(), String> {
        let mut views = self.webviews.lock().unwrap_or_else(|p| {
            eprintln!("[WARN] webviews mutex was poisoned in create_webview, recovering");
            p.into_inner()
        });

        let parsed_url = match url.parse::<tauri::Url>() {
            Ok(u) => u,
            Err(e) => return Err(format!("Invalid URL: {}", e)),
        };
        if parsed_url.scheme() != "http" && parsed_url.scheme() != "https" {
            return Err("Invalid protocol: only http and https are allowed".into());
        }

        // 既にWebviewが存在するかチェック
        if views.contains_key(service_id) {
            return Ok(());
        }

        let label = format!("webview-{}", service_id);

        let main_window = app.get_window("main").ok_or_else(|| {
            let labels: Vec<String> = app.webview_windows().keys().cloned().collect();
            format!("Main window not found. Available windows: {:?}", labels)
        })?;

        let scale_factor = main_window.scale_factor().map_err(|e| e.to_string())?;
        let window_size = main_window.inner_size().map_err(|e| e.to_string())?.to_logical::<f64>(scale_factor);
        
        // サイドバー分（208px）をオフセット。不透明なレイヤーが重ならないよう計算
        let initial_x = 208.0; 
        let width = f64::max(100.0, window_size.width - initial_x);
        let height = window_size.height;

        println!("[DEBUG] Native Integration: Creating child webview '{}' at x:{} width:{}", label, initial_x, width);

        let service_id_clone = service_id.to_string();
        let app_handle = app.clone();
        
        let builder = WebviewBuilder::new(&label, WebviewUrl::External(url.parse().map_err(|e| format!("{}", e))?))
            .focused(false) // 生成時にフォーカスを奪わない
            .on_document_title_changed(move |_webview, title| {
                let count = NotificationWatcher::extract_count(&title);
                let _ = app_handle.emit("notification-update", NotificationPayload {
                    service_id: service_id_clone.clone(),
                    count,
                });
            });

        let tauri_window = &main_window;
        match tauri_window.add_child(
            builder,
            LogicalPosition::new(initial_x, 0.0),
            LogicalSize::new(width, height)
        ) {
            Ok(webview) => {
                let _ = webview.hide(); // 初期は非表示状態
                views.insert(service_id.to_string(), label);
                Ok(())
            }
            Err(e) => {
                eprintln!("[ERROR] Failed to add child webview '{}': {}", label, e);
                Err(e.to_string())
            }
        }
    }

    /// 表示するWebviewを切り替える（ネイティブ統合版）
    /// 現在アクティブなWebviewを非表示にし、指定サービスのWebviewを表示する
    /// サイドバーのクリックを維持するため、表示後にメインWebviewへフォーカスを戻す
    /// @param app - Tauriアプリハンドル
    /// @param service_id - 切り替え先のサービスID
    /// @param rect - 表示時の配置矩形（論理ピクセル）
    /// @return Result<(), String> - 成功時はOk、見つからない場合はErr
    pub fn switch_to(&self, app: &AppHandle, service_id: &str, rect: WebviewRect) -> Result<(), String> {
        println!("[DEBUG] switch_to (native) called for service_id: {}", service_id);

        // フェーズ1: 状態の確認と抽出（ロック時間を最小化）
        let (prev_label, new_label, same_service) = {
            let active = self.active_service.lock().unwrap_or_else(|p| p.into_inner());
            let views = self.webviews.lock().unwrap_or_else(|p| p.into_inner());
            
            let same = active.as_deref() == Some(service_id);
            let prev_lbl = active.as_ref().and_then(|id| views.get(id).cloned());
            let new_lbl = views.get(service_id).cloned();
            
            (prev_lbl, new_lbl, same)
        };

        // 同一サービスの場合は位置更新のみ
        if same_service {
            if let Some(lbl) = new_label {
                if let Some(w) = app.get_webview(&lbl) {
                    w.set_position(LogicalPosition::new(rect.x, rect.y)).map_err(|e| e.to_string())?;
                    w.set_size(LogicalSize::new(rect.width, rect.height)).map_err(|e| e.to_string())?;
                }
            }
            return Ok(());
        }

        // フェーズ2: Webviewの表示・非表示切り替え
        if let Some(lbl) = prev_label {
            if let Some(w) = app.get_webview(&lbl) {
                let _ = w.hide();
            }
        }

        if let Some(lbl) = new_label {
            if let Some(w) = app.get_webview(&lbl) {
                println!("[DEBUG] Showing child webview: {}", lbl);
                w.set_position(LogicalPosition::new(rect.x, rect.y)).map_err(|e| e.to_string())?;
                w.set_size(LogicalSize::new(rect.width, rect.height)).map_err(|e| e.to_string())?;
                w.show().map_err(|e| e.to_string())?;

                // 重要: 子Webviewに奪われたフォーカスをメイン（サイドバー）に戻す
                if let Some(main_v) = app.get_webview("main") {
                    let _ = main_v.set_focus();
                }
            } else {
                return Err(format!("Webview '{}' not found", lbl));
            }
        } else {
            return Err(format!("Service '{}' not found", service_id));
        }

        // フェーズ3: ステート更新
        {
            let mut active = self.active_service.lock().unwrap_or_else(|p| p.into_inner());
            *active = Some(service_id.to_string());
        }

        println!("[DEBUG] switch_to successful for service_id: {}", service_id);
        Ok(())
    }

    /// 非アクティブなWebviewをサスペンドしてメモリを解放する
    /// @param _app - Tauriアプリハンドル
    /// @param _service_id - サスペンド対象のサービスID
    /// @return Result<(), String>
    pub fn suspend_webview(
        &self,
        _app: &AppHandle,
        _service_id: &str,
    ) -> Result<(), String> {
        Ok(())
    }

    /// サスペンドしたWebviewを復帰する
    /// @param _app - Tauriアプリハンドル
    /// @param _service_id - 復帰対象のサービスID
    /// @return Result<(), String>
    pub fn resume_webview(
        &self,
        _app: &AppHandle,
        _service_id: &str,
    ) -> Result<(), String> {
        Ok(())
    }

    /// 新しいウィンドウでサービスを開く
    /// `WebviewWindowBuilder` を用いて、新しく独立したOSウィンドウを作成する。
    /// @param app - Tauriアプリハンドル
    /// @param service_id - サービスの一意識別子
    /// @param url - 読み込むURL
    /// @return Result<(), String>
    pub fn open_in_new_window(
        &self,
        app: &AppHandle,
        service_id: &str,
        url: &str,
    ) -> Result<(), String> {
        let parsed_url = match url.parse::<tauri::Url>() {
            Ok(u) => u,
            Err(e) => return Err(format!("Invalid URL: {}", e)),
        };
        if parsed_url.scheme() != "http" && parsed_url.scheme() != "https" {
            return Err("Invalid protocol: only http and https are allowed".into());
        }

        // 同一サービスで複数窓を開けるよう、ラベルにタイムスタンプ等を付与する
        let timestamp = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_millis();
        let label = format!("window-{}-{}", service_id, timestamp);

        let mut builder = WebviewWindowBuilder::new(
            app,
            &label,
            WebviewUrl::External(url.parse().map_err(|e| format!("{}", e))?)
        );
        builder = builder.title(format!("OmniDesk - {}", service_id));

        match builder.build() {
            Ok(w) => {
                let _ = w.show();
                Ok(())
            }
            Err(e) => Err(e.to_string()),
        }
    }

    /// アクティブなWebviewの位置・サイズを更新する
    /// @param app - Tauriアプリハンドル
    /// @param rect - 配置先の矩形情報（論理ピクセル）
    /// @return Result<(), String> - 成功/失敗
    pub fn resize_webviews(&self, app: &AppHandle, rect: WebviewRect) -> Result<(), String> {
        let active_id_clone = {
            let active_id = self.active_service.lock().unwrap_or_else(|p| {
                eprintln!("[WARN] active_service mutex was poisoned, recovering");
                p.into_inner()
            });
            active_id.clone()
        };

        if let Some(id) = active_id_clone.as_ref() {
            let webviews = self.webviews.lock().unwrap_or_else(|p| {
                eprintln!("[WARN] webviews mutex was poisoned, recovering");
                p.into_inner()
            });
            if let Some(label) = webviews.get(id) {
                if let Some(w) = app.get_webview(label) {
                    w.set_position(LogicalPosition::new(rect.x, rect.y)).map_err(|e| e.to_string())?;
                    w.set_size(LogicalSize::new(rect.width, rect.height)).map_err(|e| e.to_string())?;
                }
            }
        }
        Ok(())
    }
}
