/**
 * StatCard.jsx — Animated metric card for dashboard
 */
import React from 'react';

const StatCard = ({ label, value, icon, color = 'blue', change, changeDir = 'up' }) => (
  <div className={`stat-card ${color}`}>
    <div className="stat-card__icon">{icon}</div>
    <div className="stat-card__body">
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value ?? '—'}</div>
      {change !== undefined && (
        <div className={`stat-card__change ${changeDir}`}>
          {changeDir === 'up' ? '▲' : '▼'} {change}
        </div>
      )}
    </div>
  </div>
);

export default StatCard;
