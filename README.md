# OmniDesk

<div align="center">

**A modern, all-in-one workspace hub for productivity services**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.0-green.svg)](package.json)
[![Tauri](https://img.shields.io/badge/Tauri-2.0-blue.svg)](https://tauri.app/)

[English](README.md) | [日本語](README.ja.md)

</div>

---

## 📖 Overview

OmniDesk is a desktop application that brings all your essential productivity services together in one elegant interface. Built with Tauri, React, and TypeScript, it provides a lightweight, secure, and customizable workspace hub for managing your daily workflow.

### Key Features

- 🎯 **Unified Workspace**: Access multiple services (Gmail, Google Chat, Calendar, Drive, Gemini AI, etc.) from a single application
- 🎨 **Beautiful Themes**: Multiple pre-built themes including Sakura Pink, Clean Light, and Cyber Dark
- 🔔 **Smart Notifications**: Real-time notification badges for services like Gmail, Calendar, and Chat
- 🌐 **Custom URLs**: Add your own custom services and web apps to the sidebar
- ⚡ **Native Performance**: Built on Tauri for a lightweight, fast, and secure desktop experience
- 🎭 **Modern UI**: Smooth animations, custom scrollbars, and a polished interface
- 🔧 **Highly Customizable**: Flexible theming system and extensible service definitions

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Rust](https://www.rust-lang.org/) (latest stable version)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/InvestorX/OmniDesk.git
   cd OmniDesk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in development mode**
   ```bash
   npm run tauri dev
   ```

4. **Build for production**
   ```bash
   npm run tauri build
   ```

## 🎨 Built-in Services

### AI Assistants
- **Gemini**: Google's advanced AI assistant
- **NotebookLM**: AI-powered note-taking and research assistant

### Communication
- **Gmail**: Email management with notification support
- **Google Chat**: Team messaging and collaboration
- **Google Meet**: Video conferencing

### Workspace
- **Calendar**: Schedule and event management with notifications
- **Drive**: Cloud storage and file management
- **Docs**: Document editing and creation
- **Sheets**: Spreadsheet management
- **Slides**: Presentation creation

### Custom
- Add your own services via the Custom URL Manager

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4.2
- **Desktop Framework**: Tauri 2.0
- **Backend**: Rust
- **Icons**: Lucide React
- **Build Tool**: Vite 7.0

## 📁 Project Structure

```
OmniDesk/
├── src/                      # React frontend source
│   ├── components/           # UI components
│   │   ├── Sidebar/          # Sidebar navigation
│   │   ├── MainArea/         # Main content area with webview
│   │   ├── Settings/         # Settings panel and preferences
│   │   └── common/           # Reusable UI components
│   ├── context/              # React context providers
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript type definitions
│   ├── constants/            # Service definitions and themes
│   └── utils/                # Utility functions
├── src-tauri/                # Tauri Rust backend
│   ├── src/                  # Rust source code
│   ├── Cargo.toml            # Rust dependencies
│   └── tauri.conf.json       # Tauri configuration
└── public/                   # Static assets
```

## ⚙️ Configuration

### Adding Custom Services

1. Open the Settings panel (gear icon in the sidebar)
2. Navigate to the "Custom URLs" section
3. Click "Add Custom URL"
4. Enter a label and URL for your service
5. The new service will appear in the Custom group in the sidebar

### Changing Themes

1. Open the Settings panel
2. Navigate to the "Theme" section
3. Select from available themes:
   - Cherry Blossom Pink (default)
   - Neon Blue
   - Forest Green
   - Sunset Orange

## 🔐 Security

OmniDesk is built with security in mind:
- Content Security Policy (CSP) enforcement
- Sandboxed webviews for each service
- No data collection or tracking
- All preferences stored locally

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- Extensions:
  - [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
  - [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build the React application
- `npm run preview` - Preview the production build
- `npm run tauri dev` - Run the Tauri application in development mode
- `npm run tauri build` - Build the Tauri application for production

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tauri](https://tauri.app/) - For the amazing desktop framework
- [React](https://react.dev/) - For the UI library
- [Tailwind CSS](https://tailwindcss.com/) - For the styling system
- [Lucide](https://lucide.dev/) - For the beautiful icons

## 📮 Contact

For questions, suggestions, or issues, please open an issue on [GitHub](https://github.com/InvestorX/OmniDesk/issues).

---

<div align="center">
Made with ❤️ by the OmniDesk Team
</div>
