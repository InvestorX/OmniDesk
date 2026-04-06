import { invoke } from "@tauri-apps/api/core";
import { useRef, useEffect, useCallback } from "react";
import { useAppContext } from "../context/AppContext";

/**
 * ペンディング切り替えリクエストの型
 */
interface PendingSwitch {
  serviceId: string;
  url: string;
}

/**
 * Webview操作を抽象化するカスタムフック
 * useRefで最新stateを追跡し、stale closure問題を回避する
 * @return Webview操作関数群
 */
export function useWebview() {
  const { state, dispatch } = useAppContext();

  // 最新のstateを常にrefで保持（stale closure対策）
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  // 切り替え中フラグ
  const isSwitchingRef = useRef(false);
  // 切り替え中に受け付けた最新のリクエストを保持
  const pendingServiceRef = useRef<PendingSwitch | null>(null);

  /**
   * 指定サービスに切り替える
   * 未ロードの場合はWebviewを生成してから切り替える
   * 切り替え中の後続リクエストはペンディングキューに保持し、完了後に処理する
   * @param serviceId - 切り替え先のサービスID
   * @param url - サービスのURL
   * @throws Error - Tauriコマンドの実行に失敗した場合
   */
  const switchToService = useCallback(async (serviceId: string, url: string): Promise<void> => {
    // 切り替え中の場合はペンディングに保存して即座にリターン
    if (isSwitchingRef.current) {
      console.log(`[Frontend] Switch in progress. Queuing request for ${serviceId}`);
      pendingServiceRef.current = { serviceId, url };
      return;
    }

    const previousServiceId = stateRef.current.activeServiceId;

    try {
      isSwitchingRef.current = true;
      console.log(`[Frontend] switchToService starting for: ${serviceId}, URL: ${url}`);

      // stateRefから最新のステートを取得（stale closure回避）
      const currentState = stateRef.current;
      const serviceState = currentState.services[serviceId];
      console.log(`[Frontend] Current service state for ${serviceId}:`, serviceState);

      // 既にアクティブなサービスの場合は何もしない
      if (previousServiceId === serviceId) {
        console.log(`[Frontend] Service ${serviceId} is already active. Skipping switch.`);
        return;
      }

      // 1. 未ロードの場合は生成
      if (!serviceState || !serviceState.isLoaded) {
        console.log(`[Frontend] Service ${serviceId} not loaded. Creating...`);
        await invoke("create_webview", { serviceId, url });
        dispatch({ type: "SET_SERVICE_LOADED", serviceId });
        console.log(`[Frontend] Service ${serviceId} created and marked as loaded.`);
      }

      // 2. サスペンド中の場合は復帰
      if (serviceState && serviceState.isSuspended) {
        console.log(`[Frontend] Service ${serviceId} is suspended. Resuming...`);
        await invoke("resume_webview", { serviceId });
        dispatch({ type: "RESUME_SERVICE", serviceId });
      }

      // 3. フロントエンドのステートを先に更新（UI応答性のため）
      dispatch({ type: "SET_ACTIVE_SERVICE", serviceId });
      console.log(`[Frontend] SET_ACTIVE_SERVICE dispatched for ${serviceId}`);

      // 4. 現在の描画エリアのRectを推定してバックエンドに通知
      const sidebarWidth = stateRef.current.isSidebarExpanded ? 208 : 64;
      const mainArea = document.querySelector('main');
      const rect = mainArea
        ? mainArea.getBoundingClientRect()
        : { left: sidebarWidth, top: 0, width: window.innerWidth - sidebarWidth, height: window.innerHeight };

      console.log(`[Frontend] Invoking switch_webview for ${serviceId} with rect:`, rect);
      // 5. バックエンドでWebviewを表示切り替え
      await invoke("switch_webview", {
        serviceId,
        rect: {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height
        }
      });
      console.log(`[Frontend] switch_webview successful for ${serviceId}`);
    } catch (error) {
      console.error(`[Frontend] Failed to switch service to ${serviceId}:`, error);
      // ロールバック: 元のアクティブサービスに戻す
      if (previousServiceId && previousServiceId !== serviceId) {
        dispatch({ type: "SET_ACTIVE_SERVICE", serviceId: previousServiceId });
      }
    } finally {
      isSwitchingRef.current = false;

      // ペンディングリクエストがあれば処理する
      const pending = pendingServiceRef.current;
      if (pending) {
        pendingServiceRef.current = null;
        console.log(`[Frontend] Processing pending switch to ${pending.serviceId}`);
        // 非同期で再帰呼び出し（コールスタック溢れ防止のためqueueMicrotaskを使用）
        queueMicrotask(() => {
          switchToService(pending.serviceId, pending.url);
        });
      }
    }
  }, [dispatch]);

  /**
   * 指定サービスのWebviewをサスペンドする
   * @param serviceId - サスペンド対象のサービスID
   * @throws Error - Tauriコマンドの実行に失敗した場合
   */
  const suspendService = useCallback(async (serviceId: string): Promise<void> => {
    await invoke("suspend_webview", { serviceId });
    dispatch({ type: "SUSPEND_SERVICE", serviceId });
  }, [dispatch]);

  /**
   * 新しいウィンドウでサービスを開く
   * @param serviceId - サービスID
   * @param url - サービスのURL
   * @throws Error - Tauriコマンドの実行に失敗した場合
   */
  const openInNewWindow = useCallback(async (serviceId: string, url: string): Promise<void> => {
    await invoke("open_in_new_window", { serviceId, url });
  }, []);

  return { switchToService, suspendService, openInNewWindow };
}
