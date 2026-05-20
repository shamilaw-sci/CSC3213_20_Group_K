/**
 * App.jsx
 * ========
 * Main application component with React Router setup.
 * Defines routes for Home, Student Profile, and Recommendations pages.
 * Includes a navigation bar and footer.
 * 
 * Author: Thimira (Student Profile & Career Recommendation Module)
 */
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import StudentProfile from "./pages/StudentProfile";
import Recommendations from "./pages/Recommendations";
import "./App.css";

// ─── Navigation Bar Component ─────────────────────────────────
const Navbar = () => {
  const location = useLocation();

  // Helper to check if current route matches
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" id="navbar">
      <Link to="/" className="navbar__brand">
        <span className="navbar__logo">🎓</span>
        <span className="navbar__name">FuturePath<span className="navbar__name-accent">AI</span></span>
      </Link>
      <div className="navbar__links">
        <Link to="/" className={`navbar__link ${isActive("/") ? "navbar__link--active" : ""}`}>
          Home
        </Link>
        <Link to="/student-profile" className={`navbar__link ${isActive("/student-profile") ? "navbar__link--active" : ""}`}>
          Profile
        </Link>
        <Link to="/student-profile" className="navbar__cta">
          Get Started
        </Link>
      </div>
    </nav>
  );
};

// ─── Footer Component ─────────────────────────────────────────
const Footer = () => (
  <footer className="footer" id="footer">
    <div className="footer__content">
      <p className="footer__text">
        © 2025 FuturePath AI — AI-Based Career Guidance System
      </p>
      <p className="footer__sub">CSC3213 Group K • University Project</p>
    </div>
  </footer>
);

// ─── Main App Component ───────────────────────────────────────
function App() {
  return (
    <Router>
      <div className="app" id="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Home page route */}
            <Route path="/" element={<Home />} />
            {/* Student profile form page */}
            <Route path="/student-profile" element={<StudentProfile />} />
            {/* Career recommendations page */}
            <Route path="/recommendations" element={<Recommendations />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
