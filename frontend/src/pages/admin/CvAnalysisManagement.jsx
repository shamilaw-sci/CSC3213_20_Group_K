import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileSearch,
  Search,
  Shield,
  User as UserIcon,
  X,
} from "lucide-react";
import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer";
import "./AdminDashboard.css";
import "./CvAnalysisManagement.css";

const API = "http://localhost:5000/api/admin";
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const REPORT_SECTIONS = [
  { key: "strengths", label: "Strengths" },
  { key: "weaknesses", label: "Weaknesses" },
  { key: "missingSkills", label: "Missing skills" },
  { key: "careerMatches", label: "Career matches" },
  { key: "recommendedCertifications", label: "Recommended certifications" },
  { key: "recommendedCourses", label: "Recommended courses" },
  { key: "portfolioProjects", label: "Portfolio projects" },
  { key: "resumeImprovements", label: "Resume improvements" },
  { key: "interviewPreparation", label: "Interview preparation" },
  { key: "next30DaysPlan", label: "Next 30 days plan" },
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

function CvAnalysisManagement() {
  const [analyses, setAnalyses] = useState([]);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalAnalyses: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [analysisDetails, setAnalysisDetails] = useState(null);
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

  const fetchAnalyses = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (appliedSearch) params.set("search", appliedSearch);

    try {
      const response = await axios.get(
        `${API}/resume-analyses?${params.toString()}`,
        authConfig()
      );
      const result = response.data;
      if (!Array.isArray(result.analyses) || !result.pagination) {
        throw new Error("The server returned an invalid CV analysis list.");
      }

      setAnalyses(result.analyses);
      setPagination(result.pagination);
      if (result.pagination.page !== page) setPage(result.pagination.page);
    } catch (requestError) {
      if (!handleAuthError(requestError)) {
        setError(
          requestError.response?.data?.message ||
            requestError.message ||
            "Failed to load CV analyses. Please try again."
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
    Promise.resolve().then(fetchAnalyses);
  }, [fetchAnalyses, navigate]);

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

  const openAnalysis = async (analysis) => {
    setSelectedAnalysis(analysis);
    setAnalysisDetails(null);
    setDetailsError("");
    setDetailsLoading(true);

    try {
      const response = await axios.get(
        `${API}/resume-analyses/${analysis._id}`,
        authConfig()
      );
      if (!response.data?.analysis) {
        throw new Error("The server returned an invalid CV analysis report.");
      }
      setAnalysisDetails(response.data.analysis);
    } catch (requestError) {
      if (!handleAuthError(requestError)) {
        setDetailsError(
          requestError.response?.data?.message ||
            requestError.message ||
            "Failed to load this CV analysis report."
        );
      }
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedAnalysis(null);
    setAnalysisDetails(null);
    setDetailsError("");
  };

  const totalAnalyses = pagination.totalAnalyses || 0;
  const firstAnalysis = totalAnalyses === 0 ? 0 : (pagination.page - 1) * pageSize + 1;
  const lastAnalysis = Math.min(pagination.page * pageSize, totalAnalyses);
  const detailStudent = analysisDetails?.userId || selectedAnalysis?.userId;

  return (
    <div className="page-shell">
      <AdminNavbar />
      <main className="main-content adm-page cvam-page">
        <div className="adm-page-header">
          <div className="adm-page-kicker">
            <Shield size={13} aria-hidden="true" /> Admin
          </div>
          <h1 className="adm-page-title">CV Analysis Management</h1>
          <p className="adm-page-sub">
            Review saved student CV analysis reports
          </p>
        </div>

        {error && <div className="cvam-feedback cvam-feedback--error" role="alert">{error}</div>}

        <section className="adm-section" aria-labelledby="cvam-list-title" aria-busy={loading}>
          <div className="adm-section-header cvam-section-header">
            <h2 className="adm-section-title" id="cvam-list-title">
              <FileSearch size={16} aria-hidden="true" /> Saved CV Analyses
            </h2>
            <span className="cvam-result-count">
              {loading ? "Loading…" : `${totalAnalyses.toLocaleString()} analysis${totalAnalyses === 1 ? "" : "es"}`}
            </span>
          </div>

          <form className="cvam-toolbar" onSubmit={handleSearch}>
            <label className="cvam-search">
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
            <label className="cvam-page-size">
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
            <div className="adm-loading cvam-loading" role="status" aria-live="polite">
              <div className="spinner" />
              <span>Loading saved CV analyses…</span>
            </div>
          ) : error && analyses.length === 0 ? (
            <div className="cvam-empty-state">
              <p>CV analyses could not be loaded.</p>
              <button type="button" className="btn btn-sm" onClick={fetchAnalyses}>
                Try again
              </button>
            </div>
          ) : analyses.length === 0 ? (
            <div className="cvam-empty-state" role="status">
              <FileSearch size={24} aria-hidden="true" />
              <p>
                {appliedSearch
                  ? "No CV analyses match that student name or email."
                  : "No saved CV analysis records are available."}
              </p>
            </div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>ATS score</th>
                    <th>Analysis date</th>
                    <th className="cvam-actions-heading">Report</th>
                  </tr>
                </thead>
                <tbody>
                  {analyses.map((analysis) => (
                    <tr key={analysis._id}>
                      <td>
                        <span className="cvam-student">
                          <UserIcon size={15} aria-hidden="true" />
                          {analysis.userId?.name || "Student account unavailable"}
                        </span>
                      </td>
                      <td>{analysis.userId?.email || "—"}</td>
                      <td><span className="cvam-score">{formatScore(analysis.atsScore)}</span></td>
                      <td>
                        <span className="cvam-date">
                          <CalendarDays size={14} aria-hidden="true" />
                          {formatDate(analysis.createdAt)}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => openAnalysis(analysis)}
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
            <div className="cvam-pagination">
              <span>
                {totalAnalyses === 0
                  ? "No analyses to display"
                  : `Showing ${firstAnalysis}–${lastAnalysis} of ${totalAnalyses.toLocaleString()}`}
              </span>
              <div className="cvam-page-controls">
                <button
                  type="button"
                  className="btn btn-sm"
                  disabled={pagination.page <= 1 || totalAnalyses === 0}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  <ChevronLeft size={14} aria-hidden="true" /> Previous
                </button>
                <span>
                  {totalAnalyses === 0
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

      {selectedAnalysis && (
        <div className="cvam-modal-backdrop">
          <section
            className="cvam-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cvam-details-title"
          >
            <header className="cvam-modal-header">
              <div>
                <span className="adm-page-kicker">Saved CV analysis report</span>
                <h2 id="cvam-details-title">
                  {detailStudent?.name || "Student report"}
                </h2>
              </div>
              <button
                className="btn btn-sm"
                type="button"
                onClick={closeDetails}
                aria-label="Close CV analysis report"
              >
                <X size={17} />
              </button>
            </header>

            {detailsLoading ? (
              <div className="adm-loading cvam-loading" role="status" aria-live="polite">
                <div className="spinner" />
                <span>Loading CV analysis report…</span>
              </div>
            ) : detailsError ? (
              <div className="cvam-feedback cvam-feedback--error" role="alert">
                {detailsError}
              </div>
            ) : analysisDetails ? (
              <div className="cvam-modal-content">
                <section className="cvam-report-meta" aria-label="Student and analysis details">
                  <div><span>Student</span><strong>{detailStudent?.name || "Account unavailable"}</strong></div>
                  <div><span>Email</span><strong>{detailStudent?.email || "—"}</strong></div>
                  <div><span>ATS score</span><strong>{formatScore(analysisDetails.atsScore)}</strong></div>
                  <div><span>Analyzed</span><strong>{formatDate(analysisDetails.createdAt)}</strong></div>
                </section>

                <section className="cvam-report-section">
                  <h3>Summary</h3>
                  <p>{analysisDetails.summary || "No summary was saved for this analysis."}</p>
                </section>

                <div className="cvam-report-grid">
                  {REPORT_SECTIONS.map(({ key, label }) => (
                    <section className="cvam-report-section" key={key}>
                      <h3>{label}</h3>
                      {Array.isArray(analysisDetails[key]) && analysisDetails[key].length ? (
                        <ul>
                          {analysisDetails[key].map((item, index) => (
                            <li key={`${key}-${index}`}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>Not available in this report.</p>
                      )}
                    </section>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </div>
      )}
    </div>
  );
}

export default CvAnalysisManagement;
