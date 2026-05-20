/**
 * CareerCard.jsx
 * ===============
 * Displays a single career recommendation as a card.
 * Shows career title, match %, reason, required skills, and salary.
 * 
 * Author: Thimira (Student Profile & Career Recommendation Module)
 */
import React from "react";

// Color based on match quality
const getMatchColor = (pct) => {
  if (pct >= 80) return "#10b981";
  if (pct >= 60) return "#6366f1";
  if (pct >= 40) return "#f59e0b";
  return "#94a3b8";
};

const getMatchLabel = (pct) => {
  if (pct >= 80) return "Excellent Match";
  if (pct >= 60) return "Good Match";
  if (pct >= 40) return "Fair Match";
  return "Possible Match";
};

const CareerCard = ({ career }) => {
  const {
    title, matchPercentage, reason, relatedSkills,
    matchedSkills, category, workArea, description, averageSalary,
  } = career;

  const color = getMatchColor(matchPercentage);
  const label = getMatchLabel(matchPercentage);

  // SVG ring parameters
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (matchPercentage / 100) * circ;

  return (
    <div className="career-card" id={`career-card-${career.id}`}>
      {/* Header: Ring + Title */}
      <div className="career-card__header">
        <div className="career-card__ring-wrapper">
          <svg className="career-card__ring" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6"/>
            <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="6"
              strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
              transform="rotate(-90 50 50)" style={{transition:"stroke-dashoffset 1s ease-out"}}/>
          </svg>
          <div className="career-card__ring-text">
            <span className="career-card__percentage" style={{color}}>{matchPercentage}%</span>
          </div>
        </div>
        <div className="career-card__title-section">
          <h3 className="career-card__title">{title}</h3>
          <span className="career-card__match-label" style={{backgroundColor:`${color}20`,color}}>{label}</span>
          <div className="career-card__tags">
            <span className="career-card__tag">{category}</span>
            <span className="career-card__tag">{workArea}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="career-card__body">
        <p className="career-card__description">{description}</p>
        <div className="career-card__salary">💰 Avg. Salary: {averageSalary}</div>

        {/* Recommendation reason */}
        <div className="career-card__reason">
          <strong>💡 Why this recommendation?</strong>
          <p>{reason}</p>
        </div>

        {/* Required skills */}
        <div className="career-card__skills">
          <h4 className="career-card__skills-title">Required Skills</h4>
          <div className="career-card__skills-list">
            {relatedSkills.map((skill, i) => {
              const isMatched = matchedSkills?.some(
                (ms) => ms.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(ms.toLowerCase())
              );
              return (
                <span key={i} className={`career-card__skill ${isMatched ? "career-card__skill--matched" : ""}`}>
                  {isMatched && "✓ "}{skill}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerCard;
