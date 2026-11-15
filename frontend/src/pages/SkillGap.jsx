import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AlertCircle, RefreshCw } from "lucide-react";
import "./SkillGap.css";

function CircularProgress({ percentage, size = 84 }) {
  const radius = (size / 2) - 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="sg-circular" aria-label={`Readiness ${percentage}%`}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img">
        <circle className="sg-track" cx={size/2} cy={size/2} r={radius} />
        <circle className="sg-value" cx={size/2} cy={size/2} r={radius}
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }} />
      </svg>
      <div className="sg-text"><strong>{percentage}%</strong><span>readiness</span></div>
    </div>
  );
}

export default function SkillGap() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileRequired, setProfileRequired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGap = async () => {
      setLoading(true);
      setError("");
      setProfileRequired(false);

      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await axios.get("http://localhost:5000/api/skill-gap", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setData(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else if (err.response?.status === 404) {
          setProfileRequired(true);
          setError("Please create your profile before running Skill Gap Analysis.");
        } else {
          setError("Unable to load Skill Gap Analysis. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGap();
  }, [navigate]);

  return (
    <div className="sg-page-wrapper">
      <Navbar />

      <main className="sg-page-main">
        <section className="sg-hero">
          <h1>Skill Gap Analysis</h1>
          <p>Understand which skills to prioritise to reach your target career.</p>
        </section>

        {loading && (
          <div className="sg-loading"><div className="sg-spinner" />
            <p>Analysing skills and comparing against career requirements...</p>
          </div>
        )}

        {error && (
          <div className="sg-error" role="alert">
            <AlertCircle size={22} aria-hidden="true" />
            <div className="sg-error-content">
              <h2>{profileRequired ? "Complete your profile" : "AI service temporarily unavailable"}</h2>
              <p>{profileRequired ? error : "We couldn't complete this request right now. Please try again in a moment."}</p>
            </div>
            {profileRequired ? (
              <button onClick={() => navigate('/profile')}>Complete profile</button>
            ) : (
              <button onClick={() => window.location.reload()}>
                <RefreshCw size={15} aria-hidden="true" />
                Try Again
              </button>
            )}
          </div>
        )}

        {!loading && !error && data && (
          <section className="sg-content">
            <header className="sg-summary">
              <div className="sg-identity">
                <h2>{data.career || '—'}</h2>
                <p className="sg-sub">Recommended career from AI analysis</p>
              </div>
              <div className="sg-readiness">
                <CircularProgress percentage={Math.min(Math.max(Number(data.readinessScore) || 0, 0), 100)} />
              </div>
            </header>

            <div className="sg-columns">
              <section className="sg-box">
                <h3>Current skills</h3>
                {data.currentSkills?.length ? (
                  <ul className="sg-skill-list">
                    {data.currentSkills.map((s, i) => <li key={`${s}-${i}`}>{s}</li>)}
                  </ul>
                ) : <p className="sg-muted">No current skills recorded.</p>}
              </section>

              <section className="sg-box">
                <h3>Missing skills</h3>
                {data.missingSkills?.length ? (
                  <ul className="sg-skill-list sg-missing">
                    {data.missingSkills.map((s, i) => <li key={`${s}-${i}`}>{s}</li>)}
                  </ul>
                ) : <p className="sg-muted">You're well-aligned for this career.</p>}
              </section>

              <section className="sg-box sg-priority">
                <h3>Learning priorities</h3>
                {data.learningPriority?.length ? (
                  <ol className="sg-roadmap">
                    {data.learningPriority.map((step, i) => <li key={`${step}-${i}`}>{step}</li>)}
                  </ol>
                ) : <p className="sg-muted">No learning priorities available.</p>}
              </section>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
