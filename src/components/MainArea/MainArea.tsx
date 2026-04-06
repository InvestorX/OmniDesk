import React, { useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useAppContext } from "../../context/AppContext";
import { Sparkles } from "lucide-react";

/**
 * メインコンテンツエリア
 * @return React.JSX.Element - Webview表示領域 or ウェルカム画面
 */
export function MainArea(): React.JSX.Element {
  const { state } = useAppContext();
  const mainRef = useRef<HTMLElement>(null);

  // ウィンドウリサイズおよびDOM要素の矩形変更を監視してWebviewを追及させる
  useEffect(() => {
    if (!state.activeServiceId || !mainRef.current) return;

    let rafId: number | null = null;
    let isPending = false;
    let nextRect: DOMRect | null = null;

    const syncLayout = async () => {
      if (!mainRef.current || isPending) {
        return;
      }

      isPending = true;
      rafId = requestAnimationFrame(async () => {
        if (!mainRef.current) {
          isPending = false;
          return;
        }

        const rect = mainRef.current.getBoundingClientRect();
        try {
          await invoke("resize_webviews", { 
            rect: {
              x: rect.left,
              y: rect.top,
              width: rect.width,
              height: rect.height
            }
          });
        } catch (error) {
          console.error("Failed to resize webviews:", error);
        } finally {
          isPending = false;
          // 処理中に次のリクエストが来ていた場合、もう一度実行して最新状態に合わせる
          if (nextRect) {
            nextRect = null;
            syncLayout();
          }
        }
      });
    };

    // ResizeObserver で要素のサイズ/位置の変化を監視
    const observer = new ResizeObserver((entries) => {
      if (isPending) {
        nextRect = entries[0].target.getBoundingClientRect();
      } else {
        syncLayout();
      }
    });

    observer.observe(mainRef.current);
    
    // 初回表示時の強制同期
    syncLayout();

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [state.activeServiceId, state.isSidebarExpanded]);

  if (state.activeServiceId) {
    // Webviewはネイティブ側がこの領域上に描画するため透過コンテナのみ返す
    return <main ref={mainRef} className="flex-1 h-full bg-transparent" />;
  }

  // ウェルカムスクリーン
  return (
    <main className="flex-1 flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in relative overflow-hidden">
        
      {/* 装飾的な背景エフェクト */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)] opacity-10 blur-3xl rounded-full mix-blend-multiply filter pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-accent)] opacity-10 blur-3xl rounded-full mix-blend-multiply filter pointer-events-none" />

      <div className="z-10 bg-white/40 dark:bg-black/40 backdrop-blur-xl p-10 rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-white/20 dark:border-white/5 max-w-lg w-full transform transition-all hover:scale-[1.02]">
        <div className="mx-auto bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-lg">
          <Sparkles className="text-white" size={32} />
        </div>
        <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] tracking-tight">
          Welcome to OmniDesk
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
          Select a service from the sidebar to get started. Navigate seamlessly between your essential tools.
        </p>
      </div>
    </main>
  );
}
