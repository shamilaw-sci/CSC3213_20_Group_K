<<<<<<< HEAD
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
=======
import { Link } from "react-router-dom";
import SkillList from "../components/SkillList";

function CareerDetails() {
  const skills = [
    "JavaScript",
    "React",
    "Node.js",
    "Database",
    "Git & GitHub",
    "Problem Solving",
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
            Career Guidance
          </p>

          <h1 className="text-4xl font-bold text-gray-900 mt-2">
            Career Details
          </h1>

          <p className="text-gray-600 mt-2">
            Explore career information, required skills, and opportunities.
          </p>
        </div>

        {/* Career Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* Career Title */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Software Engineer
            </h2>

            <p className="text-gray-600 mt-4 leading-relaxed">
              A Software Engineer designs, develops, tests, and maintains
              software applications. Software engineers use programming,
              problem-solving, and software development skills to create
              reliable and efficient software systems.
            </p>
          </div>

          {/* Career Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-gray-200">

            <div>
              <p className="text-sm text-gray-500">
                Job Type
              </p>

              <p className="font-semibold text-gray-900 mt-1">
                Full Time
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Experience Level
              </p>

              <p className="font-semibold text-gray-900 mt-1">
                Entry Level
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Work Area
              </p>

              <p className="font-semibold text-gray-900 mt-1">
                Software Development
              </p>
            </div>

          </div>

          {/* Required Skills */}
          <div className="pt-6">
            <h3 className="text-xl font-bold text-gray-900">
              Required Skills
            </h3>

            <p className="text-gray-600 mt-2 mb-4">
              Important skills for becoming a successful Software Engineer.
            </p>

            <SkillList skills={skills} />
          </div>

          {/* Navigation Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/learning-path"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-sm"
            >
              Start Learning Path &rarr;
            </Link>

            <Link
              to="/career-report"
              className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-lg border border-gray-300 transition"
            >
              View Career Report
            </Link>
          </div>

        </div>
>>>>>>> ashen-learning-report-module
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default CareerDetails;
=======
export default CareerDetails;
>>>>>>> ashen-learning-report-module
