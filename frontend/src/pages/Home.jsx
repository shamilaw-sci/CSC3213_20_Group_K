import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Brain,
  Target,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import "./Home.css";

const FEATURES = [
  {
    Icon: Brain,
    title: "AI Career Matching",
    desc: "AI-driven recommendations matched to your unique skills, interests, and academic background.",
  },
  {
    Icon: BookOpen,
    title: "Personalised Learning Paths",
    desc: "Step-by-step roadmaps with curated courses, projects, and resources for your chosen career.",
  },
  {
    Icon: TrendingUp,
    title: "Industry Insights",
    desc: "Real salary ranges, future scope, and in-demand skills sourced from the latest market data.",
  },
  {
    Icon: ShieldCheck,
    title: "Secure & Private",
    desc: "Your data is protected with JWT authentication and encrypted storage — always.",
  },
];

const STATS = [
  { value: "8",    label: "Career Tracks" },
  { value: "100+", label: "Learning Resources" },
  { value: "50+",  label: "Skill Roadmaps" },
  { value: "24/7", label: "AI Guidance" },
];

const PERKS = [
  "AI-powered career recommendations",
  "Personalised learning roadmaps",
  "Industry salary benchmarks",
  "Resume ATS analysis",
  "Intelligent skill gap analysis",
  "AI career advisor chat",
];

function Home() {
  return (
    <div className="home-page">
      <Navbar />

      {/* ── Hero ── */}
      <main className="home-main">
        <section className="home-hero">
          <div className="home-hero-inner">
            {/* Left */}
            <div className="home-hero-content">
              <div className="home-hero-badge">
                <Brain size={14} strokeWidth={2} aria-hidden="true" />
                Powered by Google Gemini
              </div>

              <h1 className="home-hero-title">
                Your AI Career<br />
                <span className="home-hero-accent">Guidance System</span>
              </h1>

              <p className="home-hero-desc">
                Discover the right career path, build targeted skills, and
                accelerate your professional journey — all in one intelligent
                platform built for university students.
              </p>

              <ul className="home-perks" aria-label="Platform features">
                {PERKS.map((perk) => (
                  <li key={perk}>
                    <CheckCircle2 size={15} strokeWidth={2.2} aria-hidden="true" />
                    {perk}
                  </li>
                ))}
              </ul>

              <div className="home-hero-actions">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get started free
                  <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Sign in
                </Link>
              </div>
            </div>

            {/* Right — visual panel */}
            <div className="home-hero-visual" aria-hidden="true">
              <div className="home-visual-card home-visual-card--main">
                <div className="home-visual-card-badge">AI Recommendation</div>
                <div className="home-visual-career-name">Software Engineer</div>
                <div className="home-visual-match">
                  <div className="home-visual-ring">
                    <span>92%</span>
                    <small>match</small>
                  </div>
                  <div className="home-visual-info">
                    <span>Top career match</span>
                    <span>Based on your profile</span>
                  </div>
                </div>
              </div>
              <div className="home-visual-card home-visual-card--secondary">
                <Target size={16} strokeWidth={2} />
                <div>
                  <div className="home-visual-mini-title">Skill Gap Analysis</div>
                  <div className="home-visual-mini-sub">3 skills to develop</div>
                </div>
              </div>
              <div className="home-visual-card home-visual-card--tertiary">
                <BookOpen size={16} strokeWidth={2} />
                <div>
                  <div className="home-visual-mini-title">Learning Path Ready</div>
                  <div className="home-visual-mini-sub">8 courses · 4 projects</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="home-stats">
            {STATS.map((s) => (
              <div className="home-stat" key={s.label}>
                <span className="home-stat-value">{s.value}</span>
                <span className="home-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section className="home-features" aria-labelledby="features-heading">
          <div className="home-section-inner">
            <div className="home-section-header">
              <div className="home-section-badge">Why Choose Us</div>
              <h2 id="features-heading">
                Everything you need to plan your career
              </h2>
              <p>
                From AI-generated recommendations to skill roadmaps and industry
                benchmarks — we have you covered.
              </p>
            </div>

            <div className="home-features-grid">
              {FEATURES.map(({ Icon, title, desc }) => (
                <article className="home-feature-card" key={title}>
                  <div className="home-feature-icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="home-cta" aria-labelledby="cta-heading">
          <div className="home-cta-inner">
            <h2 id="cta-heading">Ready to shape your future?</h2>
            <p>
              Join other students already using AI-powered guidance to make
              smarter career decisions.
            </p>
            <div className="home-cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Create free account
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Sign in
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

export default Home;
