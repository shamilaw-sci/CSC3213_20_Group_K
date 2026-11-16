import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight, BrainCircuit, LockKeyhole, Mail } from "lucide-react";
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

      const user = response.data.user || {
        role: response.data.role === "user" ? "student" : response.data.role || "student",
        name: response.data.name,
        email,
      };
      saveAuthSession({ token: response.data.token, user });
      navigate(getRoleHome(user.role));
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <img
          className="auth-background-image"
          src="/images/ai-career-assistant.jpg.png"
          alt="A student exploring career guidance with an AI assistant"
          fetchPriority="high"
        />
        <div className="auth-image-overlay" aria-hidden="true" />
        <div className="auth-left-content">
          <span className="auth-logo" aria-hidden="true">
            <BrainCircuit size={25} strokeWidth={1.8} />
          </span>
          <span className="auth-kicker">Your future, with direction</span>
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
          <div className="auth-image-caption">
            <span className="auth-caption-indicator" aria-hidden="true" />
            <span>Personalized guidance for your next step</span>
          </div>
        </div>
      </div>

      <main className="auth-right">
        <div className="auth-card">
          <div className="auth-card-mark" aria-hidden="true">
            <BrainCircuit size={19} />
          </div>
          <div className="auth-card-header">
            <span className="auth-form-eyebrow">Welcome to Career Intelligence</span>
            <h2>Welcome back</h2>
            <p>Sign in to continue to your dashboard</p>
          </div>

          {error && <div className="auth-error" role="alert">{error}</div>}

          <form onSubmit={loginUser} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <div className="auth-input-wrap">
                <Mail size={17} aria-hidden="true" />
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
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <LockKeyhole size={17} aria-hidden="true" />
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
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              <span>{loading ? "Signing in…" : "Sign in"}</span>
              {!loading && <ArrowRight size={17} aria-hidden="true" />}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register">Create one free</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
