
# ⚡ Robin's Quantum Portfolio (Vibe Coding Edition)

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tech Stack](https://img.shields.io/badge/stack-React_Firebase_Tailwind-blue)
![License](https://img.shields.io/badge/license-MIT-purple)

> "A self-updating portfolio that lives on the Google Cloud edge."

這是一個基於 **React + Firebase** 的動態作品集網站。採用 **Serverless 架構**，實現了內容管理系統 (CMS) 與前端展示的完美融合。

**Current Database**: `robin-portfolio-app`

## 🌟 核心功能 (Key Features)

* **Real-time CMS**: 整合 Firebase Firestore，修改內容無需重新部署。
* **Cloud First**: 優先讀取雲端資料庫 `robin-portfolio-app`。
* **Auth Guard**: 使用 Firebase Authentication 進行管理員權限控管。
* **Dynamic Theming**: 支援 Professional/Dark/Hipster 等多種主題即時切換。

## 🛠️ 技術架構 (Tech Stack)

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18 + TypeScript | Component-based UI architecture |
| **Styling** | Tailwind CSS | Utility-first styling with dark mode support |
| **Database** | **Google Cloud Firestore** | NoSQL Document DB (Storing JSON Blobs) |
| **Hosting** | Firebase Hosting | Global CDN & SSL |

## 🚀 部署指南 (Deployment) - CRITICAL!

由於瀏覽器無法直接執行 `.tsx` 檔案，部署前 **必須** 進行打包 (Build)。

### 1. 本地開發 (Local Dev)
```bash
npm install
npm run dev
```

### 2. 正式部署 (Deploy to Production)
**重要**：請務必先執行 `build` 指令，將 TSX 編譯為 JS。

```bash
# 1. 編譯程式碼 (產生 /dist 資料夾)
npm run build

# 2. 部署到 Firebase (會自動上傳 dist 資料夾)
firebase deploy
```

> **注意**: `firebase.json` 已設定為指向 `dist` 目錄。若沒有先 Build，網站將會出現 MIME Type 錯誤。

## 🔒 Security Rules (Firestore)

確保你的資料庫規則允許公開讀取，但僅限管理員寫入：

```javascript
match /portfolio/{docId} {
  allow read: if true;
  allow write: if request.auth != null;
}
```
