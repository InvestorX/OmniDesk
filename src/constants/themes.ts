import { ThemeDefinition } from "../types/theme";

/**
 * 定義済みテーマ一覧
 */
export const THEMES: ThemeDefinition[] = [
  {
    id: "default",
    label: "Sakura Pink",
    colors: {
      primary: "#ff6b9d",
      accent: "#00d4ff",
      bgStart: "#ffffff",
      bgMid: "#fff0f5",
      bgEnd: "#f0f8ff",
      sidebarBg: "#fafbfc",
      textPrimary: "#1a1a2e",
      textSecondary: "#6b7280",
      badge: "#ef4444",
      shadow: "0 2px 8px rgba(0,0,0,0.08)",
    },
  },
  {
    id: "light",
    label: "Clean Light",
    colors: {
      primary: "#4285f4",
      accent: "#34a853",
      bgStart: "#ffffff",
      bgMid: "#f8f9fa",
      bgEnd: "#f8f9fa",
      sidebarBg: "#f1f3f4",
      textPrimary: "#202124",
      textSecondary: "#5f6368",
      badge: "#d93025",
      shadow: "0 2px 8px rgba(0,0,0,0.08)",
    },
  },
  {
    id: "dark",
    label: "Cyber Dark",
    colors: {
      primary: "#00ff88",
      accent: "#00d4ff",
      bgStart: "#0a0a1a",
      bgMid: "#0d1117",
      bgEnd: "#0d1117",
      sidebarBg: "#0d1117",
      textPrimary: "#e6edf3",
      textSecondary: "#8b949e",
      badge: "#00ff88",
      shadow: "0 2px 8px rgba(0,0,0,0.8)",
    },
  },
];
