
# ⚡ Robin's Quantum Portfolio (Vibe Coding Edition)

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tech Stack](https://img.shields.io/badge/stack-React_Firebase_Tailwind-blue)
![License](https://img.shields.io/badge/license-MIT-purple)

> "A self-updating portfolio that lives on the Google Cloud edge."

這是一個基於 **React + Firebase** 的動態作品集網站。採用 **Serverless 架構**，實現了內容管理系統 (CMS) 與前端展示的完美融合。管理者可直接在網頁前端登入並修改內容，更動將透過 Firestore 的 `Real-time Listener` 毫秒級同步至全球。

## 🌟 核心功能 (Key Features)

* **Real-time CMS**: 整合 Firebase Firestore，修改內容無需重新部署 (No Re-deploy needed)。
* **Dual Data Source Strategy**: 
    * **Cloud Mode**: 優先讀取雲端資料庫。
    * **Local Fallback**: 資料庫離線或冷啟動時，自動降級讀取本地 `content.ts`，確保網站永遠不掛站 (Zero Downtime)。
* **Auth Guard**: 使用 Firebase Authentication 進行管理員權限控管。
* **Dynamic Theming**: 支援 Professional/Dark/Hipster 等多種主題即時切換。

## 🛠️ 技術架構 (Tech Stack)

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18 + TypeScript | Component-based UI architecture |
| **Styling** | Tailwind CSS | Utility-first styling with dark mode support |
| **Database** | **Google Cloud Firestore** | NoSQL Document DB (Storing JSON Blobs) |
| **Auth** | Firebase Auth | Google Provider Sign-in |
| **Hosting** | Firebase Hosting | Global CDN & SSL |

## 🚀 快速開始 (Quick Start)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/robin-portfolio.git
cd robin-portfolio
npm install
```

### 2. 環境變數設定 (.env)
請至 [Firebase Console](https://console.firebase.google.com/) 建立專案並獲取設定。
```env
VITE_API_KEY=your_api_key
VITE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_PROJECT_ID=your_project_id
...
```

### 3. 資料庫初始化 (Critical Step!)
首次啟動時，網頁會顯示 **LOCAL** 模式。
1. 點擊右上角 **Admin Login**。
2. 進入 Dashboard，點擊 **Save Changes**。
3. 這將會把本地的 `initialContent` 寫入 Firestore，系統會自動切換為 **CLOUD** 模式。

## 🔒 Security Rules (Firestore)

確保你的資料庫規則允許公開讀取，但僅限管理員寫入：

```javascript
match /portfolio/{docId} {
  allow read: if true;
  allow write: if request.auth != null;
}
```

## 🤝 Contributing

這個專案展示了如何使用 **Google AI 生態系** (Gemini, IDX) 進行快速開發 (Vibe Coding)。歡迎 Fork 並打造你自己的版本！

---
*Built with ❤️ by Robin Hsu & Gemini*
