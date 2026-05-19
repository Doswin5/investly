import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-emerald-400 font-medium"
      : "text-slate-300 hover:text-white";

  return (
    <header className="bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold text-white">
          Investly
        </Link>

        <nav className="flex items-center gap-5">
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/portfolios" className={linkClass}>
            Portfolios
          </NavLink>

          {user?.role === "admin" && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}

          <span className="text-slate-400 text-sm">
            {user?.name} · {user?.role}
          </span>

          <button
            onClick={handleLogout}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}