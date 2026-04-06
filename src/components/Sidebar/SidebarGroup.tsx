import { ServiceDefinition } from "../../types/service";
import { SidebarItem } from "./SidebarItem";

interface SidebarGroupProps {
  label: string;
  services: ServiceDefinition[];
  isExpanded: boolean;
  activeServiceId: string | null;
  notificationCounts: Record<string, number>;
  onSelect: (service: ServiceDefinition) => void;
  onContextMenu: (service: ServiceDefinition, e: React.MouseEvent) => void;
}

/**
 * サイドバー内のグループセクション
 * @param props.label - グループ名
 * @param props.services - グループ内のサービス定義配列
 * @return React.JSX.Element | null
 */
export function SidebarGroup({ label, services, isExpanded, activeServiceId, notificationCounts, onSelect, onContextMenu }: SidebarGroupProps): React.JSX.Element | null {
  if (services.length === 0) return null;

  return (
    <div className="mb-6">
      {isExpanded && (
        <h3 className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          {label}
        </h3>
      )}
      <div className="flex flex-col gap-1 items-center md:items-stretch">
        {services.map((service) => (
          <SidebarItem
            key={service.id}
            service={service}
            isActive={activeServiceId === service.id}
            notificationCount={notificationCounts[service.id] || 0}
            isExpanded={isExpanded}
            onClick={() => onSelect(service)}
            onContextMenu={(e) => onContextMenu(service, e)}
          />
        ))}
      </div>
    </div>
  );
}
