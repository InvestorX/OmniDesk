import { ThemeSelector } from "./ThemeSelector";
import { CustomUrlManager } from "./CustomUrlManager";
import { X, Settings2 } from "lucide-react";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 設定パネルコンポーネント（右側のサイドパネル）
 * @param props.isOpen - 表示状態
 * @param props.onClose - 閉じるコールバック
 * @return React.JSX.Element | null - 表示要素
 */
export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps): React.JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div className="w-96 h-full bg-[var(--color-sidebar-bg)] shadow-[var(--shadow-soft)] animate-slide-in-right flex flex-col font-sans border-l border-black/5 dark:border-white/5 flex-shrink-0 z-30">
      
      <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center">
          <Settings2 className="mr-3 text-[var(--color-primary)]" size={24} /> 
          Preferences
        </h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[var(--color-text-secondary)] hover:text-red-500"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 cs-scrollbar">
        <ThemeSelector />
        <hr className="my-8 border-black/5 dark:border-white/5" />
        <CustomUrlManager />
      </div>
    </div>
  );
}
