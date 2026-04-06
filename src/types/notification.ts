/**
 * バックエンドから送信される通知ペイロード
 */
export interface NotificationPayload {
  /** サービスID */
  service_id: string;
  /** 未読カウント */
  count: number;
}
