import { useEffect } from "react";
// eventはTauri v2でapiが変わった場合があるため、ここではcoreからlistenする例
import { listen } from "@tauri-apps/api/event";
import { useAppContext } from "../context/AppContext";
import { NotificationPayload } from "../types/notification";

/**
 * バックエンドからの通知イベントを購読するフック
 */
export function useNotification(): void {
  const { dispatch } = useAppContext();

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    async function setupListen() {
        unlisten = await listen<NotificationPayload>("notification-update", (event) => {
            dispatch({
            type: "SET_NOTIFICATION_COUNT",
            serviceId: event.payload.service_id,
            count: event.payload.count,
            });
        });
    }
    
    setupListen();

    return () => {
      if (unlisten) unlisten();
    };
  }, [dispatch]);
}
