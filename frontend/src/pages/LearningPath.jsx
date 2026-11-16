import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  BookOpen, Wrench, Lightbulb, Link2, BarChart3,
  Code2, Database, Cloud, Shield, Globe, Server, Briefcase,
} from "lucide-react";
import "./LearningPath.css";

const CAREERS = [
  "Software Engineer",
  "Data Scientist",
  "Cybersecurity Analyst",
  "Cloud Engineer",
  "AI/ML Engineer",
  "Web Developer",
  "DevOps Engineer",
  "Database Administrator",
];

const CAREER_ICONS = {
  "Software Engineer":     Code2,
  "Data Scientist":        BarChart3,
  "Cybersecurity Analyst": Shield,
  "Cloud Engineer":        Cloud,
  "AI/ML Engineer":        Briefcase,
  "Web Developer":         Globe,
  "DevOps Engineer":       Server,
  "Database Administrator": Database,
};

const SECTION_CONFIG = [
  { key: "skills",    title: "Skills to Master",      Icon: Wrench,     color: "blue",   emptyMsg: "No skills listed." },
  { key: "courses",   title: "Recommended Courses",   Icon: BookOpen,   color: "indigo", emptyMsg: "No courses listed." },
  { key: "projects",  title: "Hands-on Projects",     Icon: Lightbulb,  color: "green",  emptyMsg: "No projects listed." },
  { key: "resources", title: "Learning Resources",    Icon: Link2,      color: "amber",  emptyMsg: "No resources listed." },
];

function LearningPath() {
  const { career: careerParam } = useParams();
  const initialCareer = CAREERS.find((career) => career.toLowerCase() === decodeURIComponent(careerParam || "").toLowerCase()) || "Software Engineer";
  const [path,     setPath]     = useState(null);
  const [selected, setSelected] = useState(initialCareer);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const navigate = useNavigate();

  const fetchPath = useCallback(async (career) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/learning-path/${encodeURIComponent(career)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPath(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Could not load learning path. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { Promise.resolve().then(() => fetchPath(selected)); }, [fetchPath, selected]);

  const CareerIcon = CAREER_ICONS[selected] || Briefcase;

  return (
    <div className="page-shell">
      <Navbar />

      <div className="main-content lp-page">
        <div className="lp-inner">

          <Link to="/career" className="lp-back-link" aria-label="Back to career details">
            <span className="lp-back-icon" aria-hidden="true">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
            </span>
            <span>Back to Career Details</span>
          </Link>

          {/* Page Header */}
          <div className="page-header">
            <div className="page-kicker">
              <BookOpen size={13} strokeWidth={2} aria-hidden="true" />
              Learning Roadmap
            </div>
            <h1>Your Learning Path</h1>
            <p>
              Select a career to reveal a step-by-step roadmap with skills,
              courses, projects, and resources.
            </p>
          </div>

          {/* Career Selector */}
          <div className="lp-selector-wrap">
            <div className="lp-selector-grid" role="tablist" aria-label="Select a career track">
              {CAREERS.map((c) => {
                const CIcon = CAREER_ICONS[c] || Briefcase;
                return (
                  <button
                    key={c}
                    role="tab"
                    aria-selected={selected === c}
                    className={`lp-selector-btn ${selected === c ? "active" : ""}`}
                    onClick={() => setSelected(c)}
                  >
                    <CIcon size={14} strokeWidth={1.8} aria-hidden="true" />
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="lp-loading" aria-live="polite">
              <div className="spinner spinner-lg" />
              <p>Loading your learning path…</p>
            </div>
          )}

          {/* Error */}
          {error && <div className="alert alert-error" role="alert">{error}</div>}

          {/* Path Content */}
          {!loading && !error && path && (
            <>
              {/* Active career banner */}
              <div className="lp-banner">
                <div className="lp-banner-icon" aria-hidden="true">
                  <CareerIcon size={22} strokeWidth={1.8} />
                </div>
                <div className="lp-banner-body">
                  <h2>{path.career} Learning Path</h2>
                  <p>Follow this roadmap to become job-ready for a {path.career} role.</p>
                </div>
                <div className="lp-banner-stats" aria-label="Path summary">
                  {[
                    { n: (path.skills   || []).length, label: "Skills" },
                    { n: (path.courses  || []).length, label: "Courses" },
                    { n: (path.projects || []).length, label: "Projects" },
                  ].map(({ n, label }) => (
                    <div className="lp-banner-stat" key={label}>
                      <span>{n}</span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2×2 Card Grid */}
              <div className="lp-card-grid">
                {SECTION_CONFIG.map(({ key, title, Icon, color, emptyMsg }) => {
                  const items = path[key] || [];
                  return (
                    <div
                      className={`lp-card lp-card--${color}`}
                      key={key}
                      aria-label={title}
                    >
                      <div className="lp-card-header">
                        <div className="lp-card-icon" aria-hidden="true">
                          <Icon size={18} strokeWidth={1.8} />
                        </div>
                        <div>
                          <h3>{title}</h3>
                          <span className="lp-card-count">
                            {items.length} item{items.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      <ul className="lp-card-list">
                        {items.length > 0 ? (
                          items.map((item, i) => (
                            <li key={i}>
                              <span className="lp-list-dot" aria-hidden="true" />
                              <span>{item}</span>
                            </li>
                          ))
                        ) : (
                          <li className="lp-empty">{emptyMsg}</li>
                        )}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </>
          )}

        </div>
        <Footer />
      </div>
    </div>
  );
}

export default LearningPath;
