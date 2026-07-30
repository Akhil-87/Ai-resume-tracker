import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import ResumeScorer from "./pages/ResumeScorer";

export default function App() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/";

  return (
    <div className="app-shell">
      {showNavbar && <Navbar />}
      <main className={showNavbar ? "app-main" : ""}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/board" element={<Dashboard />} />
          <Route path="/scorer" element={<ResumeScorer />} />
        </Routes>
      </main>
    </div>
  );
}