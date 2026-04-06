/**
 * サービスのグループ分類
 */
export type ServiceGroup = "ai" | "communication" | "workspace" | "custom";

/**
 * 統合対象サービスの定義
 */
export interface ServiceDefinition {
  /** サービスの一意識別子 */
  id: string;
  /** 表示名 */
  label: string;
  /** サービスURL */
  url: string;
  /** アイコン名 (Lucide Icons) */
  icon: string;
  /** 所属グループ */
  group: ServiceGroup;
  /** 通知監視対象かどうか */
  hasNotification: boolean;
  /** ユーザーが追加したカスタムURLか */
  isCustom?: boolean;
}

/**
 * サービスの実行時状態
 */
export interface ServiceState {
  /** サービスID */
  id: string;
  /** Webviewが生成済みか */
  isLoaded: boolean;
  /** 現在アクティブ（表示中）か */
  isActive: boolean;
  /** サスペンド状態か */
  isSuspended: boolean;
  /** 未読通知数 */
  notificationCount: number;
}
