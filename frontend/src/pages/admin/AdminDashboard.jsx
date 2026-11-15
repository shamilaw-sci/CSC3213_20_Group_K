import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users,
  Briefcase,
  FileText,
  BarChart3,
  Shield,
  ArrowRight,
} from "lucide-react";
import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer";
import "./AdminDashboard.css";

const API = "http://localhost:5000/api/admin";

const formatDate = (d) =>
  d && !Number.isNaN(new Date(d).getTime())
    ? new Intl.DateTimeFormat([], {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(d))
    : "—";

function AdminDashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const navigate = useNavigate();

  const fetchStats = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login", { replace: true });
      } else if (requestError.response?.status === 403) {
        navigate("/dashboard", { replace: true });
      } else {
        setError(
          requestError.response?.data?.message ||
            "Failed to load dashboard data. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    Promise.resolve().then(fetchStats);
  }, [fetchStats]);

  const STAT_CARDS = stats
    ? [
        { label: "Registered Students", value: stats.totalUsers, Icon: Users, color: "blue" },
        { label: "Administrators", value: stats.totalAdmins, Icon: Shield, color: "purple" },
        { label: "Careers", value: stats.totalCareers, Icon: Briefcase, color: "indigo" },
        { label: "Completed CV Analyses", value: stats.totalResumeAnalyses, Icon: FileText, color: "green" },
        { label: "Skill-Gap Analyses", value: stats.totalSkillGapAnalyses, Icon: BarChart3, color: "orange" },
      ]
    : [];

  return (
    <div className="page-shell">
      <AdminNavbar />
      <div className="main-content adm-page">
        {/* Page header */}
        <div className="adm-page-header">
          <div className="adm-page-kicker">
            <Shield size={13} /> Admin
          </div>
          <h1 className="adm-page-title">Admin Dashboard</h1>
          <p className="adm-page-sub">System overview and quick actions</p>
        </div>

        {loading && (
          <div className="adm-loading" role="status" aria-live="polite">
            <div className="spinner" />
            <p>Loading dashboard statistics…</p>
          </div>
        )}

        {!loading && error && (
          <div className="adm-error" role="alert">
            <p>{error}</p>
            <button className="btn btn-sm" type="button" onClick={fetchStats}>
              Try again
            </button>
          </div>
        )}

        {!loading && !error && stats && (
          <>
            {/* Stats */}
            <div className="adm-stats-grid">
              {STAT_CARDS.map(({ label, value, Icon, color }) => (
                <div className="adm-stat-card" key={label}>
                  <div className={`adm-stat-icon adm-stat-icon--${color}`}>
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <div className="adm-stat-value">
                    {Number.isFinite(value) ? value.toLocaleString() : "—"}
                  </div>
                  <div className="adm-stat-label">{label}</div>
                </div>
              ))}
            </div>

            {/* Recent Users */}
            <div className="adm-section">
              <div className="adm-section-header">
                <h2 className="adm-section-title">Recent Users</h2>
                <Link to="/admin/users" className="btn btn-sm btn-primary">
                  Manage users <ArrowRight size={14} />
                </Link>
              </div>
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!Array.isArray(stats.recentUsers) || stats.recentUsers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="adm-empty-state">
                          No registered students yet.
                        </td>
                      </tr>
                    ) : (
                      stats.recentUsers.map((u) => (
                        <tr key={u._id}>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td>
                            <span className="adm-badge adm-badge--user">Student</span>
                          </td>
                          <td>{formatDate(u.createdAt)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent CV analyses */}
            <div className="adm-section">
              <div className="adm-section-header">
                <h2 className="adm-section-title">Recent CV Analysis Activity</h2>
              </div>
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Email</th>
                      <th>ATS Score</th>
                      <th>Career Match</th>
                      <th>Analyzed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!Array.isArray(stats.recentResumeAnalyses) ||
                    stats.recentResumeAnalyses.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="adm-empty-state">
                          No completed CV analyses yet.
                        </td>
                      </tr>
                    ) : (
                      stats.recentResumeAnalyses.map((analysis) => (
                        <tr key={analysis._id}>
                          <td>{analysis.userId?.name || "Student account unavailable"}</td>
                          <td>{analysis.userId?.email || "—"}</td>
                          <td>
                            {Number.isFinite(analysis.atsScore)
                              ? `${Math.round(analysis.atsScore)}%`
                              : "—"}
                          </td>
                          <td>{analysis.careerMatches?.[0] || "—"}</td>
                          <td>{formatDate(analysis.createdAt)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick actions */}
            <div className="adm-section">
              <div className="adm-section-header">
                <h2 className="adm-section-title">Quick Actions</h2>
              </div>
              <div className="adm-actions-row">
                <Link to="/admin/users" className="btn btn-primary">
                  <Users size={16} /> Manage Users
                </Link>
                <Link to="/admin/careers" className="btn btn-primary">
                  <Briefcase size={16} /> Manage Careers
                </Link>
              </div>
            </div>
          </>
        )}
        <Footer />
      </div>
    </div>
  );
}

export default AdminDashboard;
