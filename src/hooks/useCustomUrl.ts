import { invoke } from "@tauri-apps/api/core";
import { CustomUrlEntry } from "../types/customUrl";
import { useAppContext } from "../context/AppContext";
import { ServiceDefinition } from "../types/service";

/**
 * カスタムURL管理を行うカスタムフック
 * @return カスタムURL操作関数群
 */
export function useCustomUrl() {
  const { dispatch } = useAppContext();

  /**
   * カスタムURLを追加する
   * @param entry - 追加するカスタムURLエントリ
   * @throws Error - 保存に失敗した場合
   */
  async function addCustomUrl(entry: CustomUrlEntry): Promise<void> {
    await invoke("add_custom_url", { entry });
    const service: ServiceDefinition = {
      id: entry.id,
      label: entry.label,
      url: entry.url,
      icon: entry.icon || "Link",
      group: "custom",
      hasNotification: false,
      isCustom: true,
    };
    dispatch({ type: "ADD_CUSTOM_SERVICE", service });
  }

  /**
   * カスタムURLを削除する
   * @param serviceId - 削除対象のサービスID
   */
  async function removeCustomUrl(serviceId: string): Promise<void> {
    await invoke("remove_custom_url", { serviceId });
    dispatch({ type: "REMOVE_CUSTOM_SERVICE", serviceId });
  }

  /**
   * 保存済みのカスタムURLを読み込む
   * @return Promise<CustomUrlEntry[]> - カスタムURL一覧
   */
  async function loadCustomUrls(): Promise<CustomUrlEntry[]> {
    const urls: CustomUrlEntry[] = await invoke("list_custom_urls");
    urls.forEach((entry) => {
        const service: ServiceDefinition = {
            id: entry.id,
            label: entry.label,
            url: entry.url,
            icon: entry.icon || "Link",
            group: "custom",
            hasNotification: false,
            isCustom: true,
        };
        dispatch({ type: "ADD_CUSTOM_SERVICE", service });
    });
    return urls;
  }

  return { addCustomUrl, removeCustomUrl, loadCustomUrls };
}
