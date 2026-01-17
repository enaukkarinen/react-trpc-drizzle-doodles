import { Routes, Route } from "react-router-dom";

import { About } from "./pages/About";
import { Home } from "./pages/Home";
import { FeedbackDetail } from "./pages/FeedbackDetail";
import { NavigationBar } from "./components/NavigationBar";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation */}
      <NavigationBar />

      {/* Page content */}
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/feedback/:id" element={<FeedbackDetail />} />
        </Routes>
      </main>
    </div>
  );
}
