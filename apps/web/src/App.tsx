import { Routes, Route, Navigate } from "react-router-dom";

import { About } from "./pages/About";
import { Home } from "./pages/Home";
import { FeedbackDetail } from "./pages/FeedbackDetail";
import { NavigationBar } from "./components/NavigationBar";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavigationBar />

      <main className="mx-auto max-w-5xl px-4 py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/feedback/:id" element={<FeedbackDetail />} />

          {/* Redirects */}
          <Route path="/feedback" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
