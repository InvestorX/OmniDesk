# OmniDesk

<div align="center">

**生産性向上サービスのための、モダンなオールインワン・ワークスペースハブ**

[![License](https://img.shields.io/badge/license-SUSHI--WARE-orange.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.0-green.svg)](package.json)
[![Tauri](https://img.shields.io/badge/Tauri-2.0-blue.svg)](https://tauri.app/)

[English](README.md) | [日本語](README.ja.md)

</div>

---

## 📖 概要

OmniDesk は、必要不可欠な生産性向上サービスを一つの洗練されたインターフェースにまとめたデスクトップアプリケーションです。Tauri、React、TypeScript で構築されており、日々のワークフローを管理するための軽量で安全、かつカスタマイズ可能なワークスペースハブを提供します。

### 主な機能

- 🎯 **統合ワークスペース**: Gmail、Google Chat、Calendar、Drive、Gemini AI など、複数のサービスに単一のアプリケーションからアクセス
- 🎨 **美しいテーマ**: Sakura Pink、Clean Light、Cyber Dark のプリセットテーマを搭載
- 🔔 **スマート通知**: Gmail、Calendar、Chat などのサービスにリアルタイム通知バッジを表示
- 🌐 **カスタムURL**: サイドバーに独自のサービスやウェブアプリを追加可能
- ⚡ **ネイティブパフォーマンス**: Tauri による軽量で高速、安全なデスクトップ体験
- 🎭 **モダンUI**: 滑らかなアニメーション、カスタムスクロールバー、洗練されたインターフェース
- 🔧 **高度なカスタマイズ**: 柔軟なテーマシステムと拡張可能なサービス定義

## 🚀 クイックスタート

### 必要な環境

- [Node.js](https://nodejs.org/) (v18以上)
- [Rust](https://www.rust-lang.org/) (最新の安定版)
- [npm](https://www.npmjs.com/) または [yarn](https://yarnpkg.com/)

### インストール

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/InvestorX/OmniDesk.git
   cd OmniDesk
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **開発モードで実行**
   ```bash
   npm run tauri dev
   ```

4. **プロダクション用ビルド**
   ```bash
   npm run tauri build
   ```

## 🎨 組み込みサービス

### AIアシスタント
- **Gemini**: Google の高度なAIアシスタント
- **NotebookLM**: AI駆動のノート作成・リサーチアシスタント

### コミュニケーション
- **Gmail**: 通知機能付きメール管理
- **Google Chat**: チームメッセージングとコラボレーション
- **Google Meet**: ビデオ会議

### ワークスペース
- **Calendar**: 通知機能付きスケジュール・イベント管理
- **Drive**: クラウドストレージとファイル管理
- **Docs**: ドキュメント編集・作成
- **Sheets**: スプレッドシート管理
- **Slides**: プレゼンテーション作成

### カスタム
- カスタムURL マネージャーから独自のサービスを追加

## 🛠️ 技術スタック

- **フロントエンド**: React 19 + TypeScript
- **スタイリング**: Tailwind CSS 4.2
- **デスクトップフレームワーク**: Tauri 2.0
- **バックエンド**: Rust
- **アイコン**: Lucide React
- **ビルドツール**: Vite 7.0

## 📁 プロジェクト構造

```
OmniDesk/
├── src/                      # React フロントエンドのソース
│   ├── components/           # UI コンポーネント
│   │   ├── Sidebar/          # サイドバーナビゲーション
│   │   ├── MainArea/         # Webview を含むメインコンテンツエリア
│   │   ├── Settings/         # 設定パネルと環境設定
│   │   └── common/           # 再利用可能な UI コンポーネント
│   ├── context/              # React コンテキストプロバイダー
│   ├── hooks/                # カスタム React フック
│   ├── types/                # TypeScript 型定義
│   ├── constants/            # サービス定義とテーマ
│   └── utils/                # ユーティリティ関数
├── src-tauri/                # Tauri Rust バックエンド
│   ├── src/                  # Rust ソースコード
│   ├── Cargo.toml            # Rust 依存関係
│   └── tauri.conf.json       # Tauri 設定
└── public/                   # 静的アセット
```

## ⚙️ 設定

### カスタムサービスの追加

1. 設定パネルを開く（サイドバーの歯車アイコン）
2. 「Custom Endpoints」セクションに移動
3. 「Add」をクリック
4. サービスのラベルとURLを入力
5. 新しいサービスがサイドバーのカスタムグループに表示されます

### テーマの変更

1. 設定パネルを開く
2. 「テーマ」セクションに移動
3. 利用可能なテーマから選択:
   - Sakura Pink（デフォルト）
   - Clean Light
   - Cyber Dark

## 🔐 セキュリティ

OmniDesk はセキュリティを念頭に構築されています:
- コンテンツセキュリティポリシー（CSP）の適用
- 各サービスに対してサンドボックス化された Webview
- データ収集やトラッキングなし
- すべての設定はローカルに保存

## 🤝 コントリビューション

コントリビューションを歓迎します！プルリクエストをお気軽に送信してください。大きな変更の場合は、まず Issue を開いて変更内容について議論してください。

1. リポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを開く

## 📝 開発

### 推奨 IDE セットアップ

- [VS Code](https://code.visualstudio.com/)
- 拡張機能:
  - [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
  - [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### 利用可能なスクリプト

- `npm run dev` - Vite 開発サーバーを起動
- `npm run build` - React アプリケーションをビルド
- `npm run preview` - プロダクションビルドをプレビュー
- `npm run tauri dev` - Tauri アプリケーションを開発モードで実行
- `npm run tauri build` - Tauri アプリケーションをプロダクション用にビルド

## 📄 ライセンス

このプロジェクトは SUSHI-WARE ライセンスの下でライセンスされています - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 🙏 謝辞

- [Tauri](https://tauri.app/) - 素晴らしいデスクトップフレームワークを提供
- [React](https://react.dev/) - UI ライブラリを提供
- [Tailwind CSS](https://tailwindcss.com/) - スタイリングシステムを提供
- [Lucide](https://lucide.dev/) - 美しいアイコンを提供

## 📮 お問い合わせ

質問、提案、問題については、[GitHub](https://github.com/InvestorX/OmniDesk/issues) で Issue を開いてください。

---

<div align="center">
OmniDesk Team により ❤️ を込めて作成
</div>
