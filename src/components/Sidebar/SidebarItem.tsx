import { ServiceDefinition } from "../../types/service";
import { NotificationBadge } from "../Badge/NotificationBadge";
import { Tooltip } from "../common/Tooltip";
import { classNames } from "../../utils/classNames";
import * as LucideIcons from "lucide-react";

interface SidebarItemProps {
  service: ServiceDefinition;
  isActive: boolean;
  notificationCount: number;
  isExpanded: boolean;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

/**
 * サイドバーの各サービスアイテム
 * @param props.service - サービス定義
 * @param props.isActive - アクティブ状態
 * @param props.notificationCount - 未読通知数
 * @param props.isExpanded - サイドバー展開状態
 * @param props.onClick - クリック時のコールバック
 * @param props.onContextMenu - 右クリック時のコールバック
 * @return React.JSX.Element
 */
export function SidebarItem({ service, isActive, notificationCount, isExpanded, onClick, onContextMenu }: SidebarItemProps): React.JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Globe;

  const content = (
    <button
      onClick={onClick}
      onContextMenu={(e) => {
        if (onContextMenu) {
          e.preventDefault();
          onContextMenu(e);
        }
      }}
      className={classNames(
        "relative flex items-center w-full px-3 py-2.5 mb-1 rounded-xl transition-all duration-200 outline-none",
        isActive
          ? "border-l-4 border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-sm"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] hover:scale-105"
      )}
    >
      <div className="relative flex-shrink-0">
        <IconComponent size={22} className={classNames("transition-colors", isActive ? "text-[var(--color-primary)]" : "")} />
        {service.hasNotification && (
          <NotificationBadge count={notificationCount} />
        )}
      </div>
      
      {isExpanded && (
        <span className="ml-3 text-sm font-medium truncate">
          {service.label}
        </span>
      )}
    </button>
  );

  if (!isExpanded) {
    return <Tooltip content={service.label}>{content}</Tooltip>;
  }
  return content;
}
