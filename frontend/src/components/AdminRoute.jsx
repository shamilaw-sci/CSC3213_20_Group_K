import { Navigate } from "react-router-dom";

/**
 * Wraps any route that requires admin role.
 * Redirects to /login if no token, or to /dashboard if role is not admin.
 */
function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

export default AdminRoute;
