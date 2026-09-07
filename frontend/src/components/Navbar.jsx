import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  Brain,
  BarChart3,
  MessageSquare,
  FileSearch,
  History,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import "./Navbar.css";

const NAV_ITEMS = [
  { to: "/dashboard",        label: "Dashboard",        Icon: LayoutDashboard },
  { to: "/career-details",   label: "Career Details",   Icon: Briefcase },
  { to: "/learning-path",    label: "Learning Path",    Icon: BookOpen },
  { to: "/ai-recommendation",label: "AI Recommendation",Icon: Brain },
  { to: "/skill-gap",        label: "Skill Gap",        Icon: BarChart3 },
  { to: "/ai-chat",          label: "AI Advisor",       Icon: MessageSquare },
  { to: "/resume-analyzer",  label: "Resume Analyzer",  Icon: FileSearch },
  { to: "/resume-history",   label: "Resume History",   Icon: History },
  { to: "/profile",          label: "Profile",          Icon: User },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const token     = localStorage.getItem("token");

  // Close on route change
  useEffect(() => {
    const closeMenu = window.setTimeout(() => setOpen(false), 0);
    return () => window.clearTimeout(closeMenu);
  }, [location.pathname]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (to) => location.pathname === to;

  if (!token) {
    // Public top bar for unauthenticated users
    return (
      <nav className="pub-nav" aria-label="Main navigation">
        <div className="pub-nav-inner">
          <Link to="/" className="nav-brand" aria-label="Career Intelligence home">
            <div className="nav-logo-mark" aria-hidden="true">
              <Brain size={18} strokeWidth={2} />
            </div>
            <span className="nav-brand-text">Career Intelligence</span>
          </Link>
          <div className="pub-nav-actions">
            <Link to="/login"    className="pub-nav-link">Sign in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* ── Mobile top bar ─────────────────────────── */}
      <div className="mobile-topbar" aria-label="Mobile navigation bar">
        <Link to="/dashboard" className="nav-brand">
          <div className="nav-logo-mark" aria-hidden="true">
            <Brain size={16} strokeWidth={2} />
          </div>
          <span className="nav-brand-text">Career Intelligence</span>
        </Link>
        <button
          className="mobile-menu-btn"
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="sidebar-nav"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Mobile overlay ─────────────────────────── */}
      {open && (
        <div
          className="sidebar-overlay"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────── */}
      <aside
        id="sidebar-nav"
        className={`sidebar ${open ? "sidebar--open" : ""}`}
        aria-label="Application navigation"
      >
        {/* Brand */}
        <div className="sidebar-brand">
          <Link to="/dashboard" className="nav-brand" onClick={() => setOpen(false)}>
            <div className="nav-logo-mark" aria-hidden="true">
              <Brain size={18} strokeWidth={2} />
            </div>
            <span className="nav-brand-text">Career Intelligence</span>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="sidebar-nav" aria-label="Primary navigation">
          <ul role="list">
            {NAV_ITEMS.map(({ to, label, Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`sidebar-link ${isActive(to) ? "sidebar-link--active" : ""}`}
                  aria-current={isActive(to) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  <Icon
                    size={17}
                    strokeWidth={isActive(to) ? 2.2 : 1.8}
                    className="sidebar-link-icon"
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                  {isActive(to) && (
                    <ChevronRight size={14} className="sidebar-link-chevron" aria-hidden="true" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer: Logout */}
        <div className="sidebar-footer">
          <div className="sidebar-divider" aria-hidden="true" />
          <button
            className="sidebar-logout"
            type="button"
            onClick={handleLogout}
          >
            <LogOut size={17} strokeWidth={1.8} aria-hidden="true" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Navbar;
