import { useEffect } from "react";
import { AppProvider, useAppContext } from "./context/AppContext";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { MainArea } from "./components/MainArea/MainArea";
import { SettingsPanel } from "./components/Settings/SettingsPanel";
import { useNotification } from "./hooks/useNotification";
import { useTheme } from "./hooks/useTheme";
import { useCustomUrl } from "./hooks/useCustomUrl";

/**
 * アプリ本体のコンテンツ部分
 * テーマ復元・カスタムURL読み込み・通知購読を初期化する
 * @return React.JSX.Element - サイドバー、メインエリア、設定パネルを含むレイアウト
 */
function AppContent() {
  const { state, dispatch } = useAppContext();
  const { restoreTheme } = useTheme();
  const { loadCustomUrls } = useCustomUrl();
  useNotification();

  useEffect(() => {
    restoreTheme();
    loadCustomUrls().catch(console.error);
  }, []);

  return (
    <div className="flex h-screen w-screen bg-[var(--color-bg-start)] overflow-hidden font-sans relative">
      <Sidebar />
      <MainArea />
      <SettingsPanel 
        isOpen={state.isSettingsOpen} 
        onClose={() => dispatch({ type: "SET_SETTINGS_OPEN", isOpen: false })} 
      />
    </div>
  );
}

/**
 * ルートアプリケーションコンポーネント
 * @return React.JSX.Element - Providerでラップされたアプリ
 */
export default function App(): React.JSX.Element {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
