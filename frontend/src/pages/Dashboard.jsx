import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  LayoutDashboard, Target, FileText, BarChart3, User, MessageSquare,
  BookOpen, ArrowRight, TrendingUp, AlertCircle, Brain,
} from "lucide-react";
import "./Dashboard.css";

const getResultData = (result, fallback) =>
  result.status === "fulfilled" ? result.value.data : fallback;

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat([], { day: "numeric", month: "short", year: "numeric" }).format(new Date(date))
    : "No analysis yet";

function SkeletonCard() {
  return <div className="db-skeleton skeleton" />;
}

function Dashboard() {
  const [dashboard,       setDashboard]       = useState({});
  const [profile,         setProfile]         = useState(null);
  const [history,         setHistory]         = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [skillGap,        setSkillGap]        = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState("");
  const navigate = useNavigate();

  const fetchDashboard = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login", { replace: true }); return; }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const results = await Promise.allSettled([
        axios.get("http://localhost:5000/api/dashboard",           { headers }),
        axios.get("http://localhost:5000/api/profile",             { headers }),
        axios.get("http://localhost:5000/api/resume/history",      { headers }),
        axios.get("http://localhost:5000/api/ai/recommendation",   { headers }),
        axios.get("http://localhost:5000/api/skill-gap",           { headers }),
      ]);

      if (results.some((r) => r.status === "rejected" && r.reason.response?.status === 401)) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      setDashboard(getResultData(results[0], {}));
      setProfile(getResultData(results[1], null));
      setHistory(getResultData(results[2], { history: [] }).history || []);
      setSkillGap(getResultData(results[4], null));

      const recData = getResultData(results[3], {});
      setRecommendations(
        recData.recommendation?.recommendations || recData.recommendations || []
      );

      if (results[0].status === "rejected") {
        setError("Some data could not be loaded. Please refresh to try again.");
      }
    } catch (e) {
      console.error("Dashboard error:", e);
      setError("Unable to load your career intelligence dashboard.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { Promise.resolve().then(fetchDashboard); }, [fetchDashboard]);

  const latestAnalysis  = history[0];
  const topRecommendation = useMemo(
    () => [...recommendations].sort((a, b) => Number(b.matchPercentage) - Number(a.matchPercentage))[0],
    [recommendations]
  );
  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    const fields = [profile.education, profile.interest, profile.careerGoal, profile.skills?.length];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [profile]);
  const aiChats = Number(localStorage.getItem("aiChatCount")) || 0;

  const statCards = [
    {
      label: "ATS Score",
      value: latestAnalysis ? `${Math.round(latestAnalysis.atsScore || 0)}%` : "—",
      icon: FileText,
      color: "blue",
      sub: latestAnalysis ? formatDate(latestAnalysis.createdAt) : "No resume analyzed",
    },
    {
      label: "Career Match",
      value: topRecommendation ? `${topRecommendation.matchPercentage}%` : "—",
      icon: Target,
      color: "indigo",
      sub: topRecommendation?.career || "Run AI recommendation",
    },
    {
      label: "Profile Completion",
      value: `${profileCompletion}%`,
      icon: User,
      color: "green",
      sub: profileCompletion === 100 ? "Fully complete" : "Complete your profile",
    },
    {
      label: "AI Conversations",
      value: aiChats || "0",
      icon: MessageSquare,
      color: "purple",
      sub: aiChats ? "Career chats used" : "Start a career chat",
    },
  ];

  const quickActions = [
    { to: "/ai-recommendation", label: "AI Matches",     Icon: Brain },
    { to: "/skill-gap",         label: "Skill Gap",      Icon: BarChart3 },
    { to: "/learning-path",     label: "Learning Path",  Icon: BookOpen },
    { to: "/ai-chat",           label: "AI Advisor",     Icon: MessageSquare },
    { to: "/resume-analyzer",   label: "Resume",         Icon: FileText },
  ];

  if (loading) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="main-content db-page">
          <div className="db-inner">
            <div className="db-skeleton-hero skeleton" />
            <div className="db-skeleton-grid">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
            <div className="db-skeleton-grid db-skeleton-grid--wide">
              {Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Navbar />

      <div className="main-content db-page">
        <div className="db-inner">

          {/* ── Hero ── */}
          <section className="db-hero">
            <div className="db-hero-text">
              <div className="db-hero-kicker">
                <LayoutDashboard size={13} strokeWidth={2} aria-hidden="true" />
                Career Intelligence
              </div>
              <h1 className="db-hero-title">
                Welcome back,{" "}
                <span>{dashboard.name || profile?.name || "Student"}</span>.
              </h1>
              <p className="db-hero-sub">
                Your personalised career signals, progress, and next best actions — all in one place.
              </p>
            </div>
            <Link to="/ai-recommendation" className="db-hero-cta">
              Refresh AI insights
              <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
            </Link>
          </section>

          {error && (
            <div className="db-alert" role="alert">
              <AlertCircle size={16} strokeWidth={2} aria-hidden="true" />
              {error}
            </div>
          )}

          {/* ── Quick Actions ── */}
          <section className="db-quick-section" aria-labelledby="quick-actions-heading">
            <h2 id="quick-actions-heading" className="visually-hidden">Quick Actions</h2>
            <div className="db-quick-actions">
              {quickActions.map(({ to, label, Icon }) => (
                <Link to={to} key={to} className="db-quick-btn">
                  <Icon size={15} strokeWidth={2} aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </div>
          </section>

          {/* ── Stat Cards ── */}
          <section aria-labelledby="overview-heading">
            <div className="db-section-header">
              <h2 id="overview-heading">Overview</h2>
              <span>Live signals from your profile and AI tools</span>
            </div>
            <div className="db-stat-grid">
              {statCards.map(({ label, value, icon: Icon, color, sub }) => (
                <article className={`db-stat-card db-stat-card--${color}`} key={label}>
                  <div className="db-stat-icon">
                    <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <div className="db-stat-body">
                    <div className="db-stat-value">{value}</div>
                    <div className="db-stat-label">{label}</div>
                    <div className="db-stat-sub">{sub}</div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ── Content Grid ── */}
          <div className="db-content-grid">

            {/* AI Recommendation — wide card */}
            <article className="db-card db-card--rec" aria-labelledby="rec-heading">
              <div className="db-card-kicker">
                <Target size={13} strokeWidth={2} aria-hidden="true" />
                Latest AI Recommendation
              </div>
              {topRecommendation ? (
                <>
                  <div className="db-rec-header">
                    <div className="db-rec-icon" aria-hidden="true">
                      <Brain size={22} strokeWidth={1.8} />
                    </div>
                    <div>
                      <h2 id="rec-heading" className="db-rec-career">{topRecommendation.career}</h2>
                      <span className="db-rec-match">{topRecommendation.matchPercentage}% match</span>
                    </div>
                  </div>
                  <p className="db-rec-reason">
                    {topRecommendation.reason || "A strong career fit based on your current skills and aspirations."}
                  </p>
                </>
              ) : (
                <>
                  <h2 id="rec-heading">Discover your best-fit career</h2>
                  <p>Complete your profile and generate AI recommendations to see your personalised match.</p>
                </>
              )}
              <Link to="/ai-recommendation" className="btn btn-primary btn-sm db-card-btn">
                View Full Recommendation
                <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
              </Link>
            </article>

            {/* Resume Summary */}
            <article className="db-card" aria-labelledby="resume-heading">
              <div className="db-card-kicker">
                <FileText size={13} strokeWidth={2} aria-hidden="true" />
                Resume Summary
              </div>
              <div className="db-resume-score">
                <strong>{latestAnalysis ? `${Math.round(latestAnalysis.atsScore || 0)}` : "—"}</strong>
                <span>ATS Score</span>
              </div>
              <div className="db-mini-cols">
                <div>
                  <h3 id="resume-heading">Strengths</h3>
                  {(latestAnalysis?.strengths || []).slice(0, 2).map((item, i) => (
                    <p key={i} className="db-mini-item">• {item}</p>
                  ))}
                  {!latestAnalysis && <p className="db-mini-empty">Analyze a resume to see strengths.</p>}
                </div>
                <div>
                  <h3>Missing Skills</h3>
                  {(latestAnalysis?.missingSkills || []).slice(0, 2).map((item, i) => (
                    <p key={i} className="db-mini-item">• {item}</p>
                  ))}
                  {!latestAnalysis && <p className="db-mini-empty">—</p>}
                </div>
              </div>
              <Link to="/resume-analyzer" className="db-text-link">
                View Resume Analysis <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
              </Link>
            </article>

            {/* Skill Gap */}
            <article className="db-card" aria-labelledby="skillgap-heading">
              <div className="db-card-kicker">
                <BarChart3 size={13} strokeWidth={2} aria-hidden="true" />
                Skill Gap Readiness
              </div>
              {skillGap ? (
                <>
                  <h2 id="skillgap-heading" className="db-card-career">{skillGap.career || "Target career"}</h2>
                  <div className="db-readiness-bar">
                    <div className="db-readiness-label">
                      <span>Readiness</span>
                      <strong>{Math.round(skillGap.readinessScore || 0)}%</strong>
                    </div>
                    <div className="progress-bar-wrap">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${Math.min(100, skillGap.readinessScore || 0)}%` }}
                      />
                    </div>
                  </div>
                  <div className="db-mini-cols">
                    <div>
                      <h3>Current</h3>
                      {(skillGap.currentSkills || []).slice(0, 3).map((s, i) => (
                        <p key={i} className="db-mini-item">• {s}</p>
                      ))}
                    </div>
                    <div>
                      <h3>Missing</h3>
                      {(skillGap.missingSkills || []).slice(0, 3).map((s, i) => (
                        <p key={i} className="db-mini-item">• {s}</p>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 id="skillgap-heading">Skill Gap Analysis</h2>
                  <p>No analysis available. Run a skill gap check to get targeted priorities.</p>
                </>
              )}
              <Link to="/skill-gap" className="db-text-link">
                Open Skill Gap <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
              </Link>
            </article>

            {/* AI Chat */}
            <article className="db-card" aria-labelledby="chat-heading">
              <div className="db-card-kicker">
                <MessageSquare size={13} strokeWidth={2} aria-hidden="true" />
                AI Career Chat
              </div>
              <h2 id="chat-heading">
                {aiChats ? "Continue your career conversation" : "Your advisor is ready"}
              </h2>
              <p>
                {aiChats
                  ? "Pick up where you left off and get practical next-step advice."
                  : "Ask your AI Career Advisor about roles, skills, interviews, and career decisions."
                }
              </p>
              <div className="db-chat-prompt">
                "What should I focus on next?"
              </div>
              <Link to="/ai-chat" className="btn btn-primary btn-sm db-card-btn">
                {aiChats ? "Continue Chat" : "Start Chat"}
                <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
              </Link>
            </article>

            {/* Learning Progress */}
            <article className="db-card" aria-labelledby="learning-heading">
              <div className="db-card-kicker">
                <BookOpen size={13} strokeWidth={2} aria-hidden="true" />
                Learning Progress
              </div>
              <h2 id="learning-heading">Keep building momentum</h2>
              <p>
                Recommended learning follows the career direction identified by your AI insights.
              </p>
              <div className="db-course-stack">
                <TrendingUp size={15} strokeWidth={1.8} aria-hidden="true" />
                <div>
                  <span>Recommended Courses</span>
                  <strong>{latestAnalysis?.recommendedCourses?.length || 0} courses suggested</strong>
                </div>
              </div>
              <Link to="/learning-path" className="db-text-link">
                Open Learning Path <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
              </Link>
            </article>

          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
