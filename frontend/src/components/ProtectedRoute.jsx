import { Navigate } from "react-router-dom";

/**
 * Wraps any route that requires a valid JWT token.
 * Redirects to /login if no token is found in localStorage.
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
