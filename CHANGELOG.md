# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-04-05

### Added
- **Settings Panel UI**: 新しいサイドパネル形式の設定画面を実装。
- **Animations**: パネル表示時の `slide-in-right` および `fade-in` アニメーションを追加。
- **Scrollbar Styles**: 設定パネル内にカスタマイズされたスクロールバーを実装。

### Changed
- **App Layout**: 設定パネルを絶対配置（オーバーレイ）から、メインエリアと並列の Flexbox レイアウトに変更。
- **Webview Resizing**: 設定パネルの開閉に連動してメインエリアが縮小し、`ResizeObserver` を介して Webview が自動的に追従リサイズされる仕組みを確立。
- **State Management**: `isSettingsOpen` を `AppContext` に統合し、アプリ全体でパネル状態を同期。

### Fixed
- **Settings Visibility**: Tauri のネイティブ Webview の背後に設定メニューが隠れてしまう問題を、並列配置への変更によって OmniDesk の UI 構造として根本解決。
- **Webview Logic**: `useWebview.ts` において、サービス切り替え失敗時のロールバック処理が誤ったステートを参照する不具合（Race Condition）を修正。
