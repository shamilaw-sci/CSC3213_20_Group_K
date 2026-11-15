
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
  RefreshCw,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
    <div className="page-shell">
      <Navbar />

      <main className="main-content" style={{ padding: "32px" }}>
        <div style={{ maxWidth: "1100px", margin: "auto" }}>
          <header style={{ marginBottom: "32px" }}>
            <h1>Career Report</h1>
            <p>Your personalized career insights based on your latest resume analysis.</p>
          </header>

          {loading && <p>Loading your career report...</p>}

          {error && (
            <div role="alert">
              {error}
              <button onClick={fetchReport}>
                <RefreshCw size={16} /> Retry
              </button>
            </div>
          )}

          {!loading && !error && !report && (
            <section className="card" style={{ padding: "32px" }}>
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
              <section className="card" style={{ padding: "28px", marginBottom: "24px" }}>
                <p>YOUR LATEST ATS SCORE</p>
                <h2 style={{ fontSize: "48px", margin: "8px 0" }}>
                  {Math.round(Number(report.atsScore) || 0)}%
                </h2>
                <p>{report.summary || "Your personalized career analysis."}</p>
                <small>
                  Generated: {report.createdAt
                    ? new Date(report.createdAt).toLocaleDateString()
                    : "Date unavailable"}
                </small>
              </section>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px"
              }}>
                {REPORT_SECTIONS.map(({ title, key, icon: Icon }) => {
                  const items = Array.isArray(report[key])
                    ? report[key]
                    : [];

                  return (
                    <section className="card" key={key} style={{ padding: "24px" }}>
                      <h2 style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <Icon size={20} />
                        {title}
                      </h2>

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
      </main>

      <Footer />
    </div>
  );
}

export default CareerReport;
