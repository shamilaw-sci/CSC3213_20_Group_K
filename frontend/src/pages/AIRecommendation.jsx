import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AlertCircle, BrainCircuit, RefreshCw } from "lucide-react";
import { IconChart, IconBriefcase, IconBook, IconBrain } from "../components/icons/Icons";
import "./AIRecommendation.css";

const CAREER_ICONS = {
  "Data Scientist": <IconChart />,
  "Software Engineer": <IconBriefcase />,
  "Web Developer": <IconBook />,
  "AI/ML Engineer": <IconBrain />,
  "Cybersecurity Analyst": <IconBriefcase />,
  "Cloud Engineer": <IconBriefcase />,
  "DevOps Engineer": <IconBriefcase />,
  "Database Administrator": <IconChart />,
};

const getMatchTier = (match) => {
  if (match >= 95) return "excellent";
  if (match >= 80) return "strong";
  return "emerging";
};

const getMatchPercentage = (value) => {
  if (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "")
  ) return null;
  const percentage = Number(value);
  return Number.isFinite(percentage) && percentage >= 0 && percentage <= 100
    ? percentage
    : null;
};

const hasText = (value) => typeof value === "string" && value.trim().length > 0;

const getCareerMeta = (career) =>
  CAREER_ICONS[career] || <IconBriefcase />;

function CircularProgress({ percentage }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="ai-circular-progress" role="img" aria-label={`${percentage}% career match`}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
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
    () => {
      const scores = recommendations
        .map((item) => getMatchPercentage(item.matchPercentage))
        .filter((score) => score !== null);
      return scores.length ? Math.max(...scores) : null;
    },
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
    <div className="ai-page-wrapper ai-recommendation-theme">
      <Navbar />

      <main className="ai-page-main">
        <section className="ai-hero">
          <span className="ai-hero-badge"><IconBrain /> Gemini-powered career guidance</span>
          <h1><BrainCircuit aria-hidden="true" /> AI Career Recommendations</h1>
          <p>Explore career matches and insights based on your profile and AI analysis.</p>
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
              {highestMatch !== null && (
                <div className="ai-summary-stat">
                  <strong>{highestMatch}%</strong>
                  <span>Highest match</span>
                </div>
              )}
              <div className="ai-summary-status">✓ Profile analysed successfully</div>
            </section>

            <section className="ai-recommendation-grid" aria-label="Career recommendations">
              {recommendations.map((recommendation, index) => {
                const percentage = getMatchPercentage(recommendation.matchPercentage);
                const tier = percentage === null ? "unscored" : getMatchTier(percentage);
                const careerIcon = getCareerMeta(recommendation.career);
                const isExpanded = Boolean(expandedCards[index]);
                const salaryRange = recommendation.estimatedSalaryRange || recommendation.salaryRange;
                const missingSkills = Array.isArray(recommendation.missingSkills)
                  ? recommendation.missingSkills
                  : [];
                const roadmap = Array.isArray(recommendation.suggestedLearningRoadmap)
                  ? recommendation.suggestedLearningRoadmap
                  : [];
                const advantages = Array.isArray(recommendation.advantages) ? recommendation.advantages : [];
                const challenges = Array.isArray(recommendation.challenges) ? recommendation.challenges : [];
                const certifications = Array.isArray(recommendation.recommendedCertifications)
                  ? recommendation.recommendedCertifications
                  : Array.isArray(recommendation.certifications)
                    ? recommendation.certifications
                    : [];
                const projects = Array.isArray(recommendation.suggestedPortfolioProjects)
                  ? recommendation.suggestedPortfolioProjects
                  : Array.isArray(recommendation.portfolioProjects)
                    ? recommendation.portfolioProjects
                    : [];
                const hasAdditionalAnalysis = [
                  recommendation.detailedExplanation,
                  recommendation.careerGrowth,
                  recommendation.industryOutlook,
                ].some(hasText) ||
                  advantages.length > 0 ||
                  challenges.length > 0 ||
                  certifications.length > 0 ||
                  projects.length > 0;

                return (
                  <article
                    className={`ai-recommendation-card ai-tier-${tier}`}
                    key={`${recommendation.career}-${index}`}
                    style={{ animationDelay: `${index * 110}ms` }}
                  >
                    <header className="ai-card-header">
                      <div className="ai-career-identity">
                        <div className="ai-career-icon" aria-hidden="true">{careerIcon}</div>
                        <div>
                          {hasText(recommendation.category) && (
                            <span className="ai-category-badge">{recommendation.category}</span>
                          )}
                          <h2>{recommendation.career}</h2>
                        </div>
                      </div>
                      {percentage !== null && <CircularProgress percentage={percentage} />}
                    </header>

                    {(hasText(recommendation.reason) || salaryRange || hasText(recommendation.futureDemand)) && (
                      <div className="ai-card-overview">
                        {hasText(recommendation.reason) && (
                          <section>
                            <h3>Why this is a match</h3>
                            <p>{recommendation.reason}</p>
                          </section>
                        )}
                        {(salaryRange || hasText(recommendation.futureDemand)) && (
                          <div className="ai-insight-grid">
                            {salaryRange && <div><span>Estimated salary</span><strong>{salaryRange}</strong></div>}
                            {hasText(recommendation.futureDemand) && <div><span>Future demand</span><strong>{recommendation.futureDemand}</strong></div>}
                          </div>
                        )}
                      </div>
                    )}

                    {(missingSkills.length > 0 || roadmap.length > 0) && (
                      <div className="ai-detail-grid">
                        {missingSkills.length > 0 && (
                          <section>
                            <h3>Skills to develop</h3>
                            <div className="ai-skill-list">
                              {missingSkills.map((skill, skillIndex) => <span key={`${skill}-${skillIndex}`}>{skill}</span>)}
                            </div>
                          </section>
                        )}
                        {roadmap.length > 0 && (
                          <section>
                            <h3>Learning roadmap</h3>
                            <ol className="ai-roadmap-list">
                              {roadmap.map((step, stepIndex) => <li key={`${step}-${stepIndex}`}>{step}</li>)}
                            </ol>
                          </section>
                        )}
                      </div>
                    )}

                    <button
                      className="ai-analysis-toggle"
                      type="button"
                      onClick={() => toggleAnalysis(index)}
                      aria-expanded={isExpanded}
                      aria-controls={`ai-analysis-${index}`}
                    >
                      {isExpanded ? "Hide Full AI Analysis" : "Show Full AI Analysis"}
                      <span>{isExpanded ? "−" : "+"}</span>
                    </button>

                    <div className="ai-expanded-analysis" id={`ai-analysis-${index}`} hidden={!isExpanded}>
                      {hasText(recommendation.detailedExplanation) && <section><h3>Detailed explanation</h3><p>{recommendation.detailedExplanation}</p></section>}
                      {hasText(recommendation.careerGrowth) && <section><h3>Career growth</h3><p>{recommendation.careerGrowth}</p></section>}
                      {hasText(recommendation.industryOutlook) && <section><h3>Industry outlook</h3><p>{recommendation.industryOutlook}</p></section>}
                      {advantages.length > 0 && <section><h3>Advantages</h3><ul>{advantages.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{item}</li>)}</ul></section>}
                      {challenges.length > 0 && <section><h3>Challenges</h3><ul>{challenges.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{item}</li>)}</ul></section>}
                      {certifications.length > 0 && <section><h3>Recommended certifications</h3><ul>{certifications.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{item}</li>)}</ul></section>}
                      {projects.length > 0 && <section><h3>Suggested portfolio projects</h3><ul>{projects.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{item}</li>)}</ul></section>}
                      {!hasAdditionalAnalysis && (
                        <p className="ai-muted">No additional analysis was provided for this recommendation.</p>
                      )}
                    </div>

                    <footer className="ai-card-actions">
                      <button className="ai-primary-button" type="button" onClick={() => navigate("/learning-path")}>View Learning Path</button>
                      <button className="ai-secondary-button" type="button" onClick={() => navigate("/career-details")}>Explore Career Details</button>
                      <button className="ai-chat-button" type="button" onClick={() => openAiChat(recommendation.career)}>Ask AI About This Career</button>
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
