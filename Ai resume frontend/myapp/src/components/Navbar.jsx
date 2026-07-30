import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">🧠 AI Resume Tracker</div>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Board
        </NavLink>
        <NavLink to="/scorer" className={({ isActive }) => (isActive ? "active" : "")}>
          Resume Scorer
        </NavLink>
      </div>
    </nav>
  );
}