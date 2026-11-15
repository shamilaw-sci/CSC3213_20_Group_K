
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FileText,
  Target,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Award,
  Briefcase,
  Lightbulb,
  CalendarDays,
  FileSearch,
  History,
  RefreshCw,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./CareerReport.css";

const REPORT_SECTIONS = [
  { title: "Strengths", key: "strengths", icon: CheckCircle },
  { title: "Weaknesses", key: "weaknesses", icon: AlertCircle },
  { title: "Missing Skills", key: "missingSkills", icon: Target },
  { title: "Career Matches", key: "careerMatches", icon: Briefcase },
  { title: "Recommended Certifications", key: "recommendedCertifications", icon: Award },
  { title: "Recommended Courses", key: "recommendedCourses", icon: BookOpen },
  { title: "Portfolio Projects", key: "portfolioProjects", icon: Lightbulb },
  { title: "Resume Improvements", key: "resumeImprovements", icon: FileText },
  { title: "Interview Preparation", key: "interviewPreparation", icon: Target },
  { title: "30-Day Learning Plan", key: "next30DaysPlan", icon: CalendarDays },
];

const toScore = (value) => {
  if (value === null || value === undefined || (typeof value === "string" && !value.trim())) return null;
  const score = Number(value);
  return Number.isFinite(score) ? Math.round(score) : null;
};

function CareerReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchReport = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        "http://localhost:5000/api/resume/history",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const history = response.data?.history || [];

      if (history.length > 0) {
        setReport(history[0]);
      } else {
        setReport(null);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login", { replace: true });
      } else {
        setError("Unable to load your career report. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    Promise.resolve().then(fetchReport);
  }, [fetchReport]);

  return (
    <div className="page-shell career-report-theme">
      <Navbar />

      <main className="main-content career-report-main">
        <div className="career-report-inner">
          <header className="career-report-header">
            <div>
              <span className="career-report-kicker"><FileText size={14} aria-hidden="true" /> Resume intelligence</span>
              <h1>Career Report</h1>
              <p>Your personalized career insights based on your latest resume analysis.</p>
            </div>
            <button className="career-report-history-button" type="button" onClick={() => navigate("/resume-history")}>
              <History size={16} aria-hidden="true" /> Analysis history
            </button>
          </header>

          {loading && (
            <section className="career-report-loading" aria-live="polite">
              <div className="career-report-orb"><FileSearch size={30} aria-hidden="true" /></div>
              <h2>Loading your career report</h2>
              <p>Retrieving your latest saved resume analysis.</p>
            </section>
          )}

          {error && (
            <div className="career-report-error" role="alert">
              <div>
                <h2>We couldn’t load your report</h2>
                <p>{error}</p>
              </div>
              <button className="career-report-retry" type="button" onClick={fetchReport}>
                <RefreshCw size={16} aria-hidden="true" /> Retry
              </button>
            </div>
          )}

          {!loading && !error && !report && (
            <section className="career-report-empty">
              <div className="career-report-orb"><FileSearch size={30} aria-hidden="true" /></div>
              <h2>No career report available</h2>
              <p>Analyze your resume to generate your personalized career report.</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/resume-analyzer")}
              >
                Analyze Resume
              </button>
            </section>
          )}

          {!loading && report && (
            <>
              <section className="career-report-score-card">
                <div
                  className="career-report-score-ring"
                  style={{ "--score": `${Math.min(Math.max(toScore(report.atsScore) ?? 0, 0), 100)}%` }}
                >
                  <div>
                    <strong>{toScore(report.atsScore) === null ? "—" : toScore(report.atsScore)}</strong>
                    <span>ATS score</span>
                  </div>
                </div>
                <div className="career-report-summary">
                  <span className="career-report-eyebrow">YOUR LATEST ATS SCORE</span>
                  <h2>Resume analysis overview</h2>
                  {report.summary && <p>{report.summary}</p>}
                  <small>
                    Generated: {report.createdAt
                      ? new Date(report.createdAt).toLocaleDateString()
                      : "Date unavailable"}
                  </small>
                </div>
              </section>

              <div className="career-report-grid">
                {REPORT_SECTIONS.map(({ title, key, icon: Icon }) => {
                  const items = Array.isArray(report[key])
                    ? report[key]
                    : [];

                  return (
                    <section className="career-report-section" key={key}>
                      <div className="career-report-section-icon"><Icon size={19} aria-hidden="true" /></div>
                      <h2>{title}</h2>

                      {items.length > 0 ? (
                        <ul>
                          {items.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No information available.</p>
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

export default CareerReport;
