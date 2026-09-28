import { Link } from "react-router-dom";
import { Brain } from "lucide-react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <div className="app-footer-brand">
          <div className="footer-logo-mark" aria-hidden="true">
            <Brain size={14} strokeWidth={2} />
          </div>
          <span className="app-footer-name">Career Intelligence</span>
          <span className="app-footer-dot" aria-hidden="true">·</span>
          <span className="app-footer-copy">
            © {new Date().getFullYear()} AI Career Guidance System
          </span>
        </div>

        <nav className="app-footer-links" aria-label="Footer navigation">
          <Link to="/career-details">Careers</Link>
          <Link to="/learning-path">Learning</Link>
          <Link to="/ai-recommendation">AI Matches</Link>
          <Link to="/ai-chat">AI Advisor</Link>
          <Link to="/resume-analyzer">Resume</Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
