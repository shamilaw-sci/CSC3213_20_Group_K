import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AlertCircle, BrainCircuit, RefreshCw } from "lucide-react";
import { IconChart, IconBriefcase, IconBook, IconBrain } from "../components/icons/Icons";
import "./AIRecommendation.css";

const CAREER_META = {
  "Data Scientist": { icon: <IconChart />, category: "Data & Analytics" },
  "Software Engineer": { icon: <IconBriefcase />, category: "Technology" },
  "Web Developer": { icon: <IconBook />, category: "Technology" },
  "AI/ML Engineer": { icon: <IconBrain />, category: "Artificial Intelligence" },
  "Cybersecurity Analyst": { icon: <IconBriefcase />, category: "Cybersecurity" },
  "Cloud Engineer": { icon: <IconBriefcase />, category: "Cloud Computing" },
  "DevOps Engineer": { icon: <IconBriefcase />, category: "Technology" },
  "Database Administrator": { icon: <IconChart />, category: "Data & Analytics" },
};

const getMatchTier = (match) => {
  if (match >= 95) return "excellent";
  if (match >= 80) return "strong";
  return "emerging";
};

const getCareerMeta = (career) =>
  CAREER_META[career] || { icon: <IconBriefcase />, category: "Career Path" };

function CircularProgress({ percentage }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="ai-circular-progress" aria-label={`${percentage}% career match`}>
      <svg viewBox="0 0 100 100" role="img">
        <circle className="ai-progress-track" cx="50" cy="50" r={radius} />
        <circle
          className="ai-progress-value"
          cx="50"
          cy="50"
          r={radius}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="ai-progress-text">
        <strong>{percentage}%</strong>
        <span>match</span>
      </div>
    </div>
  );
}

function AIRecommendation() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileRequired, setProfileRequired] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const navigate = useNavigate();

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError("");
    setProfileRequired(false);
    setExpandedCards({});

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/ai/recommendation",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRecommendations(
        response.data?.recommendation?.recommendations || response.data?.recommendations || []
      );
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else if (requestError.response?.status === 404) {
        setProfileRequired(true);
        setError("Please complete your profile before using AI Recommendations.");
      } else {
        setError("Unable to load AI recommendations. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    Promise.resolve().then(fetchRecommendations);
  }, [fetchRecommendations]);

  const highestMatch = useMemo(
    () => Math.max(0, ...recommendations.map((item) => Number(item.matchPercentage) || 0)),
    [recommendations]
  );

  const toggleAnalysis = (index) => {
    setExpandedCards((current) => ({ ...current, [index]: !current[index] }));
  };

  const openAiChat = (career) => {
    navigate("/ai-chat", {
      state: { career },
    });
  };

  return (
    <div className="ai-page-wrapper">
      <Navbar />

      <main className="ai-page-main">
        <section className="ai-hero">
          <span className="ai-hero-badge"><IconBrain /> Gemini-powered career guidance</span>
          <h1><BrainCircuit aria-hidden="true" /> AI Career Recommendation</h1>
          <p>Personalised career insights tailored to your skills, interests, and potential.</p>
          <button
            className="ai-generate-again-button"
            type="button"
            onClick={fetchRecommendations}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Again"}
          </button>
        </section>

        {loading && (
          <div className="ai-loading" aria-live="polite">
            <div className="ai-spinner" />
            <p>Analysing your profile and generating career insights...</p>
          </div>
        )}

        {error && (
          <div className="ai-error ai-profile-error" role="alert">
            <AlertCircle size={24} aria-hidden="true" />
            <div className="ai-error-content">
              <h2>{profileRequired ? "Complete your profile" : "AI service temporarily unavailable"}</h2>
              <p>{profileRequired ? error : "We couldn't complete this request right now. Please try again in a moment."}</p>
            </div>
            {profileRequired && (
              <button onClick={() => navigate("/profile")}>Go to Profile</button>
            )}
            {!profileRequired && (
              <button type="button" onClick={fetchRecommendations} disabled={loading}>
                <RefreshCw size={15} aria-hidden="true" />
                Try Again
              </button>
            )}
          </div>
        )}

        {!loading && !error && recommendations.length === 0 && (
          <div className="ai-empty">
            <span className="ai-empty-icon"><BrainCircuit aria-hidden="true" /></span>
            <h2>No recommendations available yet</h2>
            <p>Complete your profile to receive personalised AI career guidance.</p>
          </div>
        )}

        {!loading && !error && recommendations.length > 0 && (
          <>
            <section className="ai-summary-card" aria-label="AI career analysis summary">
              <div className="ai-summary-icon"><BrainCircuit aria-hidden="true" /></div>
              <div className="ai-summary-intro">
                <span>AI Career Analysis Complete</span>
                <p>Your profile has been successfully analysed using Google Gemini AI.</p>
              </div>
              <div className="ai-summary-stat">
                <strong>{recommendations.length}</strong>
                <span>Careers recommended</span>
              </div>
              <div className="ai-summary-stat">
                <strong>{highestMatch}%</strong>
                <span>Highest match</span>
              </div>
              <div className="ai-summary-status">✓ Profile analysed successfully</div>
            </section>

            <section className="ai-recommendation-grid" aria-label="Career recommendations">
              {recommendations.map((recommendation, index) => {
                const percentage = Math.min(Math.max(Number(recommendation.matchPercentage) || 0, 0), 100);
                const tier = getMatchTier(percentage);
                const meta = getCareerMeta(recommendation.career);
                const isExpanded = expandedCards[index];
                const certifications = recommendation.recommendedCertifications || recommendation.certifications || [];
                const projects = recommendation.suggestedPortfolioProjects || recommendation.portfolioProjects || [];

                return (
                  <article
                    className={`ai-recommendation-card ai-tier-${tier}`}
                    key={`${recommendation.career}-${index}`}
                    style={{ animationDelay: `${index * 110}ms` }}
                  >
                    <header className="ai-card-header">
                      <div className="ai-career-identity">
                        <div className="ai-career-icon">{meta.icon}</div>
                        <div>
                          <span className="ai-category-badge">{recommendation.category || meta.category}</span>
                          <h2>{recommendation.career}</h2>
                        </div>
                      </div>
                      <CircularProgress percentage={percentage} />
                    </header>

                    <div className="ai-card-overview">
                      <section>
                        <h3>Why this is a match</h3>
                        <p>{recommendation.reason || "This career aligns with your current profile and learning potential."}</p>
                      </section>
                      <div className="ai-insight-grid">
                        <div><span>Estimated salary</span><strong>{recommendation.estimatedSalaryRange || recommendation.salaryRange || "Not available"}</strong></div>
                        <div><span>Future demand</span><strong>{recommendation.futureDemand || "High potential"}</strong></div>
                      </div>
                    </div>

                    <div className="ai-detail-grid">
                      <section>
                        <h3>Skills to develop</h3>
                        {recommendation.missingSkills?.length ? (
                          <div className="ai-skill-list">
                            {recommendation.missingSkills.map((skill, skillIndex) => <span key={`${skill}-${skillIndex}`}>{skill}</span>)}
                          </div>
                        ) : <p className="ai-muted">Your profile is well aligned with this role.</p>}
                      </section>
                      <section>
                        <h3>Learning roadmap</h3>
                        {recommendation.suggestedLearningRoadmap?.length ? (
                          <ol className="ai-roadmap-list">
                            {recommendation.suggestedLearningRoadmap.map((step, stepIndex) => <li key={`${step}-${stepIndex}`}>{step}</li>)}
                          </ol>
                        ) : <p className="ai-muted">A roadmap will be available soon.</p>}
                      </section>
                    </div>

                    <button className="ai-analysis-toggle" onClick={() => toggleAnalysis(index)} aria-expanded={isExpanded}>
                      {isExpanded ? "Hide Full AI Analysis" : "Show Full AI Analysis"}
                      <span>{isExpanded ? "−" : "+"}</span>
                    </button>

                    {isExpanded && (
                      <div className="ai-expanded-analysis">
                        <section><h3>Detailed explanation</h3><p>{recommendation.detailedExplanation || recommendation.reason || "AI analysis is based on the strengths and opportunities identified in your profile."}</p></section>
                        <section><h3>Career growth</h3><p>{recommendation.careerGrowth || "Develop specialist expertise and build practical experience to progress into advanced roles."}</p></section>
                        <section><h3>Industry outlook</h3><p>{recommendation.industryOutlook || "This field continues to evolve, creating opportunities for professionals who keep their skills current."}</p></section>
                        <section><h3>Advantages</h3><ul>{(recommendation.advantages || ["Opportunities to build in-demand skills", "Strong potential for professional growth"]).map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{item}</li>)}</ul></section>
                        <section><h3>Challenges</h3><ul>{(recommendation.challenges || ["Requires consistent learning", "A practical portfolio is important for standing out"]).map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{item}</li>)}</ul></section>
                        <section><h3>Recommended certifications</h3>{certifications.length ? <ul>{certifications.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{item}</li>)}</ul> : <p>Explore recognised certifications relevant to this career path.</p>}</section>
                        <section><h3>Suggested portfolio projects</h3>{projects.length ? <ul>{projects.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{item}</li>)}</ul> : <p>Build practical projects that demonstrate the key skills for this role.</p>}</section>
                      </div>
                    )}

                    <footer className="ai-card-actions">
                      <button className="ai-primary-button" onClick={() => navigate("/learning-path")}>View Learning Path</button>
                      <button className="ai-secondary-button" onClick={() => navigate("/career-details")}>Explore Career Details</button>
                      <button className="ai-chat-button" onClick={() => openAiChat(recommendation.career)}>Ask AI About This Career</button>
                    </footer>
                  </article>
                );
              })}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default AIRecommendation;
