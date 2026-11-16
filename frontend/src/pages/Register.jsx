import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowRight,
  BrainCircuit,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { getRoleHome, saveAuthSession } from "../auth/session";
import "./Auth.css";

function Register() {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [adminInviteCode, setAdminInviteCode] = useState("");
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password, role, ...(role === "admin" ? { adminInviteCode } : {}) }
      );

      setSuccess(response.data.message || "Registration successful!");
      const user = response.data.user || { name, email, role };
      saveAuthSession({ token: response.data.token, user });
      setTimeout(() => navigate(getRoleHome(user.role)), 700);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
            Join students building smarter career strategies with the power
            of AI.
          </p>
          <ul className="auth-perks">
            <li>Free to get started</li>
            <li>AI-powered recommendations</li>
            <li>Tailored learning roadmaps</li>
            <li>Real industry insights</li>
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
            <span className="auth-form-eyebrow">Create your Career Intelligence account</span>
            <h2>Create your account</h2>
            <p>Start your AI-powered career journey today</p>
          </div>

          {error   && <div className="auth-error"   role="alert">{error}</div>}
          {success && <div className="auth-success" role="status">{success}</div>}

          <form onSubmit={registerUser} className="auth-form">
            <div className="form-group">
              <label htmlFor="account-role">I am registering as</label>
              <div className="auth-input-wrap">
                <UserRound size={17} aria-hidden="true" />
                <select id="account-role" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="student">Student</option>
                  <option value="guide">Career guide</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            {role === "admin" && (
              <div className="form-group">
                <label htmlFor="admin-invite-code">Administrator invite code</label>
                <div className="auth-input-wrap">
                  <LockKeyhole size={17} aria-hidden="true" />
                  <input id="admin-invite-code" type="password" value={adminInviteCode} onChange={(e) => setAdminInviteCode(e.target.value)} required autoComplete="off" />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <div className="auth-input-wrap">
                <UserRound size={17} aria-hidden="true" />
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

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
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              <span>{loading ? "Creating account…" : "Create account"}</span>
              {!loading && <ArrowRight size={17} aria-hidden="true" />}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Register;
