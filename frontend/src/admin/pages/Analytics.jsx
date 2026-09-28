/**
 * Analytics.jsx — Charts & Metrics Dashboard
 */
import React from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Progress, Tag } from 'antd';

const PIE_COLORS = ['#1e40af','#3b82f6','#06b6d4','#10b981','#f59e0b','#8b5cf6','#ef4444'];

const CAREER_DIST = [
  { name: 'Software Engineer', value: 28, count: 360 },
  { name: 'Data Scientist',    value: 22, count: 282 },
  { name: 'Cybersecurity',     value: 14, count: 180 },
  { name: 'Cloud Architect',   value: 12, count: 154 },
  { name: 'UX Designer',       value: 10, count: 128 },
  { name: 'Business Analyst',  value: 8,  count: 103 },
  { name: 'Other',             value: 6,  count: 77  },
];

const SKILLS_POP = [
  { skill: 'Python',        students: 820 },
  { skill: 'React',         students: 640 },
  { skill: 'SQL',           students: 580 },
  { skill: 'Machine Learning', students: 510 },
  { skill: 'AWS',           students: 430 },
  { skill: 'Docker',        students: 370 },
  { skill: 'Figma',         students: 310 },
  { skill: 'Java',          students: 290 },
];

const REG_TRENDS = [
  { month: 'Jan', students: 80,  completed: 62 },
  { month: 'Feb', students: 105, completed: 88 },
  { month: 'Mar', students: 98,  completed: 75 },
  { month: 'Apr', students: 140, completed: 118 },
  { month: 'May', students: 127, completed: 99 },
  { month: 'Jun', students: 165, completed: 142 },
  { month: 'Jul', students: 190, completed: 161 },
  { month: 'Aug', students: 175, completed: 148 },
  { month: 'Sep', students: 210, completed: 182 },
  { month: 'Oct', students: 198, completed: 166 },
  { month: 'Nov', students: 230, completed: 195 },
  { month: 'Dec', students: 255, completed: 220 },
];

const DEMAND_STATS = [
  { industry: 'Technology', demand: 95 },
  { industry: 'Healthcare', demand: 80 },
  { industry: 'Finance',    demand: 72 },
  { industry: 'Design',     demand: 65 },
  { industry: 'Business',   demand: 58 },
  { industry: 'Education',  demand: 50 },
];

const SUCCESS_RATE = [
  { subject: 'Career Match', A: 87 },
  { subject: 'Skill Align',  A: 78 },
  { subject: 'Profile Comp', A: 72 },
  { subject: 'User Satis',   A: 91 },
  { subject: 'Engagement',   A: 69 },
  { subject: 'Retention',    A: 83 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', padding: '10px 14px', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: 13 }}>
      <p style={{ fontWeight: 700, marginBottom: 4, color: '#1e293b' }}>{label}</p>
      {payload.map(p => <p key={p.name} style={{ color: p.color, margin: 0 }}>{p.name}: <strong>{p.value}</strong></p>)}
    </div>
  );
};

const Analytics = () => (
  <div>
    <div className="admin-page-header">
      <div><h1>Analytics</h1><p>Data insights and platform metrics</p></div>
    </div>

    {/* Key Metrics */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
      {[
        { label: 'Recommendation Success Rate', value: '87%', color: '#10b981', desc: 'Students satisfied with recommendations' },
        { label: 'Average Profile Completion',  value: '72%', color: '#3b82f6', desc: 'Across all registered students' },
        { label: 'Monthly Active Users',        value: '618', color: '#8b5cf6', desc: 'Students active in last 30 days' },
      ].map(m => (
        <div key={m.label} style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: m.color }}>{m.value}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginTop: 4 }}>{m.label}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{m.desc}</div>
        </div>
      ))}
    </div>

    {/* Row 1: Skills Bar + Career Pie */}
    <div className="charts-grid" style={{ marginBottom: 24 }}>
      <div className="admin-card">
        <div className="admin-card__header"><span className="admin-card__title">🔥 Most Popular Skills</span></div>
        <div className="admin-card__body">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={SKILLS_POP} layout="vertical" margin={{ top: 0, right: 20, left: 60, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis type="category" dataKey="skill" tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="students" fill="#3b82f6" radius={[0,4,4,0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__header"><span className="admin-card__title">🥧 Most Recommended Careers</span></div>
        <div className="admin-card__body">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={CAREER_DIST} cx="50%" cy="45%" outerRadius={100} innerRadius={50} dataKey="value" label={({name, percent}) => `${(percent*100).toFixed(0)}%`} labelLine={false}>
                {CAREER_DIST.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v}%`, n]} />
              <Legend iconType="circle" iconSize={10} formatter={(v) => <span style={{ fontSize: 11, color: '#64748b' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    {/* Row 2: Registration Trends Line */}
    <div className="admin-card" style={{ marginBottom: 24 }}>
      <div className="admin-card__header"><span className="admin-card__title">📈 Student Registration & Completion Trends</span></div>
      <div className="admin-card__body">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={REG_TRENDS} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} name="Registrations" />
            <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} name="Profile Completed" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Row 3: Career Demand + Radar */}
    <div className="charts-grid">
      <div className="admin-card">
        <div className="admin-card__header"><span className="admin-card__title">📊 Career Demand by Industry</span></div>
        <div className="admin-card__body">
          {DEMAND_STATS.map(d => (
            <div key={d.industry} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6, fontWeight: 500 }}>
                <span>{d.industry}</span>
                <span style={{ fontWeight: 700, color: '#1e40af' }}>{d.demand}%</span>
              </div>
              <Progress percent={d.demand} strokeColor={{ '0%': '#1e40af', '100%': '#06b6d4' }} showInfo={false} />
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__header"><span className="admin-card__title">🎯 Recommendation Success Metrics</span></div>
        <div className="admin-card__body">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={SUCCESS_RATE} cx="50%" cy="50%" outerRadius={90}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Score" dataKey="A" stroke="#1e40af" fill="#1e40af" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);

export default Analytics;
