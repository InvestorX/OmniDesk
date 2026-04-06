import { useTheme } from "../../hooks/useTheme";
import { THEMES } from "../../constants/themes";
import { Check } from "lucide-react";
import { classNames } from "../../utils/classNames";

/**
 * テーマ切替セレクターコンポーネント
 * @return React.JSX.Element
 */
export function ThemeSelector(): React.JSX.Element {
  const { currentTheme, setTheme } = useTheme();

  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold mb-4 text-[var(--color-text-primary)] pl-1">Appearance</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {THEMES.map((theme) => {
          const isActive = currentTheme === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className={classNames(
                "relative group flex flex-col p-4 rounded-xl border-2 text-left transition-all overflow-hidden",
                isActive 
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-md" 
                  : "border-transparent bg-white/50 dark:bg-black/20 hover:border-[var(--color-primary)]/50"
              )}
            >
              <div 
                className="w-full h-20 rounded-lg mb-3 shadow-inner relative z-10 p-2 flex"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.bgStart}, ${theme.colors.bgEnd})`,
                  border: `1px solid ${theme.colors.sidebarBg}`
                }}
              >
                <div className="w-1/3 h-full rounded bg-[var(--color-sidebar-bg)] border border-black/5 opacity-80" />
                <div className="w-2/3 h-full flex flex-col justify-between pl-2 pb-1">
                    <div className="w-full h-3 rounded-full mt-1" style={{ backgroundColor: theme.colors.primary }} />
                    <div className="w-1/2 h-2 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
                </div>
              </div>
              
              <div className="flex items-center justify-between z-10">
                  <span className={classNames(
                      "font-medium text-sm transition-colors",
                      isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]"
                  )}>
                    {theme.label}
                  </span>
                  {isActive && <Check size={16} className="text-[var(--color-primary)]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
