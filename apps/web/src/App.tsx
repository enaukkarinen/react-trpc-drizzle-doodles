import { Routes, Route, Navigate } from "react-router-dom";

import { AboutPage } from "./pages/AboutPage";
import { HomePage } from "./pages/HomePage";
import { FeedbackDetailPage } from "./pages/FeedbackDetailPage";

import { NavigationBar } from "./components/NavigationBar";
import { lazy, Suspense } from "react";

const ChatPage = lazy(() => import("./features/chat/pages/ChatPage"));
const MapPage = lazy(() => import("./features/map/pages/MapPage"));

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavigationBar />

      <main className="mx-auto max-w-5xl px-4 py-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/feedback/:id" element={<FeedbackDetailPage />} />

          <Route
            path="/chat"
            element={
              <Suspense fallback={<div>Loading chat…</div>}>
                <ChatPage />
              </Suspense>
            }
          />
          <Route
            path="/map"
            element={
              <Suspense fallback={<div>Loading map…</div>}>
                <MapPage />
              </Suspense>
            }
          />

          {/* Redirects */}
          <Route path="/feedback" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
