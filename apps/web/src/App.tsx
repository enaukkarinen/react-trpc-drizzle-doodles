import { Routes, Route, Navigate } from "react-router-dom";

import { AboutPage } from "./pages/AboutPage";
import { HomePage } from "./pages/HomePage";
import { FeedbackDetailPage } from "./pages/FeedbackDetailPage";
import { ChatPage } from "./pages/ChatPage";

import { NavigationBar } from "./components/NavigationBar";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavigationBar />

      <main className="mx-auto max-w-5xl px-4 py-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/feedback/:id" element={<FeedbackDetailPage />} />

          <Route path="/chat" element={<ChatPage />} />

          {/* Redirects */}
          <Route path="/feedback" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
