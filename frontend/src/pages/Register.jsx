import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Brain } from "lucide-react";
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
        { name, email, password, role, adminInviteCode }
      );

      saveAuthSession(response.data);
      setSuccess(response.data.message || "Account created. Opening your workspace…");
      navigate(getRoleHome(response.data.user.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
            Students, career guides, and administrators each get a workspace
            designed for their role.
          </p>
          <ul className="auth-perks">
            <li>Student career planning tools</li>
            <li>Guide profiles and appointment tools</li>
            <li>Private role-based workspaces</li>
            <li>One account for your role</li>
          </ul>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Create your account</h2>
            <p>Choose your account type and we’ll set up the right workspace.</p>
          </div>

          {error   && <div className="auth-error"   role="alert">{error}</div>}
          {success && <div className="auth-success" role="status">{success}</div>}

          <form onSubmit={registerUser} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full name</label>
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

            <div className="form-group">
              <label htmlFor="account-role">I’m registering as</label>
              <select
                id="account-role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                required
              >
                <option value="student">Student</option>
                <option value="guide">Career guide</option>
                <option value="admin">Administrator (invite required)</option>
              </select>
            </div>

            {role === "admin" && <div className="form-group">
              <label htmlFor="admin-invite-code">Administrator invite code</label>
              <input
                id="admin-invite-code"
                type="password"
                placeholder="Enter the code provided by your administrator"
                value={adminInviteCode}
                onChange={(event) => setAdminInviteCode(event.target.value)}
                autoComplete="off"
                required
              />
              <small className="auth-field-hint">Admin access is invite-only while the admin portal is being built.</small>
            </div>}

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
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
