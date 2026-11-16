import { Link, useNavigate } from "react-router-dom";
import { clearAuthSession, getAuthUser } from "../auth/session";
import { Brain, Construction, LogOut } from "lucide-react";
import "./AdminPortalPending.css";

export default function AdminPortalPending() {
  const navigate = useNavigate();
  const user = getAuthUser();

  const signOut = () => {
    clearAuthSession();
    navigate("/login", { replace: true });
  };

  return (
    <main className="admin-pending-page">
      <header className="admin-pending-header">
        <Link to="/admin" className="admin-pending-brand"><span><Brain size={19} /></span> Career Intelligence <small>ADMIN</small></Link>
        <div className="admin-pending-account"><span>{user?.name || "Administrator"}</span><button type="button" onClick={signOut}><LogOut size={16} /> Sign out</button></div>
      </header>
      <section className="admin-pending-card" aria-labelledby="admin-pending-title">
        <span className="admin-pending-icon"><Construction size={27} /></span>
        <p className="admin-pending-eyebrow">ADMIN WORKSPACE</p>
        <h1 id="admin-pending-title">Your admin portal is being prepared</h1>
        <p className="admin-pending-copy">Your administrator account is ready. Thimira’s admin workspace is still in development, so this page will become your starting point when it is connected.</p>
        <div className="admin-pending-status"><span /> Admin portal in development</div>
        <Link to="/" className="admin-pending-home">Return to the website</Link>
      </section>
    </main>
  );
}
