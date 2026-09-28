/**
 * Dashboard.jsx — Main overview page
 * Stat cards + Bar/Pie/Line charts + Recent activity
 */
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tag, Spin, Avatar } from 'antd';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  MdPeople, MdWork, MdPsychology, MdMenuBook,
  MdAutoAwesome, MdPersonAdd, MdFeedback, MdTrendingUp
} from 'react-icons/md';
import StatCard from '../components/StatCard';

/* ── Sample Data ──────────────────────────────────────────────── */
const STATS = [
  { label: 'Total Students',             value: '1,284',  icon: <MdPeople />,      color: 'blue',   change: '+12% this month', changeDir: 'up' },
  { label: 'Total Careers',              value: '48',     icon: <MdWork />,        color: 'green',  change: '+3 this week',    changeDir: 'up' },
  { label: 'Total Skills',               value: '127',    icon: <MdPsychology />,  color: 'purple', change: '+8 added',        changeDir: 'up' },
  { label: 'Learning Resources',         value: '342',    icon: <MdMenuBook />,    color: 'orange', change: '+5 this week',    changeDir: 'up' },
  { label: 'Recommendations Generated',  value: '9,871',  icon: <MdAutoAwesome />, color: 'cyan',   change: '+234 today',      changeDir: 'up' },
  { label: 'Active Users',               value: '618',    icon: <MdTrendingUp />,  color: 'indigo', change: 'Last 30 days',    changeDir: 'neutral' },
  { label: 'New Registrations Today',    value: '24',     icon: <MdPersonAdd />,   color: 'pink',   change: '+6 vs yesterday', changeDir: 'up' },
  { label: 'Pending Feedback',           value: '37',     icon: <MdFeedback />,    color: 'red',    change: 'Needs review',    changeDir: 'neutral' },
];

const BAR_DATA = [
  { month: 'Jan', recommendations: 620 },
  { month: 'Feb', recommendations: 840 },
  { month: 'Mar', recommendations: 720 },
  { month: 'Apr', recommendations: 1100 },
  { month: 'May', recommendations: 980 },
  { month: 'Jun', recommendations: 1340 },
  { month: 'Jul', recommendations: 1520 },
  { month: 'Aug', recommendations: 1280 },
  { month: 'Sep', recommendations: 900 },
  { month: 'Oct', recommendations: 1050 },
  { month: 'Nov', recommendations: 870 },
  { month: 'Dec', recommendations: 1400 },
];

const PIE_DATA = [
  { name: 'Software Engineering', value: 28 },
  { name: 'Data Science',         value: 22 },
  { name: 'Cybersecurity',        value: 14 },
  { name: 'Cloud Computing',      value: 12 },
  { name: 'UI/UX Design',         value: 10 },
  { name: 'Business Analysis',    value: 8  },
  { name: 'Other',                value: 6  },
];

const LINE_DATA = [
  { month: 'Jan', students: 80  },
  { month: 'Feb', students: 105 },
  { month: 'Mar', students: 98  },
  { month: 'Apr', students: 140 },
  { month: 'May', students: 127 },
  { month: 'Jun', students: 165 },
  { month: 'Jul', students: 190 },
  { month: 'Aug', students: 175 },
  { month: 'Sep', students: 210 },
  { month: 'Oct', students: 198 },
  { month: 'Nov', students: 230 },
  { month: 'Dec', students: 255 },
];

const PIE_COLORS = ['#1e40af','#3b82f6','#06b6d4','#10b981','#f59e0b','#8b5cf6','#94a3b8'];

const RECENT_STUDENTS = [
  { id: 'ST001', name: 'Ashan Perera',   faculty: 'Computing',   program: 'BSc CS',     status: 'Active' },
  { id: 'ST002', name: 'Nimal Silva',    faculty: 'Engineering', program: 'BEng CE',    status: 'Active' },
  { id: 'ST003', name: 'Kavindu Manoj', faculty: 'Business',    program: 'BBA IT',     status: 'Inactive' },
  { id: 'ST004', name: 'Sachini Dias',   faculty: 'Computing',   program: 'BSc IT',     status: 'Active' },
  { id: 'ST005', name: 'Tharushi Lanka', faculty: 'Science',     program: 'BSc DS',     status: 'Active' },
];

const RECENT_FEEDBACK = [
  { student: 'Ashan Perera',   rating: 5, comment: 'Great career recommendations!', date: '2025-07-28' },
  { student: 'Nimal Silva',    rating: 4, comment: 'Very helpful platform.',         date: '2025-07-27' },
  { student: 'Sachini Dias',   rating: 5, comment: 'Accurate skill matching.',       date: '2025-07-26' },
];

const RECENT_CAREERS = [
  { name: 'AI Engineer',        industry: 'Technology',   demand: 'Very High' },
  { name: 'Cloud Architect',    industry: 'Technology',   demand: 'High'      },
  { name: 'UX Researcher',      industry: 'Design',       demand: 'Medium'    },
];

const STUDENT_COLS = [
  { title: 'ID',      dataIndex: 'id',      key: 'id',      width: 80 },
  { title: 'Name',    dataIndex: 'name',    key: 'name' },
  { title: 'Faculty', dataIndex: 'faculty', key: 'faculty' },
  { title: 'Program', dataIndex: 'program', key: 'program' },
  {
    title: 'Status', dataIndex: 'status', key: 'status',
    render: (s) => (
      <Tag color={s === 'Active' ? 'green' : 'red'} style={{ borderRadius: 6 }}>{s}</Tag>
    )
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', padding: '10px 14px', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: 13 }}>
      <p style={{ fontWeight: 700, marginBottom: 4, color: '#1e293b' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, margin: 0 }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* Stat Cards */}
      <div className="stat-grid">
        {STATS.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Charts Row 1 */}
      <div className="charts-grid" style={{ marginBottom: 24 }}>
        {/* Bar Chart */}
        <div className="admin-card">
          <div className="admin-card__header">
            <span className="admin-card__title">📊 Monthly Recommendations</span>
          </div>
          <div className="admin-card__body">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={BAR_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="recommendations" fill="#1e40af" radius={[4,4,0,0]} name="Recommendations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="admin-card">
          <div className="admin-card__header">
            <span className="admin-card__title">🥧 Career Distribution</span>
          </div>
          <div className="admin-card__body">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" outerRadius={90} innerRadius={40} dataKey="value" label={({ name, percent }) => `${(percent*100).toFixed(0)}%`}>
                  {PIE_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v + '%', n]} />
                <Legend iconType="circle" iconSize={10} formatter={(v) => <span style={{ fontSize: 12, color: '#64748b' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Line Chart full width */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div className="admin-card__header">
          <span className="admin-card__title">📈 Student Registration Trend (2025)</span>
        </div>
        <div className="admin-card__body">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={LINE_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#1e40af', r: 4 }} name="New Students" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="charts-grid">
        {/* Recent Students */}
        <div className="admin-card">
          <div className="admin-card__header">
            <span className="admin-card__title">👥 Latest Students</span>
          </div>
          <div className="admin-card__body" style={{ padding: 0 }}>
            <Table
              dataSource={RECENT_STUDENTS}
              columns={STUDENT_COLS}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Recent Feedback */}
          <div className="admin-card" style={{ flex: 1 }}>
            <div className="admin-card__header">
              <span className="admin-card__title">💬 Latest Feedback</span>
            </div>
            <div className="admin-card__body">
              {RECENT_FEEDBACK.map((f, i) => (
                <div key={i} className="activity-row">
                  <div className="activity-avatar" style={{ background: 'rgba(30,64,175,0.1)', color: '#1e40af' }}>
                    {f.student[0]}
                  </div>
                  <div className="activity-info">
                    <div className="activity-name">{f.student}</div>
                    <div className="activity-sub">{f.comment.slice(0, 40)}…</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ color: '#f59e0b', fontSize: 14 }}>{'★'.repeat(f.rating)}</span>
                    <span className="activity-time">{f.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Careers */}
          <div className="admin-card" style={{ flex: 1 }}>
            <div className="admin-card__header">
              <span className="admin-card__title">💼 Latest Careers Added</span>
            </div>
            <div className="admin-card__body">
              {RECENT_CAREERS.map((c, i) => (
                <div key={i} className="activity-row">
                  <div className="activity-avatar" style={{ background: 'rgba(16,185,129,0.1)', color: '#059669' }}>
                    💼
                  </div>
                  <div className="activity-info">
                    <div className="activity-name">{c.name}</div>
                    <div className="activity-sub">{c.industry}</div>
                  </div>
                  <Tag color={c.demand === 'Very High' ? 'blue' : c.demand === 'High' ? 'green' : 'orange'} style={{ borderRadius: 6 }}>
                    {c.demand}
                  </Tag>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
