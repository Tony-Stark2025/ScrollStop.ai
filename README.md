# 📱 ScrollStop.ai: AI Social Media Carousel Generator

[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.7_Flash-4285F4.svg?logo=google&logoColor=white)](https://ai.google.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**ScrollStop.ai** is an AI-powered content transformation tool that converts articles, transcripts, and long-form thoughts into high-converting visual slide carousels optimized for LinkedIn, Twitter/X, and Instagram.

---

## ✨ Features

- 🧠 **Automated Hook & Outline Generation:** Uses Gemini AI to extract punchy key points, high-retention hooks, and concise slide copy.
- 🎨 **Visual Slide Customizer:** Customize brand color schemes, typography, layout density, and aspect ratios (1:1 and 4:5).
- ⚡ **Real-Time Preview Server:** Live responsive rendering of carousel slide sequences before exporting.
- 📥 **Export to PDF & High-Res PNGs:** Instant download ready for social media upload.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Backend / API:** Node.js / Express Server (`server.ts`)
- **AI Model:** Google Gemini API (`@google/genai`)
- **Bundler:** Vite 6

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Tony-Stark2025/ScrollStop.ai.git
cd ScrollStop.ai
npm install
```

### 2. Configure API Key
Create a `.env.local` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
