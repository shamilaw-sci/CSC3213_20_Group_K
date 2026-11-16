import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Brain } from "lucide-react";
import { getRoleHome, saveAuthSession } from "../auth/session";
import "./Auth.css";

function Login() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      saveAuthSession(response.data);
      navigate(getRoleHome(response.data.user.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left-content">
          <span className="auth-logo" aria-hidden="true">
            <Brain size={26} strokeWidth={2} />
          </span>
          <h1>AI Career Guidance System</h1>
          <p>
            Unlock personalised career roadmaps and AI-powered learning paths
            tailored just for you.
          </p>
          <ul className="auth-perks">
            <li>Smart career recommendations</li>
            <li>Personalised learning paths</li>
            <li>Industry salary insights</li>
            <li>Resume ATS analysis</li>
          </ul>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome back</h2>
            <p>Sign in and we’ll open the workspace for your account.</p>
          </div>

          {error && <div className="auth-error" role="alert">{error}</div>}

          <form onSubmit={loginUser} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
