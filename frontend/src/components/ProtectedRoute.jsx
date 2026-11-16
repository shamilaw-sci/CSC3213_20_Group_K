import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { AUTH_USER_KEY, getRoleHome } from "../auth/session";

/**
 * Wraps any route that requires a valid JWT token.
 * Redirects to /login if no token is found in localStorage.
 */
function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return undefined;
    }

    let active = true;
    axios.get("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(({ data }) => {
      if (!active) return;
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
    }).catch(() => {
      if (!active) return;
      localStorage.removeItem("token");
      localStorage.removeItem(AUTH_USER_KEY);
      setUser(null);
    }).finally(() => {
      if (active) setLoading(false);
    });

    return () => { active = false; };
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div className="auth-session-loading" role="status">Opening your workspace…</div>;
  }

  if (!user?.role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return children;
}

export default ProtectedRoute;
