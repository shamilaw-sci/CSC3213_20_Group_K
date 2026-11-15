import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ArrowRight,
  BarChart3,
  Brain,
  BriefcaseBusiness,
  BookOpen,
  CheckCircle2,
  Compass,
  FileSearch,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import "./Home.css";

const FEATURES = [
  {
    Icon: Brain,
    title: "AI Career Recommendations",
    desc: "AI-driven recommendations matched to your unique skills, interests, and academic background.",
  },
  {
    Icon: FileSearch,
    title: "CV Analysis",
    desc: "Review your resume’s strengths, ATS readiness, and opportunities to improve.",
  },
  {
    Icon: Compass,
    title: "Career Exploration",
    desc: "Explore career paths, required skills, salary ranges, and future scope.",
  },
  {
    Icon: BarChart3,
    title: "Skill Gap Analysis",
    desc: "Understand which skills to prioritize for your target career and what to learn next.",
  },
  {
    Icon: BookOpen,
    title: "Personalized Learning Paths",
    desc: "Follow step-by-step roadmaps with courses, projects, and resources for your chosen career.",
  },
  {
    Icon: MessageSquareText,
    title: "AI Career Assistant",
    desc: "Get guidance on roles, skills, interviews, and career decisions through AI chat.",
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

const PERKS = [
  "AI-powered career recommendations",
  "Personalized learning roadmaps",
  "Industry salary benchmarks",
  "Resume ATS analysis",
  "Intelligent skill gap analysis",
  "AI career advisor chat",
];

const STEPS = [
  {
    number: "01",
    Icon: BriefcaseBusiness,
    title: "Build your profile",
    description:
      "Share your education, interests, skills, and career goal to give your guidance a personal starting point.",
  },
  {
    number: "02",
    Icon: Sparkles,
    title: "Explore AI career insights",
    description:
      "Review career recommendations and skill-gap insights tailored to the information in your profile.",
  },
  {
    number: "03",
    Icon: BookOpen,
    title: "Plan your next steps",
    description:
      "Use career details, CV analysis, and learning paths to decide what to explore and build next.",
  },
];

function Home() {
  return (
    <div className="home-page">
      <Navbar />

      <main className="home-main">
        <section className="home-hero" aria-labelledby="home-hero-title">
          <div className="home-hero-glow home-hero-glow--one" aria-hidden="true" />
          <div className="home-hero-glow home-hero-glow--two" aria-hidden="true" />

          <div className="home-hero-inner">
            <div className="home-hero-content">
              <div className="home-hero-badge">
                <Brain size={15} strokeWidth={2} aria-hidden="true" />
                Powered by Google Gemini
              </div>

              <h1 className="home-hero-title" id="home-hero-title">
                Your AI Career
                <span>Guidance System</span>
              </h1>

              <p className="home-hero-desc">
                Discover the right career path, build targeted skills, and
                accelerate your professional journey — all in one intelligent
                platform built for university students.
              </p>

              <ul className="home-perks" aria-label="Platform features">
                {PERKS.map((perk) => (
                  <li key={perk}>
                    <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              <div className="home-hero-actions">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get started free
                  <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Sign in
                </Link>
              </div>
              <p className="home-hero-note">
                <ShieldCheck size={15} aria-hidden="true" />
                A clearer next step for your career journey
              </p>
            </div>

            <div className="home-hero-visual">
              <div className="home-hero-orbit home-hero-orbit--outer" aria-hidden="true" />
              <div className="home-hero-orbit home-hero-orbit--inner" aria-hidden="true" />
              <div className="home-hero-image-frame">
                <img
                  className="home-hero-image"
                  src="/images/career-guidance-center.webp.webp"
                  alt="Students exploring an AI-powered digital career guidance center"
                  fetchPriority="high"
                />
                <div className="home-hero-image-shade" aria-hidden="true" />
                <div className="home-image-caption">
                  <span className="home-caption-icon">
                    <Sparkles size={16} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>Intelligence for your next move</strong>
                    <small>Explore a future shaped around you</small>
                  </span>
                </div>
              </div>
              <div className="home-assistant-card">
                <img
                  src="/images/ai-career-assistant.jpg.png"
                  alt="A student using an interactive AI career assistant"
                  loading="lazy"
                />
                <div className="home-assistant-caption">
                  <span className="home-assistant-status" aria-hidden="true" />
                  <span>AI career assistant</span>
                  <MessageSquareText size={16} aria-hidden="true" />
                </div>
              </div>
              <div className="home-hero-decoration" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
          <div className="home-hero-bottom" aria-hidden="true">
            <span />
          </div>
        </section>

        <section className="home-features" aria-labelledby="features-heading">
          <div className="home-section-inner">
            <header className="home-section-header">
              <span className="home-section-eyebrow">
                <Sparkles size={14} aria-hidden="true" />
                Your career toolkit
              </span>
              <h2 id="features-heading">
                Guidance for every step
                <span> of your career journey</span>
              </h2>
              <p>
                From discovering a direction to building the skills for it,
                bring your career planning into one place.
              </p>
            </header>

            <div className="home-features-grid">
              {FEATURES.map(({ Icon, title, desc }, index) => (
                <article
                  className="home-feature-card"
                  key={title}
                  style={{ "--card-index": index }}
                >
                  <div className="home-feature-icon" aria-hidden="true">
                    <Icon size={21} strokeWidth={1.8} />
                  </div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <span className="home-feature-arrow" aria-hidden="true">
                    <ArrowRight size={16} />
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="home-how" aria-labelledby="how-heading">
          <div className="home-how-inner">
            <div className="home-how-content">
              <span className="home-section-eyebrow">
                <Compass size={14} aria-hidden="true" />
                How it works
              </span>
              <h2 id="how-heading">
                From your goals
                <span> to a clear direction</span>
              </h2>
              <p className="home-how-intro">
                Start with what makes you unique, explore the insights that
                matter, and move forward with a plan you can act on.
              </p>

              <ol className="home-steps">
                {STEPS.map(({ number, Icon, title, description }) => (
                  <li className="home-step" key={number}>
                    <span className="home-step-number">{number}</span>
                    <span className="home-step-icon" aria-hidden="true">
                      <Icon size={19} strokeWidth={1.8} />
                    </span>
                    <span className="home-step-copy">
                      <strong>{title}</strong>
                      <span>{description}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="home-how-visual">
              <div className="home-how-image-frame">
                <img
                  src="/images/students-collaboration.webp.webp"
                  alt="Students collaborating and discussing their career ideas"
                  loading="lazy"
                />
                <div className="home-how-image-overlay" aria-hidden="true" />
                <div className="home-how-image-label">
                  <span className="home-how-label-icon">
                    <Brain size={17} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>Make your next move with confidence</strong>
                    <small>Discover, learn, and grow at your pace</small>
                  </span>
                </div>
              </div>
              <div className="home-how-glow" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="home-cta" aria-labelledby="cta-heading">
          <div className="home-cta-glow" aria-hidden="true" />
          <div className="home-cta-inner">
            <span className="home-section-eyebrow">
              <Sparkles size={14} aria-hidden="true" />
              Your next chapter starts here
            </span>
            <h2 id="cta-heading">Ready to shape your future?</h2>
            <p>
              Join other students using AI-powered guidance to make smarter
              career decisions.
            </p>
            <div className="home-cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Create free account
                <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
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
