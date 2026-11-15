import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Search,
  Shield,
  Target,
  Trash2,
  User as UserIcon,
  Users,
  X,
} from "lucide-react";
import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer";
import "./AdminDashboard.css";
import "./UserManagement.css";

const API = "http://localhost:5000/api/admin";
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat([], {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
};

const formatScore = (value) =>
  value !== null && value !== undefined && Number.isFinite(Number(value))
    ? `${Math.round(Number(value))}%`
    : "—";

const formatItems = (items) =>
  Array.isArray(items) && items.length ? items.join(", ") : "—";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalUsers: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const navigate = useNavigate();

  const handleAuthError = useCallback((requestError) => {
    if (requestError.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login", { replace: true });
      return true;
    }

    if (requestError.response?.status === 403) {
      navigate("/dashboard", { replace: true });
      return true;
    }

    return false;
  }, [navigate]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      role: roleFilter,
    });

    if (appliedSearch) {
      params.set("search", appliedSearch);
    }

    try {
      const response = await axios.get(`${API}/users?${params.toString()}`, authConfig());
      const result = response.data;

      if (!Array.isArray(result.users) || !result.pagination) {
        throw new Error("The server returned an invalid user list.");
      }

      setUsers(result.users);
      setPagination(result.pagination);

      if (result.pagination.page !== page) {
        setPage(result.pagination.page);
      }
    } catch (requestError) {
      if (!handleAuthError(requestError)) {
        setError(
          requestError.response?.data?.message ||
            requestError.message ||
            "Failed to load users. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [appliedSearch, handleAuthError, page, pageSize, roleFilter]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }

    Promise.resolve().then(fetchUsers);
  }, [fetchUsers, navigate]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setAppliedSearch(search.trim());
  };

  const clearSearch = () => {
    setSearch("");
    setAppliedSearch("");
    setPage(1);
  };

  const handleRoleChange = (event) => {
    setRoleFilter(event.target.value);
    setPage(1);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  const openUserDetails = async (user) => {
    setSelectedUser(user);
    setUserDetails(null);
    setDetailsError("");
    setDetailsLoading(true);

    try {
      const response = await axios.get(`${API}/users/${user._id}`, authConfig());
      setUserDetails(response.data);
    } catch (requestError) {
      if (!handleAuthError(requestError)) {
        setDetailsError(
          requestError.response?.data?.message ||
            "Failed to load this user's details."
        );
      }
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
    setUserDetails(null);
    setDetailsError("");
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Delete "${user.name}" and their profile, CV analyses, and skill-gap analyses? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeleting(user._id);
    setError("");
    setSuccess("");

    try {
      await axios.delete(`${API}/users/${user._id}`, authConfig());
      if (selectedUser?._id === user._id) {
        closeUserDetails();
      }
      await fetchUsers();
      setSuccess(`User "${user.name}" and related records were deleted.`);
    } catch (requestError) {
      if (!handleAuthError(requestError)) {
        setError(
          requestError.response?.data?.message ||
            "Failed to delete this user. Please try again."
        );
      }
    } finally {
      setDeleting(null);
    }
  };

  const totalUsers = pagination.totalUsers || 0;
  const firstUser = totalUsers === 0 ? 0 : (pagination.page - 1) * pageSize + 1;
  const lastUser = Math.min(pagination.page * pageSize, totalUsers);
  const currentUser = userDetails?.user || selectedUser;

  return (
    <div className="page-shell admin-theme">
      <AdminNavbar />
      <main className="main-content adm-page um-page">
        <div className="adm-page-header">
          <div className="adm-page-kicker">
            <Shield size={13} /> Admin
          </div>
          <h1 className="adm-page-title">User Management</h1>
          <p className="adm-page-sub">
            Search, filter, review and manage registered accounts
          </p>
        </div>

        {success && (
          <div className="um-feedback um-feedback--success" role="status">
            {success}
          </div>
        )}
        {error && (
          <div className="um-feedback um-feedback--error" role="alert">
            {error}
          </div>
        )}

        <section className="adm-section" aria-labelledby="um-list-title" aria-busy={loading}>
          <div className="adm-section-header um-section-header">
            <h2 className="adm-section-title" id="um-list-title">
              <Users size={16} aria-hidden="true" />
              Registered Accounts
            </h2>
            <span className="um-result-count">
              {loading ? "Loading…" : `${totalUsers.toLocaleString()} account${totalUsers === 1 ? "" : "s"}`}
            </span>
          </div>

          <form className="um-toolbar" onSubmit={handleSearch}>
            <label className="um-search">
              <span className="visually-hidden">Search by name or email</span>
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search by name or email…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              Search
            </button>
            {search && (
              <button type="button" className="btn" onClick={clearSearch}>
                Clear
              </button>
            )}
            <label className="um-select-label">
              <span>Role</span>
              <select value={roleFilter} onChange={handleRoleChange}>
                <option value="all">All accounts</option>
                <option value="student">Students</option>
                <option value="admin">Administrators</option>
              </select>
            </label>
            <label className="um-select-label">
              <span>Page size</span>
              <select value={pageSize} onChange={handlePageSizeChange}>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </label>
          </form>

          {loading ? (
            <div className="adm-loading um-loading" role="status" aria-live="polite">
              <div className="spinner" />
              <span>Loading registered accounts…</span>
            </div>
          ) : error && users.length === 0 ? (
            <div className="um-empty-state">
              <p>Accounts could not be loaded.</p>
              <button type="button" className="btn btn-sm" onClick={fetchUsers}>
                Try again
              </button>
            </div>
          ) : users.length === 0 ? (
            <div className="um-empty-state" role="status">
              <Users size={24} aria-hidden="true" />
              <p>{appliedSearch ? "No accounts match your search." : "No accounts found for this role."}</p>
            </div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Registered</th>
                    <th className="um-actions-heading">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="um-name-cell">
                          <UserIcon size={15} aria-hidden="true" />
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`adm-badge adm-badge--${user.role === "admin" ? "admin" : "user"}`}>
                          {user.role === "admin" ? "Administrator" : "Student"}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="um-row-actions">
                          <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() => openUserDetails(user)}
                          >
                            <Eye size={14} aria-hidden="true" />
                            View
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm um-delete-button"
                            disabled={deleting === user._id}
                            onClick={() => handleDelete(user)}
                          >
                            {deleting === user._id
                              ? <span className="spinner um-button-spinner" />
                              : <Trash2 size={14} aria-hidden="true" />}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && (
            <div className="um-pagination">
              <span>
                {totalUsers === 0
                  ? "No accounts to display"
                  : `Showing ${firstUser}–${lastUser} of ${totalUsers.toLocaleString()}`}
              </span>
              <div className="um-page-controls">
                <button
                  type="button"
                  className="btn btn-sm"
                  disabled={pagination.page <= 1 || totalUsers === 0}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  <ChevronLeft size={14} aria-hidden="true" />
                  Previous
                </button>
                <span>
                  {totalUsers === 0
                    ? "Page 0 of 0"
                    : `Page ${pagination.page} of ${pagination.totalPages}`}
                </span>
                <button
                  type="button"
                  className="btn btn-sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                  <ChevronRight size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </section>
        <Footer />
      </main>

      {selectedUser && (
        <div className="um-modal-backdrop">
          <section
            className="um-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="um-details-title"
          >
            <header className="um-modal-header">
              <div>
                <span className="adm-page-kicker">Account details</span>
                <h2 id="um-details-title">{currentUser?.name || "User details"}</h2>
              </div>
              <button
                className="btn btn-sm"
                type="button"
                onClick={closeUserDetails}
                aria-label="Close user details"
              >
                <X size={17} />
              </button>
            </header>

            {detailsLoading ? (
              <div className="adm-loading um-loading" role="status" aria-live="polite">
                <div className="spinner" />
                <span>Loading profile and analysis history…</span>
              </div>
            ) : detailsError ? (
              <div className="um-feedback um-feedback--error" role="alert">
                {detailsError}
              </div>
            ) : userDetails ? (
              <div className="um-modal-content">
                <section className="um-detail-section">
                  <h3><UserIcon size={16} /> Profile</h3>
                  <dl className="um-detail-grid">
                    <div><dt>Name</dt><dd>{userDetails.user.name || "—"}</dd></div>
                    <div><dt>Email</dt><dd>{userDetails.user.email || "—"}</dd></div>
                    <div><dt>Role</dt><dd>{userDetails.user.role === "admin" ? "Administrator" : "Student"}</dd></div>
                    <div><dt>Registered</dt><dd>{formatDate(userDetails.user.createdAt)}</dd></div>
                    <div><dt>Education</dt><dd>{userDetails.profile?.education || "—"}</dd></div>
                    <div><dt>Career interest</dt><dd>{userDetails.profile?.interest || "—"}</dd></div>
                    <div className="um-detail-wide"><dt>Career goal</dt><dd>{userDetails.profile?.careerGoal || "—"}</dd></div>
                    <div className="um-detail-wide"><dt>Skills</dt><dd>{formatItems(userDetails.profile?.skills)}</dd></div>
                  </dl>
                </section>

                <section className="um-detail-section">
                  <h3><FileText size={16} /> CV Analysis History</h3>
                  {userDetails.resumeAnalyses.length === 0 ? (
                    <p className="um-history-empty">No CV analyses are available for this account.</p>
                  ) : (
                    <div className="um-history-list">
                      {userDetails.resumeAnalyses.map((analysis) => (
                        <article className="um-history-card" key={analysis._id}>
                          <div className="um-history-heading">
                            <strong>ATS score: {formatScore(analysis.atsScore)}</strong>
                            <time>{formatDate(analysis.createdAt)}</time>
                          </div>
                          <p><b>Career matches:</b> {formatItems(analysis.careerMatches)}</p>
                          {analysis.summary && <p>{analysis.summary}</p>}
                        </article>
                      ))}
                    </div>
                  )}
                </section>

                <section className="um-detail-section">
                  <h3><Target size={16} /> Skill-Gap Analysis History</h3>
                  {userDetails.skillGapAnalyses.length === 0 ? (
                    <p className="um-history-empty">No skill-gap analyses are available for this account.</p>
                  ) : (
                    <>
                      <p className="um-history-note">
                        Dates are not stored for skill-gap analyses in the current model.
                      </p>
                      <div className="um-history-list">
                        {userDetails.skillGapAnalyses.map((analysis, index) => (
                          <article className="um-history-card" key={analysis._id}>
                            <div className="um-history-heading">
                              <strong>{analysis.career || `Analysis ${index + 1}`}</strong>
                              <span>Readiness: {formatScore(analysis.readinessScore)}</span>
                            </div>
                            <p><b>Current skills:</b> {formatItems(analysis.currentSkills)}</p>
                            <p><b>Missing skills:</b> {formatItems(analysis.missingSkills)}</p>
                            <p><b>Learning priorities:</b> {formatItems(analysis.learningPriority)}</p>
                          </article>
                        ))}
                      </div>
                    </>
                  )}
                </section>
              </div>
            ) : null}
          </section>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
