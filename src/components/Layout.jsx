import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  MapPin,
  Menu,
  PlusCircle,
  LayoutDashboard,
  ClipboardList,
  LogIn,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  function signOut() {
    logout();
    navigate("/");
  }
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark">
            <MapPin size={20} />
          </span>
          <span>
            Mtaa<span>Fix</span>
          </span>
        </Link>
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <Menu />
        </button>
        <nav className={open ? "nav-links open" : "nav-links"}>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/dashboard">
            <LayoutDashboard size={16} /> Dashboard
          </NavLink>
          <NavLink to="/reports">
            <ClipboardList size={16} /> Community reports
          </NavLink>
          {user && (
            <NavLink to="/new-report">
              <PlusCircle size={16} /> Report an issue
            </NavLink>
          )}
        </nav>
        <div className="account-area">
          {user ? (
            <>
              <span className="user-greeting">
                Hi, {user.name.split(" ")[0]}
              </span>
              <button className="btn btn-ghost btn-small" onClick={signOut}>
                <LogOut size={15} /> Sign out
              </button>
            </>
          ) : (
            <Link className="btn btn-primary btn-small" to="/login">
              <LogIn size={15} /> Sign in
            </Link>
          )}
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <span>© {new Date().getFullYear()} MtaaFix</span>
        <span>Stronger neighbourhoods start with being heard.</span>
      </footer>
    </div>
  );
}
