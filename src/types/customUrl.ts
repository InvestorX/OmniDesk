/**
 * ユーザーが追加するカスタムURLの定義
 */
export interface CustomUrlEntry {
  /** 一意識別子 (UUID) */
  id: string;
  /** 表示名 */
  label: string;
  /** URL */
  url: string;
  /** アイコン名 (Lucide Icons) またはファビコンURL */
  icon: string;
  /** 作成日時 */
  createdAt: string;
}
