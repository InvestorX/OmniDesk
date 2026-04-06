import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarToggleProps {
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * サイドバーの展開/折りたたみトグルボタン
 * @param props.isExpanded - 現在の展開状態
 * @param props.onToggle - トグル時のコールバック
 * @return React.JSX.Element
 */
export function SidebarToggle({ isExpanded, onToggle }: SidebarToggleProps): React.JSX.Element {
  return (
    <button
      onClick={onToggle}
      className="p-2 m-2 rounded-lg hover:bg-black/5 flex items-center justify-center transition-colors text-[var(--color-text-secondary)]"
      title="Toggle Sidebar"
    >
      {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </button>
  );
}
