import { ThemeMode } from "../types/theme";
import { THEMES } from "../constants/themes";
import { useAppContext } from "../context/AppContext";

/**
 * テーマ切替を管理するカスタムフック
 * @return テーマ操作関数群
 */
export function useTheme() {
  const { state, dispatch } = useAppContext();

  /**
   * ケバブケースへの変換
   */
  const toKebabCase = (str: string) => str.replace(/([A-Z])/g, "-$1").toLowerCase();

  /**
   * テーマを切り替える
   * CSS変数をルート要素に動的適用し、LocalStorageに永続化する
   * @param mode - 切り替え先のテーマモード
   */
  function setTheme(mode: ThemeMode): void {
    const theme = THEMES.find((t) => t.id === mode);
    if (!theme) return;
    
    const root = document.documentElement;
    root.setAttribute("data-theme", mode);
    
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${toKebabCase(key)}`, value as string);
    });
    
    try {
        localStorage.setItem("workspace-hub-theme", mode);
    } catch(e) { }

    dispatch({ type: "SET_THEME", theme: mode });
  }

  /**
   * 保存済みテーマをLocalStorageから復元する
   */
  function restoreTheme(): void {
    try {
        const saved = localStorage.getItem("workspace-hub-theme") as ThemeMode | null;
        setTheme(saved ?? "default");
    } catch(e) {
        setTheme("default");
    }
  }

  return { currentTheme: state.currentTheme, setTheme, restoreTheme };
}
