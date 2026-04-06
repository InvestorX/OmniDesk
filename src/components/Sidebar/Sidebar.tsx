import { useState, useCallback } from "react";
import { useAppContext } from "../../context/AppContext";
import { useWebview } from "../../hooks/useWebview";
import { SERVICES, GROUP_LABELS } from "../../constants/services";
import { SidebarGroup } from "./SidebarGroup";
import { SidebarToggle } from "./SidebarToggle";
import { classNames } from "../../utils/classNames";
import { Settings as SettingsIcon } from "lucide-react";
import { ServiceDefinition } from "../../types/service";
import { ContextMenu, MenuItem } from "../common/ContextMenu";

/**
 * サイドバーコンポーネント
 * @param props - コンポーネントのプロパティ（現在はなし）
 * @return React.JSX.Element - サイドバーの表示要素
 */
export function Sidebar(): React.JSX.Element {
  const { state, dispatch } = useAppContext();
  const { switchToService, openInNewWindow } = useWebview();
  const [contextMenuState, setContextMenuState] = useState<{ show: boolean; x: number; y: number; service: ServiceDefinition | null }>({ show: false, x: 0, y: 0, service: null });

  /** サイドバーの展開/折りたたみをトグル */
  const handleToggle = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  };

  /** コンテキストメニュー表示ハンドラ */
  const handleContextMenu = (service: ServiceDefinition, e: React.MouseEvent) => {
    setContextMenuState({ show: true, x: e.clientX, y: e.clientY, service });
  };

  const contextMenuItems: MenuItem[] = [
    {
      label: "新しいウィンドウで開く",
      icon: "ExternalLink",
      onClick: () => {
        if (contextMenuState.service) {
          openInNewWindow(contextMenuState.service.id, contextMenuState.service.url).catch(console.error);
        }
      }
    }
  ];

  /**
   * サービス選択時のハンドラ
   * @param service - 選択されたサービス定義
   */
  const handleSelectService = useCallback((service: ServiceDefinition) => {
    switchToService(service.id, service.url).catch(console.error);
  }, [switchToService]);

  const allServices = [...SERVICES, ...state.customServices];

  // グループ化
  const groupedServices = Object.keys(GROUP_LABELS).map((groupKey) => ({
    key: groupKey,
    label: GROUP_LABELS[groupKey],
    items: allServices.filter((s) => s.group === groupKey),
  }));

  const notificationCounts = Object.fromEntries(
    Object.entries(state.services).map(([id, s]) => [id, s.notificationCount])
  );

  return (
    <>
      {contextMenuState.show && contextMenuState.service && (
        <ContextMenu
          items={contextMenuItems}
          position={{ x: contextMenuState.x, y: contextMenuState.y }}
          onClose={() => setContextMenuState({ ...contextMenuState, show: false })}
        />
      )}
      <aside
      className={classNames(
        "flex flex-col h-full bg-[var(--color-sidebar-bg)] border-r border-[#0000000a] transition-all duration-300 ease-in-out shadow-lg z-20",
        state.isSidebarExpanded ? "w-52" : "w-16"
      )}
    >
      <div className="flex items-center justify-between p-2 flex-shrink-0">
        {state.isSidebarExpanded && (
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] ml-2 whitespace-nowrap overflow-hidden text-ellipsis">
            Hub
          </span>
        )}
        <SidebarToggle isExpanded={state.isSidebarExpanded} onToggle={handleToggle} />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 cs-scrollbar">
        {groupedServices.map((group) => (
          <SidebarGroup
            key={group.key}
            label={group.label}
            services={group.items}
            isExpanded={state.isSidebarExpanded}
            activeServiceId={state.activeServiceId}
            notificationCounts={notificationCounts}
            onSelect={handleSelectService}
            onContextMenu={handleContextMenu}
          />
        ))}
      </div>

      <div className="p-2 border-t border-[#00000010] flex-shrink-0">
        <button
          onClick={() => dispatch({ type: "SET_SETTINGS_OPEN", isOpen: !state.isSettingsOpen })}
          className="flex items-center justify-center w-full p-2.5 rounded-xl text-[var(--color-text-secondary)] hover:bg-black/5 hover:text-[var(--color-text-primary)] transition-colors outline-none"
        >
          <SettingsIcon size={20} className={state.isSidebarExpanded ? "mr-2" : ""} />
          {state.isSidebarExpanded && <span className="text-sm font-medium">Settings</span>}
        </button>
      </div>
    </aside>
    </>
  );
}
