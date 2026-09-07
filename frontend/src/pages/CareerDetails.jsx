import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Briefcase, BarChart3, Code2, Database,
  Cloud, Shield, Globe, Server, TrendingUp,
} from "lucide-react";
import "./CareerDetails.css";

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

function CareerDetails() {
  const [career,   setCareer]   = useState(null);
  const [selected, setSelected] = useState("Software Engineer");
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const navigate = useNavigate();

  const fetchCareer = useCallback(async (title) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/careers/${encodeURIComponent(title)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCareer(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Could not load career data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { Promise.resolve().then(() => fetchCareer(selected)); }, [fetchCareer, selected]);

  const CareerIcon = CAREER_ICONS[selected] || Briefcase;

  return (
    <div className="page-shell">
      <Navbar />

      <div className="main-content cd-page">
        <div className="cd-inner">

          {/* Page Header */}
          <div className="page-header">
            <div className="page-kicker">
              <Briefcase size={13} strokeWidth={2} aria-hidden="true" />
              Career Explorer
            </div>
            <h1>Career Details</h1>
            <p>Select a career to explore salary ranges, required skills, and future scope.</p>
          </div>

          {/* Career Selector */}
          <div className="cd-selector-wrap">
            <div className="cd-selector-grid" role="tablist" aria-label="Select a career track">
              {CAREERS.map((c) => {
                const CIcon = CAREER_ICONS[c] || Briefcase;
                return (
                  <button
                    key={c}
                    role="tab"
                    aria-selected={selected === c}
                    className={`cd-selector-btn ${selected === c ? "active" : ""}`}
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
            <div className="cd-loading" aria-live="polite">
              <div className="spinner spinner-lg" />
              <p>Loading career data…</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="alert alert-error" role="alert">{error}</div>
          )}

          {/* Career Content */}
          {!loading && !error && career && (
            <div className="cd-content" role="tabpanel" aria-label={`${selected} career details`}>

              {/* Title banner */}
              <div className="cd-title-card">
                <div className="cd-title-icon" aria-hidden="true">
                  <CareerIcon size={26} strokeWidth={1.8} />
                </div>
                <div>
                  <h2 className="cd-career-name">{career.title}</h2>
                  <p className="cd-description">{career.description}</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="cd-info-grid">

                {/* Salary */}
                <div className="cd-card">
                  <div className="cd-card-header">
                    <BarChart3 size={16} strokeWidth={1.8} aria-hidden="true" />
                    <h3>Salary Range</h3>
                  </div>
                  <div className="cd-salary-value">{career.salaryRange}</div>
                  <div className="cd-salary-tiers">
                    <div className="cd-tier"><span className="cd-tier-dot cd-tier-dot--entry" aria-hidden="true" />Entry Level</div>
                    <div className="cd-tier"><span className="cd-tier-dot cd-tier-dot--mid"   aria-hidden="true" />Mid Level</div>
                    <div className="cd-tier"><span className="cd-tier-dot cd-tier-dot--senior" aria-hidden="true" />Senior Level</div>
                  </div>
                </div>

                {/* Future Scope */}
                <div className="cd-card">
                  <div className="cd-card-header">
                    <TrendingUp size={16} strokeWidth={1.8} aria-hidden="true" />
                    <h3>Future Scope</h3>
                  </div>
                  <p className="cd-scope-text">{career.futureScope}</p>
                  <div className="cd-scope-badge">High Growth Potential</div>
                </div>

                {/* Skills */}
                <div className="cd-card">
                  <div className="cd-card-header">
                    <Code2 size={16} strokeWidth={1.8} aria-hidden="true" />
                    <h3>Required Skills</h3>
                  </div>
                  <div className="cd-skills-wrap">
                    {(career.requiredSkills || []).map((skill) => (
                      <span className="skill-chip" key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>

                {/* Quick Overview */}
                <div className="cd-card">
                  <div className="cd-card-header">
                    <Briefcase size={16} strokeWidth={1.8} aria-hidden="true" />
                    <h3>Quick Overview</h3>
                  </div>
                  <ul className="cd-overview-list">
                    <li>
                      <span>Career Track</span>
                      <span className="cd-ov-value">{career.title}</span>
                    </li>
                    <li>
                      <span>Skills Required</span>
                      <span className="cd-ov-value">
                        {career.requiredSkills ? career.requiredSkills.length : "—"}
                      </span>
                    </li>
                    <li>
                      <span>Salary Range</span>
                      <span className="cd-ov-value">{career.salaryRange}</span>
                    </li>
                    <li>
                      <span>Demand Level</span>
                      <span className="cd-ov-value cd-ov-high">High</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          )}

        </div>
        <Footer />
      </div>
    </div>
  );
}

export default CareerDetails;
