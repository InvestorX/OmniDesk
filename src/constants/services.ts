import { ServiceDefinition } from "../types/service";

/**
 * 統合対象サービスの定義一覧
 */
export const SERVICES: ServiceDefinition[] = [
  { id: "gemini", label: "Gemini", url: "https://gemini.google.com", icon: "Sparkles", group: "ai", hasNotification: false },
  { id: "notebooklm", label: "NotebookLM", url: "https://notebooklm.google.com", icon: "BookOpen", group: "ai", hasNotification: false },
  { id: "gmail", label: "Gmail", url: "https://mail.google.com", icon: "Mail", group: "communication", hasNotification: true },
  { id: "chat", label: "Google Chat", url: "https://chat.google.com", icon: "MessageSquare", group: "communication", hasNotification: true },
  { id: "meet", label: "Google Meet", url: "https://meet.google.com", icon: "Video", group: "communication", hasNotification: false },
  { id: "calendar", label: "Calendar", url: "https://calendar.google.com", icon: "CalendarDays", group: "workspace", hasNotification: true },
  { id: "drive", label: "Drive", url: "https://drive.google.com", icon: "HardDrive", group: "workspace", hasNotification: false },
  { id: "docs", label: "Docs", url: "https://docs.google.com", icon: "FileText", group: "workspace", hasNotification: false },
  { id: "sheets", label: "Sheets", url: "https://sheets.google.com", icon: "Sheet", group: "workspace", hasNotification: false },
  { id: "slides", label: "Slides", url: "https://slides.google.com", icon: "Presentation", group: "workspace", hasNotification: false },
];

/**
 * グループの表示ラベルマッピング
 */
export const GROUP_LABELS: Record<string, string> = {
  ai: "AI Assistants",
  communication: "Communication",
  workspace: "Workspace",
  custom: "Custom",
};
