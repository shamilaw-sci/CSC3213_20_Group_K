/**
 * Home.jsx
 * =========
 * The landing page of the AI Career Guidance System.
 * Features a hero section with animated gradient background,
 * feature highlights, and a "Get Started" button.
 * 
 * Author: Thimira (Student Profile & Career Recommendation Module)
 */
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  // Feature cards data
  const features = [
    {
      icon: "🎯",
      title: "Smart Matching",
      desc: "Our AI engine matches your skills and interests with the best career paths.",
    },
    {
      icon: "📊",
      title: "Match Analysis",
      desc: "See detailed match percentages and understand why each career suits you.",
    },
    {
      icon: "🛠️",
      title: "Skill Insights",
      desc: "Discover which skills you already have and what you need to learn next.",
    },
  ];

  return (
    <div className="home-page" id="home-page">
      {/* ─── Hero Section ─── */}
      <section className="hero-section" id="hero-section">
        {/* Animated background shapes */}
        <div className="hero-section__bg">
          <div className="hero-section__shape hero-section__shape--1"></div>
          <div className="hero-section__shape hero-section__shape--2"></div>
          <div className="hero-section__shape hero-section__shape--3"></div>
        </div>

        <div className="hero-section__content">
          {/* Badge */}
          <div className="hero-section__badge">
            ✨ AI-Powered Career Guidance
          </div>

          {/* Main heading */}
          <h1 className="hero-section__title">
            Discover Your
            <span className="hero-section__highlight"> Perfect Career</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-section__subtitle">
            Tell us about your skills, interests, and preferences — and let our
            intelligent recommendation engine find the career paths that match
            you best.
          </p>

          {/* CTA Buttons */}
          <div className="hero-section__actions">
            <button
              className="hero-section__cta-primary"
              id="get-started-btn"
              onClick={() => navigate("/student-profile")}
            >
              Get Started
              <span className="hero-section__cta-arrow">→</span>
            </button>
            <a href="#features" className="hero-section__cta-secondary">
              Learn More ↓
            </a>
          </div>

          {/* Stats */}
          <div className="hero-section__stats">
            <div className="hero-section__stat">
              <span className="hero-section__stat-value">10+</span>
              <span className="hero-section__stat-label">Career Paths</span>
            </div>
            <div className="hero-section__stat-divider"></div>
            <div className="hero-section__stat">
              <span className="hero-section__stat-value">AI</span>
              <span className="hero-section__stat-label">Powered Engine</span>
            </div>
            <div className="hero-section__stat-divider"></div>
            <div className="hero-section__stat">
              <span className="hero-section__stat-value">100%</span>
              <span className="hero-section__stat-label">Free to Use</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section className="features-section" id="features">
        <h2 className="features-section__title">How It Works</h2>
        <p className="features-section__subtitle">
          Three simple steps to find your ideal career path
        </p>
        <div className="features-section__grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-card__icon">{feature.icon}</div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__desc">{feature.desc}</p>
              <div className="feature-card__step">Step {index + 1}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Footer CTA ─── */}
      <section className="footer-cta" id="footer-cta">
        <h2>Ready to find your path?</h2>
        <p>Start by creating your profile and get personalized recommendations in seconds.</p>
        <button
          className="hero-section__cta-primary"
          onClick={() => navigate("/student-profile")}
        >
          Create Your Profile →
        </button>
      </section>
    </div>
  );
};

export default Home;
