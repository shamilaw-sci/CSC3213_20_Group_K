import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    <div className="page-shell learning-path-theme">
      <Navbar />

      <main className="main-content lp-page">
        <div className="lp-inner">
          <header className="lp-page-header">
            <div className="lp-page-header-copy">
              <span className="lp-page-kicker">
                <BookOpen size={14} strokeWidth={2} aria-hidden="true" />
                Personalized learning roadmap
              </span>
              <h1>Your Learning Path</h1>
              <p>
                Choose a career to explore its skills, courses, projects, and
                learning resources in one clear roadmap.
              </p>
            </div>
            <div className="lp-header-art" aria-hidden="true">
              <BookOpen size={44} strokeWidth={1.4} />
            </div>
          </header>

          <section className="lp-selector-wrap" aria-label="Career selection">
            <div className="lp-selector-heading">
              <div>
                <span className="lp-section-eyebrow">Choose your direction</span>
                <h2>Select a career track</h2>
                <p>Your selection loads the matching career roadmap.</p>
              </div>
              <span className="lp-track-count">{CAREERS.length} career tracks</span>
            </div>
            <div className="lp-selector-grid" role="tablist" aria-label="Select a career track">
              {CAREERS.map((c, index) => {
                const CIcon = CAREER_ICONS[c] || Briefcase;
                return (
                  <button
                    key={c}
                    type="button"
                    role="tab"
                    id={`lp-career-tab-${index}`}
                    aria-controls="learning-path-panel"
                    aria-selected={selected === c}
                    className={`lp-selector-btn ${selected === c ? "active" : ""}`}
                    onClick={() => setSelected(c)}
                  >
                    <CIcon size={15} strokeWidth={1.8} aria-hidden="true" />
                    {c}
                  </button>
                );
              })}
            </div>
          </section>

          {loading && (
            <div className="lp-loading" aria-live="polite" role="status">
              <div className="lp-spinner" aria-hidden="true" />
              <p>Loading your learning path…</p>
            </div>
          )}

          {error && <div className="alert alert-error lp-error" role="alert">{error}</div>}

          {!loading && !error && path && (
            <>
              <section
                className="lp-banner"
                id="learning-path-panel"
                role="tabpanel"
                aria-labelledby={`lp-career-tab-${CAREERS.indexOf(selected)} lp-active-career-title`}
              >
                <div className="lp-banner-icon" aria-hidden="true">
                  <CareerIcon size={22} strokeWidth={1.8} />
                </div>
                <div className="lp-banner-body">
                  <span className="lp-banner-kicker">Active career path</span>
                  <h2 id="lp-active-career-title">{path.career} Learning Path</h2>
                  <p>Follow this roadmap to become job-ready for a {path.career} role.</p>
                </div>
                <div className="lp-banner-stats" aria-label="Path summary">
                  {[
                    { n: (path.skills || []).length, label: "Skills" },
                    { n: (path.courses || []).length, label: "Courses" },
                    { n: (path.projects || []).length, label: "Projects" },
                    { n: (path.resources || []).length, label: "Resources" },
                  ].map(({ n, label }) => (
                    <div className="lp-banner-stat" key={label}>
                      <span>{n}</span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="lp-roadmap-heading">
                <div>
                  <span className="lp-section-eyebrow">Roadmap sections</span>
                  <h2>Explore your learning plan</h2>
                </div>
              </div>

              <div className="lp-card-grid">
                {SECTION_CONFIG.map(({ key, title, Icon, color, emptyMsg }) => {
                  const items = path[key] || [];
                  return (
                    <section
                      className={`lp-card lp-card--${color} lp-card--${key}`}
                      key={key}
                      aria-labelledby={`lp-section-${key}`}
                    >
                      <div className="lp-card-header">
                        <div className="lp-card-icon" aria-hidden="true">
                          <Icon size={18} strokeWidth={1.8} />
                        </div>
                        <div className="lp-card-heading">
                          <h3 id={`lp-section-${key}`}>{title}</h3>
                          <span className="lp-card-count">
                            {items.length} item{items.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {items.length > 0 ? (
                        <ul className="lp-card-list">
                          {items.map((item, i) => (
                            <li className="lp-card-item" key={i}>
                              <span className="lp-list-dot" aria-hidden="true" />
                              <span className="lp-card-item-text">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="lp-empty">
                          <span aria-hidden="true">—</span>
                          <p>{emptyMsg}</p>
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            </>
          )}
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default LearningPath;
