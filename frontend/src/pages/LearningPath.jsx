<<<<<<< HEAD
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
    <div className="page-shell">
      <Navbar />

      <div className="main-content lp-page">
        <div className="lp-inner">

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
=======
import { Link } from "react-router-dom";
import LearningPathCard from "../components/LearningPathCard";
import RoadmapStep from "../components/RoadmapStep";

function LearningPath() {
  const steps = [
    {
      number: 1,
      title: "Learn Programming Fundamentals",
      description:
        "Learn variables, data types, conditions, loops, functions, and basic problem solving.",
      duration: "4 Weeks",
      topics: ["Variables & Types", "Control Flow", "Functions", "Problem Solving"],
    },
    {
      number: 2,
      title: "Learn HTML, CSS & JavaScript",
      description:
        "Build a strong foundation in web development and learn how modern websites work.",
      duration: "6 Weeks",
      topics: ["HTML5 Semantics", "Modern CSS & Flex/Grid", "DOM Manipulation", "ES6+ JS"],
    },
    {
      number: 3,
      title: "Learn React",
      description:
        "Learn components, props, state, hooks, routing, and how to build React applications.",
      duration: "6 Weeks",
      topics: ["JSX", "Components & Props", "Hooks (useState, useEffect)", "React Router"],
    },
    {
      number: 4,
      title: "Learn Backend Development",
      description:
        "Learn Node.js, Express.js, REST APIs, authentication, and server-side development.",
      duration: "6 Weeks",
      topics: ["Node.js Basics", "Express.js Routing", "RESTful APIs", "JWT Auth"],
    },
    {
      number: 5,
      title: "Learn Databases",
      description:
        "Understand database concepts and learn how to store, retrieve, and manage application data.",
      duration: "4 Weeks",
      topics: ["SQL & Relational DBs", "MongoDB / NoSQL", "CRUD Operations", "Data Modeling"],
    },
    {
      number: 6,
      title: "Build Real Projects",
      description:
        "Create practical projects and use Git and GitHub to manage and showcase your work.",
      duration: "8 Weeks",
      topics: ["Full-Stack App", "Git & GitHub Workflow", "Deployment", "Portfolio Building"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Back navigation & Page Header */}
        <div className="mb-6">
          <Link
            to="/career"
            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition mb-4 group"
          >
            <span className="mr-1 group-hover:-translate-x-1 transition-transform">
              &larr;
            </span>
            Back to Career Details
          </Link>

          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
            Career Guidance
          </p>

          <h1 className="text-4xl font-bold text-gray-900 mt-2">
            Learning Path
          </h1>

          <p className="text-gray-600 mt-2">
            Follow this step-by-step roadmap to develop the skills needed to become a Software Engineer.
          </p>
        </div>

        {/* Reusable Career Summary Card */}
        <LearningPathCard
          careerTitle="Software Engineer"
          duration="34 Weeks"
          totalSteps={steps.length}
          description="A structured step-by-step roadmap designed to take you from core programming concepts to production-grade full-stack engineering."
        />

        {/* Roadmap Steps */}
        <div className="space-y-5">
          {steps.map((step) => (
            <RoadmapStep key={step.number} step={step} />
          ))}
        </div>

        {/* Bottom Message & Action Card */}
        <div className="bg-blue-600 rounded-2xl p-8 mt-10 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">
              Ready to start your journey?
            </h3>

            <p className="mt-2 text-blue-100 max-w-xl text-sm leading-relaxed">
              Follow each milestone, practice regularly, and build portfolio projects to strengthen your skills. You can also view your comprehensive career report.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Link
              to="/career-report"
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-5 py-2.5 rounded-lg transition shadow-sm text-sm"
            >
              View Career Report
            </Link>
            <Link
              to="/career"
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-lg transition text-sm border border-blue-500"
            >
              Career Overview
            </Link>
          </div>
        </div>

>>>>>>> ashen-learning-report-module
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default LearningPath;
=======
export default LearningPath;
>>>>>>> ashen-learning-report-module
