import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight, CalendarDays, FileSearch, History, ShieldCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./ResumeHistory.css";

const formatDate = (value) => value
  ? new Intl.DateTimeFormat([], { day: "numeric", month: "short", year: "numeric" }).format(new Date(value))
  : "Unknown date";

function ResumeHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/resume/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(response.data?.history || []);
      } catch (requestError) {
        if (requestError.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        } else {
          setError("Unable to load your resume history. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  return (
    <div className="page-shell">
      <Navbar />
      <main className="main-content history-page">
        <div className="history-inner">
          <header className="page-header">
            <div className="page-kicker"><History size={13} aria-hidden="true" /> Resume intelligence</div>
            <h1>Resume history</h1>
            <p>Review every analysis and keep track of how your application is improving.</p>
          </header>

          {error && <div className="alert alert-error" role="alert">{error}</div>}

          {loading && (
            <div className="history-list" aria-live="polite">
              {Array.from({ length: 3 }).map((_, index) => <div className="history-skeleton skeleton" key={index} />)}
            </div>
          )}

          {!loading && !error && history.length === 0 && (
            <section className="history-empty card">
              <div className="history-empty-icon"><FileSearch size={24} aria-hidden="true" /></div>
              <h2>No resume analyses yet</h2>
              <p>Upload your first PDF to get an ATS score and a focused improvement plan.</p>
              <button className="btn btn-primary" type="button" onClick={() => navigate("/resume-analyzer")}>Analyze a resume <ArrowRight size={15} /></button>
            </section>
          )}

          {!loading && history.length > 0 && (
            <section className="history-list" aria-label="Resume analyses">
              {history.map((item, index) => (
                <article className="history-row card" key={item._id || item.id || index}>
                  <div className="history-row-icon"><FileSearch size={19} aria-hidden="true" /></div>
                  <div className="history-row-main">
                    <div className="history-row-title"><h2>{item.fileName || "Resume analysis"}</h2><span className="badge badge-primary">Analysis {history.length - index}</span></div>
                    <p><CalendarDays size={14} aria-hidden="true" /> {formatDate(item.createdAt)}</p>
                  </div>
                  <div className="history-score"><strong>{Math.round(Number(item.atsScore) || 0)}%</strong><span>ATS score</span></div>
                  <div className="history-career"><span>Career signal</span><strong>{item.careerMatches?.[0] || item.career || "Not yet identified"}</strong></div>
                  <ShieldCheck className="history-trust" size={17} aria-label="Saved securely" />
                </article>
              ))}
            </section>
          )}
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default ResumeHistory;
