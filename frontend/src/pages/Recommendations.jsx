/**
 * Recommendations.jsx
 * =====================
 * Displays career recommendations based on the student's profile.
 * Uses the static recommendation API to generate results.
 * 
 * Note: The existing file is named Recommendation.jsx (singular).
 *       This creates the Recommendations.jsx (plural) as requested.
 * 
 * Author: Thimira (Student Profile & Career Recommendation Module)
 */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CareerCard from "../components/CareerCard";
import { getRecommendations } from "../api/recommendationApi";

const Recommendations = () => {
  const navigate = useNavigate();

  // State for recommendations and loading
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [filter, setFilter] = useState("all"); // Filter: all, excellent, good, fair

  // Load profile data from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("studentProfile");
    if (!stored) {
      // No profile data — redirect back to profile page
      navigate("/student-profile");
      return;
    }

    const profile = JSON.parse(stored);
    setProfileData(profile);

    // Fetch recommendations using our static API
    getRecommendations(profile).then((results) => {
      setRecommendations(results);
      setLoading(false);
    });
  }, [navigate]);

  // Filter recommendations based on match quality
  const filteredRecs = recommendations.filter((r) => {
    if (filter === "excellent") return r.matchPercentage >= 80;
    if (filter === "good") return r.matchPercentage >= 60;
    if (filter === "fair") return r.matchPercentage >= 40;
    return true; // "all"
  });

  // Loading state
  if (loading) {
    return (
      <div className="recommendations-page" id="recommendations-page">
        <div className="loading-state">
          <div className="loading-state__spinner"></div>
          <h2>Analyzing your profile...</h2>
          <p>Our AI is finding the best career matches for you.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-page" id="recommendations-page">
      {/* Page Header */}
      <div className="page-header">
        <button className="page-header__back" onClick={() => navigate("/student-profile")}>
          ← Edit Profile
        </button>
        <h1 className="page-header__title">Your Career Recommendations</h1>
        <p className="page-header__subtitle">
          Hey {profileData?.name}! Based on your profile, here are the career
          paths we recommend for you.
        </p>
      </div>

      {/* Profile Summary */}
      <div className="profile-summary" id="profile-summary">
        <div className="profile-summary__item">
          <span className="profile-summary__label">Skills</span>
          <div className="profile-summary__chips">
            {profileData?.skills.map((s, i) => (
              <span key={i} className="profile-summary__chip">{s}</span>
            ))}
          </div>
        </div>
        <div className="profile-summary__item">
          <span className="profile-summary__label">Interests</span>
          <div className="profile-summary__chips">
            {profileData?.interests.map((s, i) => (
              <span key={i} className="profile-summary__chip profile-summary__chip--interest">{s}</span>
            ))}
          </div>
        </div>
        <div className="profile-summary__meta">
          <span>🎓 {profileData?.educationLevel}</span>
          <span>💼 {profileData?.preferredJobType}</span>
          <span>📍 {profileData?.preferredWorkArea}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar" id="filter-bar">
        <span className="filter-bar__label">Filter:</span>
        {["all", "excellent", "good", "fair"].map((f) => (
          <button
            key={f}
            className={`filter-bar__btn ${filter === f ? "filter-bar__btn--active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f === "excellent" ? "80%+" : f === "good" ? "60%+" : "40%+"}
          </button>
        ))}
        <span className="filter-bar__count">
          {filteredRecs.length} career{filteredRecs.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {/* Career Cards Grid */}
      {filteredRecs.length > 0 ? (
        <div className="recommendations-grid" id="recommendations-grid">
          {filteredRecs.map((career) => (
            <CareerCard key={career.id} career={career} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No careers match this filter</h3>
          <p>Try adjusting the filter or update your profile for better results.</p>
          <button className="hero-section__cta-primary" onClick={() => setFilter("all")}>
            Show All Results
          </button>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
