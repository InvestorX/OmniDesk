import { useState } from "react";
import { useCustomUrl } from "../../hooks/useCustomUrl";
import { useAppContext } from "../../context/AppContext";
import { Plus, Trash2, Link as LinkIcon } from "lucide-react";

/**
 * カスタムURL管理コンポーネント
 * @return React.JSX.Element
 */
export function CustomUrlManager(): React.JSX.Element {
  const { addCustomUrl, removeCustomUrl } = useCustomUrl();
  const { state } = useAppContext();
  
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");

  /**
   * フォーム送信時のハンドラ
   * URLをバリデーションしてTauriバックエンドへ追加する
   * @param e - フォームイベント
   */
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !url.trim()) return;

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }
    try {
      const parsedUrl = new URL(formattedUrl);
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        console.error("Invalid protocol detected");
        return;
      }
      formattedUrl = parsedUrl.href;
    } catch {
      console.error("Invalid URL format");
      return;
    }

    try {
      await addCustomUrl({
        id: crypto.randomUUID(),
        label: label.trim(),
        url: formattedUrl,
        icon: "Link",
        createdAt: new Date().toISOString(),
      });
      setLabel("");
      setUrl("");
    } catch (error) {
      console.error("Failed to add custom URL:", error);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-4 text-[var(--color-text-primary)] pl-1">Custom Endpoints</h3>
      
      {/* 登録フォーム */}
      <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-3 mb-6 p-4 bg-white/30 dark:bg-black/30 backdrop-blur rounded-[var(--radius-card)] border border-black/5 dark:border-white/5">
        <div className="flex-1">
          <label className="block text-xs font-semibold mb-1 text-[var(--color-text-secondary)]">Label</label>
          <input
            type="text"
            placeholder="e.g. My Nextcloud"
            className="w-full px-3 py-2 bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all font-medium"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="flex flex-col flex-[2]">
          <label className="block text-xs font-semibold mb-1 text-[var(--color-text-secondary)]">URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://cloud.example.com"
              className="flex-1 px-3 py-2 bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all font-mono"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              type="submit"
              disabled={!label.trim() || !url.trim()}
              className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[#ff85af] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-colors shadow-sm font-semibold"
            >
              <Plus size={18} className="mr-1" /> Add
            </button>
          </div>
        </div>
      </form>

      {/* 一覧表示 */}
      <div className="space-y-2">
        {state.customServices.map((service) => (
          <div key={service.id} className="group flex items-center justify-between p-3 bg-white/40 dark:bg-black/40 hover:bg-white/60 hover:dark:bg-black/60 rounded-xl border border-transparent hover:border-black/5 dark:hover:border-white/5 transition-all">
            <div className="flex items-center overflow-hidden pr-4">
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mr-3 flex-shrink-0">
                <LinkIcon size={14} className="text-[var(--color-primary)]" />
              </div>
              <div className="flex flex-col truncate">
                <span className="font-semibold text-sm text-[var(--color-text-primary)] truncate">{service.label}</span>
                <span className="text-xs text-[var(--color-text-secondary)] font-mono truncate">{service.url}</span>
              </div>
            </div>
            
            <button
              onClick={() => removeCustomUrl(service.id)}
              className="p-2 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white rounded-lg transition-all focus:opacity-100 flex-shrink-0"
              title="Remove"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {state.customServices.length === 0 && (
          <div className="text-center py-8 text-[var(--color-text-secondary)] text-sm italic border-2 border-dashed border-black/5 dark:border-white/5 rounded-[var(--radius-card)]">
            No custom endpoints added yet.
          </div>
        )}
      </div>
    </div>
  );
}
