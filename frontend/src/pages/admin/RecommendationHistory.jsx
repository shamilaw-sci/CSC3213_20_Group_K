import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  History,
  Search,
  Shield,
  User as UserIcon,
  X,
} from "lucide-react";
import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer";
import "./AdminDashboard.css";
import "./RecommendationHistory.css";

const API = "http://localhost:5000/api/admin";
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const SCALAR_FIELDS = [
  { key: "category", label: "Category" },
  { key: "reason", label: "Reason" },
  { key: "detailedExplanation", label: "Detailed explanation" },
  { key: "careerGrowth", label: "Career growth" },
  { key: "industryOutlook", label: "Industry outlook" },
  { key: "futureDemand", label: "Future demand" },
];

const ARRAY_FIELDS = [
  { keys: ["missingSkills"], label: "Skills to develop" },
  { keys: ["suggestedLearningRoadmap"], label: "Suggested learning roadmap" },
  { keys: ["advantages"], label: "Advantages" },
  { keys: ["challenges"], label: "Challenges" },
  { keys: ["recommendedCertifications", "certifications"], label: "Recommended certifications" },
  { keys: ["suggestedPortfolioProjects", "portfolioProjects"], label: "Portfolio projects" },
];

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
        hour: "numeric",
        minute: "2-digit",
      }).format(date);
};

const formatScore = (value) =>
  value !== null && value !== undefined && Number.isFinite(Number(value))
    ? `${Math.round(Number(value))}%`
    : "—";

const getArrayValues = (recommendation, keys) =>
  [...new Set(keys.flatMap((key) => (
    Array.isArray(recommendation[key]) ? recommendation[key] : []
  )))];

const formatCareers = (recommendations) =>
  Array.isArray(recommendations) && recommendations.length
    ? recommendations
        .map((item) => `${item.career || "Career"} (${formatScore(item.matchPercentage)})`)
        .join(", ")
    : "No career recommendations saved.";

function RecommendationHistory() {
  const [histories, setHistories] = useState([]);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalHistories: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [historyDetails, setHistoryDetails] = useState(null);
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

  const fetchHistories = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (appliedSearch) params.set("search", appliedSearch);

    try {
      const response = await axios.get(
        `${API}/recommendations?${params.toString()}`,
        authConfig()
      );
      const result = response.data;
      if (!Array.isArray(result.histories) || !result.pagination) {
        throw new Error("The server returned an invalid recommendation history list.");
      }

      setHistories(result.histories);
      setPagination(result.pagination);
      if (result.pagination.page !== page) setPage(result.pagination.page);
    } catch (requestError) {
      if (!handleAuthError(requestError)) {
        setError(
          requestError.response?.data?.message ||
            requestError.message ||
            "Failed to load recommendation history. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [appliedSearch, handleAuthError, page, pageSize]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }
    Promise.resolve().then(fetchHistories);
  }, [fetchHistories, navigate]);

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

  const openHistory = async (history) => {
    setSelectedHistory(history);
    setHistoryDetails(null);
    setDetailsError("");
    setDetailsLoading(true);

    try {
      const response = await axios.get(
        `${API}/recommendations/${history._id}`,
        authConfig()
      );
      if (!response.data?.history) {
        throw new Error("The server returned an invalid recommendation report.");
      }
      setHistoryDetails(response.data.history);
    } catch (requestError) {
      if (!handleAuthError(requestError)) {
        setDetailsError(
          requestError.response?.data?.message ||
            requestError.message ||
            "Failed to load this recommendation report."
        );
      }
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedHistory(null);
    setHistoryDetails(null);
    setDetailsError("");
  };

  const totalHistories = pagination.totalHistories || 0;
  const firstHistory = totalHistories === 0 ? 0 : (pagination.page - 1) * pageSize + 1;
  const lastHistory = Math.min(pagination.page * pageSize, totalHistories);
  const detailStudent = historyDetails?.userId || selectedHistory?.userId;
  const details = Array.isArray(historyDetails?.recommendations)
    ? historyDetails.recommendations
    : [];

  return (
    <div className="page-shell admin-theme">
      <AdminNavbar />
      <main className="main-content adm-page rh-page">
        <div className="adm-page-header">
          <div className="adm-page-kicker">
            <Shield size={13} aria-hidden="true" /> Admin
          </div>
          <h1 className="adm-page-title">AI Recommendation History</h1>
          <p className="adm-page-sub">
            Review saved Gemini career recommendations without generating new responses
          </p>
        </div>

        {error && <div className="rh-feedback rh-feedback--error" role="alert">{error}</div>}

        <section className="adm-section" aria-labelledby="rh-list-title" aria-busy={loading}>
          <div className="adm-section-header rh-section-header">
            <h2 className="adm-section-title" id="rh-list-title">
              <History size={16} aria-hidden="true" /> Saved recommendation reports
            </h2>
            <span className="rh-result-count">
              {loading ? "Loading…" : `${totalHistories.toLocaleString()} report${totalHistories === 1 ? "" : "s"}`}
            </span>
          </div>

          <form className="rh-toolbar" onSubmit={handleSearch}>
            <label className="rh-search">
              <Search size={16} aria-hidden="true" />
              <span className="visually-hidden">Search by student name or email</span>
              <input
                type="search"
                placeholder="Search by student name or email…"
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
            <label className="rh-page-size">
              <span>Page size</span>
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </label>
          </form>

          {loading ? (
            <div className="adm-loading rh-loading" role="status" aria-live="polite">
              <div className="spinner" />
              <span>Loading saved recommendation history…</span>
            </div>
          ) : error && histories.length === 0 ? (
            <div className="rh-empty-state">
              <p>Recommendation history could not be loaded.</p>
              <button type="button" className="btn btn-sm" onClick={fetchHistories}>
                Try again
              </button>
            </div>
          ) : histories.length === 0 ? (
            <div className="rh-empty-state" role="status">
              <History size={24} aria-hidden="true" />
              <p>
                {appliedSearch
                  ? "No recommendation history matches that student name or email."
                  : "No saved recommendation history is available."}
              </p>
            </div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Recommended careers</th>
                    <th>Recommendation date</th>
                    <th className="rh-actions-heading">Report</th>
                  </tr>
                </thead>
                <tbody>
                  {histories.map((history) => (
                    <tr key={history._id}>
                      <td>
                        <span className="rh-student">
                          <UserIcon size={15} aria-hidden="true" />
                          {history.userId?.name || "Student account unavailable"}
                        </span>
                      </td>
                      <td>{history.userId?.email || "—"}</td>
                      <td className="rh-careers-cell">{formatCareers(history.recommendations)}</td>
                      <td>
                        <span className="rh-date">
                          <CalendarDays size={14} aria-hidden="true" />
                          {formatDate(history.createdAt)}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => openHistory(history)}
                        >
                          <Eye size={14} aria-hidden="true" /> View report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && (
            <div className="rh-pagination">
              <span>
                {totalHistories === 0
                  ? "No reports to display"
                  : `Showing ${firstHistory}–${lastHistory} of ${totalHistories.toLocaleString()}`}
              </span>
              <div className="rh-page-controls">
                <button
                  type="button"
                  className="btn btn-sm"
                  disabled={pagination.page <= 1 || totalHistories === 0}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  <ChevronLeft size={14} aria-hidden="true" /> Previous
                </button>
                <span>
                  {totalHistories === 0
                    ? "Page 0 of 0"
                    : `Page ${pagination.page} of ${pagination.totalPages}`}
                </span>
                <button
                  type="button"
                  className="btn btn-sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next <ChevronRight size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </section>
        <Footer />
      </main>

      {selectedHistory && (
        <div className="rh-modal-backdrop">
          <section
            className="rh-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rh-details-title"
          >
            <header className="rh-modal-header">
              <div>
                <span className="adm-page-kicker">Saved Gemini recommendation</span>
                <h2 id="rh-details-title">{detailStudent?.name || "Student report"}</h2>
              </div>
              <button
                className="btn btn-sm"
                type="button"
                onClick={closeDetails}
                aria-label="Close recommendation report"
              >
                <X size={17} />
              </button>
            </header>

            {detailsLoading ? (
              <div className="adm-loading rh-loading" role="status" aria-live="polite">
                <div className="spinner" />
                <span>Loading saved recommendation report…</span>
              </div>
            ) : detailsError ? (
              <div className="rh-feedback rh-feedback--error" role="alert">
                {detailsError}
              </div>
            ) : historyDetails ? (
              <div className="rh-modal-content">
                <section className="rh-report-meta" aria-label="Student and report details">
                  <div><span>Student</span><strong>{detailStudent?.name || "Account unavailable"}</strong></div>
                  <div><span>Email</span><strong>{detailStudent?.email || "—"}</strong></div>
                  <div><span>Recommendation date</span><strong>{formatDate(historyDetails.createdAt)}</strong></div>
                </section>

                {details.length === 0 ? (
                  <div className="rh-empty-state">
                    <p>This saved report contains no career recommendations.</p>
                  </div>
                ) : (
                  <div className="rh-report-list">
                    {details.map((recommendation, index) => (
                      <article className="rh-career-report" key={`${recommendation.career || "career"}-${index}`}>
                        <header className="rh-career-header">
                          <div>
                            <span className="rh-career-index">Recommendation {index + 1}</span>
                            <h3>{recommendation.career || "Career details unavailable"}</h3>
                          </div>
                          <span className="rh-score">{formatScore(recommendation.matchPercentage)} match</span>
                        </header>

                        {(recommendation.estimatedSalaryRange || recommendation.salaryRange) && (
                          <p className="rh-career-meta">
                            <strong>Estimated salary:</strong>{" "}
                            {recommendation.estimatedSalaryRange || recommendation.salaryRange}
                          </p>
                        )}

                        <div className="rh-detail-grid">
                          {SCALAR_FIELDS.filter(({ key }) => recommendation[key]).map(({ key, label }) => (
                            <section className="rh-detail-section" key={key}>
                              <h4>{label}</h4>
                              <p>{recommendation[key]}</p>
                            </section>
                          ))}
                          {ARRAY_FIELDS.map(({ keys, label }) => {
                            const values = getArrayValues(recommendation, keys);
                            if (!values.length) return null;
                            return (
                              <section className="rh-detail-section" key={label}>
                                <h4>{label}</h4>
                                <ul>{values.map((item, itemIndex) => <li key={`${label}-${itemIndex}`}>{item}</li>)}</ul>
                              </section>
                            );
                          })}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </section>
        </div>
      )}
    </div>
  );
}

export default RecommendationHistory;
