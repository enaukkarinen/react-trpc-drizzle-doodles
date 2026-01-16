import { Routes, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home";
import { FeedbackDetail } from "./pages/FeedbackDetail";

export default function App() {
  return (
    <div>
      <nav className="border-b p-4 flex gap-4">
        <Link className="underline" to="/">
          Home
        </Link>
        <Link className="underline" to="/feedback/123">
          Example detail
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feedback/:id" element={<FeedbackDetail />} />
      </Routes>
    </div>
  );
}
