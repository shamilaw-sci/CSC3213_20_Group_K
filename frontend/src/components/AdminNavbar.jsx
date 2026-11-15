import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileSearch,
  History,
  ArrowLeft,
  LogOut,
  Brain,
  Menu,
  X,
  ChevronRight,
  Shield,
} from "lucide-react";
import "./Navbar.css"; // reuse existing sidebar CSS

const ADMIN_NAV = [
  { to: "/admin",         label: "Dashboard",        Icon: LayoutDashboard },
  { to: "/admin/users",   label: "User Management",  Icon: Users },
  { to: "/admin/careers", label: "Career Management", Icon: Briefcase },
  { to: "/admin/cv-analyses", label: "CV Analysis", Icon: FileSearch },
  { to: "/admin/recommendations", label: "AI Recommendation History", Icon: History },
];

function AdminNavbar() {
  const [open, setOpen]   = useState(false);
  const navigate           = useNavigate();
  const location           = useLocation();

  useEffect(() => {
    const t = window.setTimeout(() => setOpen(false), 0);
    return () => window.clearTimeout(t);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const isActive = (to) => location.pathname === to;

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-topbar" aria-label="Admin navigation bar">
        <Link to="/admin" className="nav-brand">
          <div className="nav-logo-mark" aria-hidden="true">
            <Shield size={16} strokeWidth={2} />
          </div>
          <span className="nav-brand-text">Admin Panel</span>
        </Link>
        <button
          className="mobile-menu-btn"
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="admin-sidebar-nav"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="sidebar-overlay"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="admin-sidebar-nav"
        className={`sidebar sidebar--admin ${open ? "sidebar--open" : ""}`}
        aria-label="Admin navigation"
      >
        {/* Brand */}
        <div className="sidebar-brand">
          <Link to="/admin" className="nav-brand" onClick={() => setOpen(false)}>
            <div className="nav-logo-mark" aria-hidden="true">
              <Brain size={18} strokeWidth={2} />
            </div>
            <span className="nav-brand-text">Admin Panel</span>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="sidebar-nav" aria-label="Admin navigation">
          <ul role="list">
            {ADMIN_NAV.map(({ to, label, Icon }) => (
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

          {/* Back to App */}
          <div className="sidebar-admin-section">
            <div className="sidebar-section-label">Navigation</div>
            <ul role="list">
              <li>
                <Link
                  to="/dashboard"
                  className="sidebar-link"
                  onClick={() => setOpen(false)}
                >
                  <ArrowLeft size={17} strokeWidth={1.8} className="sidebar-link-icon" aria-hidden="true" />
                  <span>Back to App</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-divider" aria-hidden="true" />
          <button className="sidebar-logout" type="button" onClick={handleLogout}>
            <LogOut size={17} strokeWidth={1.8} aria-hidden="true" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminNavbar;
