/** テーマモードの定義 */
export type ThemeMode = "default" | "light" | "dark";

/** テーマのカラー定義 */
export interface ThemeColors {
  primary: string;
  accent: string;
  bgStart: string;
  bgMid: string;
  bgEnd: string;
  sidebarBg: string;
  textPrimary: string;
  textSecondary: string;
  badge: string;
  shadow: string;
}

/** テーマ定義 */
export interface ThemeDefinition {
  id: ThemeMode;
  label: string;
  colors: ThemeColors;
}
