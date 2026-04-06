import React, { useEffect, useRef } from "react";
import * as LucideIcons from "lucide-react";
import { classNames } from "../../utils/classNames";

export interface MenuItem {
  label: string;
  icon?: string;
  onClick: () => void;
}

interface ContextMenuProps {
  items: MenuItem[];
  position: { x: number; y: number };
  onClose: () => void;
}

/**
 * 汎用のコンテキストメニューコンポーネント
 */
export function ContextMenu({ items, position, onClose }: ContextMenuProps): React.JSX.Element {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 外側クリックでメニューを閉じる
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-xl shadow-lg py-1 w-48 text-sm text-[var(--color-text-primary)]"
      style={{ top: position.y, left: position.x }}
    >
      {items.map((item, index) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const IconComponent = item.icon ? (LucideIcons as any)[item.icon] : null;

        return (
          <button
            key={index}
            className={classNames(
              "w-full text-left px-4 py-2 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] flex items-center transition-colors"
            )}
            onClick={() => {
              item.onClick();
              onClose();
            }}
          >
            {IconComponent && <IconComponent size={16} className="mr-2" />}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
