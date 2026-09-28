/**
 * Reports.jsx — Report generation and export
 */
import React, { useState } from 'react';
import { Table, Button, Tag, message, Select, DatePicker, Spin } from 'antd';
import { MdPictureAsPdf, MdTableChart, MdCode, MdDownload } from 'react-icons/md';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const { Option } = Select;
const { RangePicker } = DatePicker;

/* ── Sample Report Data ──────────────────────────────────────── */
const STUDENT_REPORT = [
  { id: 'ST001', name: 'Ashan Perera',    faculty: 'Computing',   program: 'BSc CS',  year: 2, completion: '85%', status: 'Active',   recommendations: 4 },
  { id: 'ST002', name: 'Nimal Silva',     faculty: 'Engineering', program: 'BEng CE', year: 3, completion: '72%', status: 'Active',   recommendations: 3 },
  { id: 'ST003', name: 'Kavindu Manoj',  faculty: 'Business',    program: 'BBA IT',  year: 1, completion: '45%', status: 'Inactive', recommendations: 1 },
  { id: 'ST004', name: 'Sachini Dias',   faculty: 'Computing',   program: 'BSc IT',  year: 2, completion: '91%', status: 'Active',   recommendations: 6 },
  { id: 'ST005', name: 'Tharushi Lanka', faculty: 'Science',     program: 'BSc DS',  year: 4, completion: '78%', status: 'Active',   recommendations: 5 },
];

const CAREER_REPORT = [
  { name: 'Software Engineer',    industry: 'Technology', demand: 'Very High', salary: '$85,000', recommendations: 360 },
  { name: 'Data Scientist',        industry: 'Technology', demand: 'High',      salary: '$92,000', recommendations: 282 },
  { name: 'Cybersecurity Analyst', industry: 'Security',   demand: 'Very High', salary: '$90,000', recommendations: 180 },
  { name: 'Cloud Architect',       industry: 'Technology', demand: 'Very High', salary: '$115,000', recommendations: 154 },
  { name: 'UX Designer',           industry: 'Design',     demand: 'High',      salary: '$72,000', recommendations: 128 },
];

const FEEDBACK_REPORT = [
  { student: 'Ashan Perera',   rating: 5, comment: 'Excellent recommendations!', date: '2025-07-28', status: 'Reviewed' },
  { student: 'Nimal Silva',    rating: 4, comment: 'Very helpful platform.',      date: '2025-07-27', status: 'Reviewed' },
  { student: 'Kavindu Manoj', rating: 3, comment: 'Could use more options.',     date: '2025-07-26', status: 'Pending'  },
  { student: 'Sachini Dias',   rating: 5, comment: 'Accurate skill matching.',    date: '2025-07-25', status: 'Reviewed' },
];

const REPORT_CONFIGS = {
  students: {
    title: '📋 Student Report',
    desc: 'Complete list of all registered students with their profiles and status.',
    data: STUDENT_REPORT,
    columns: [
      { title: 'Student ID', dataIndex: 'id', key: 'id' },
      { title: 'Full Name', dataIndex: 'name', key: 'name' },
      { title: 'Faculty', dataIndex: 'faculty', key: 'faculty' },
      { title: 'Program', dataIndex: 'program', key: 'program' },
      { title: 'Year', dataIndex: 'year', key: 'year' },
      { title: 'Completion', dataIndex: 'completion', key: 'completion' },
      { title: 'Status', dataIndex: 'status', key: 'status', render: s => <Tag color={s==='Active'?'green':'red'} style={{borderRadius:6}}>{s}</Tag> },
      { title: 'Recommendations', dataIndex: 'recommendations', key: 'recs' },
    ],
    pdfHeaders: ['ID','Name','Faculty','Program','Year','Completion','Status','Recs'],
    pdfFields: ['id','name','faculty','program','year','completion','status','recommendations'],
  },
  careers: {
    title: '💼 Career Report',
    desc: 'Overview of all career paths with demand levels and salary ranges.',
    data: CAREER_REPORT,
    columns: [
      { title: 'Career Name', dataIndex: 'name', key: 'name' },
      { title: 'Industry', dataIndex: 'industry', key: 'industry' },
      { title: 'Demand Level', dataIndex: 'demand', key: 'demand', render: d => <Tag color={d==='Very High'?'blue':'green'} style={{borderRadius:6}}>{d}</Tag> },
      { title: 'Avg. Salary', dataIndex: 'salary', key: 'salary' },
      { title: 'Total Recommendations', dataIndex: 'recommendations', key: 'recs' },
    ],
    pdfHeaders: ['Career Name','Industry','Demand','Salary','Recommendations'],
    pdfFields: ['name','industry','demand','salary','recommendations'],
  },
  feedback: {
    title: '💬 Feedback Report',
    desc: 'Student feedback and ratings for the platform.',
    data: FEEDBACK_REPORT,
    columns: [
      { title: 'Student', dataIndex: 'student', key: 'student' },
      { title: 'Rating', dataIndex: 'rating', key: 'rating', render: r => '★'.repeat(r) + ' (' + r + '/5)' },
      { title: 'Comment', dataIndex: 'comment', key: 'comment', ellipsis: true },
      { title: 'Date', dataIndex: 'date', key: 'date' },
      { title: 'Status', dataIndex: 'status', key: 'status', render: s => <Tag color={s==='Reviewed'?'blue':'orange'} style={{borderRadius:6}}>{s}</Tag> },
    ],
    pdfHeaders: ['Student','Rating','Comment','Date','Status'],
    pdfFields: ['student','rating','comment','date','status'],
  },
};

const Reports = () => {
  const [activeReport, setActive] = useState('students');
  const [loading, setLoading]     = useState(false);
  const config = REPORT_CONFIGS[activeReport];

  const exportPDF = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.setTextColor(30, 64, 175);
        doc.text('FuturePath AI — Admin Report', 14, 20);
        doc.setFontSize(12);
        doc.setTextColor(100, 116, 139);
        doc.text(`Report: ${config.title.replace(/^[^\w]+/, '')}`, 14, 30);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 37);

        const body = config.data.map(row => config.pdfFields.map(f => {
          const val = row[f];
          return typeof val === 'number' ? val : String(val ?? '');
        }));

        doc.autoTable({
          startY: 45,
          head: [config.pdfHeaders],
          body,
          theme: 'grid',
          headStyles: { fillColor: [30, 64, 175], fontSize: 10 },
          bodyStyles: { fontSize: 10 },
        });

        doc.save(`${activeReport}-report-${Date.now()}.pdf`);
        message.success('PDF exported!');
      } catch (e) { message.error('PDF export failed: ' + e.message); }
      setLoading(false);
    }, 500);
  };

  const exportExcel = () => {
    setLoading(true);
    setTimeout(() => {
      const ws = XLSX.utils.json_to_sheet(config.data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, activeReport);
      XLSX.writeFile(wb, `${activeReport}-report-${Date.now()}.xlsx`);
      message.success('Excel exported!');
      setLoading(false);
    }, 300);
  };

  const exportCSV = () => {
    setLoading(true);
    setTimeout(() => {
      const headers = config.pdfHeaders.join(',');
      const rows = config.data.map(row =>
        config.pdfFields.map(f => `"${row[f] ?? ''}"`).join(',')
      ).join('\n');
      const csv = headers + '\n' + rows;
      const blob = new Blob([csv], { type: 'text/csv' });
      saveAs(blob, `${activeReport}-report-${Date.now()}.csv`);
      message.success('CSV exported!');
      setLoading(false);
    }, 200);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Reports</h1><p>Generate and export system reports</p></div>
      </div>

      {/* Report Type Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {Object.entries(REPORT_CONFIGS).map(([key, cfg]) => (
          <div key={key} onClick={() => setActive(key)} style={{
            background: 'white', borderRadius: 12, padding: 20, border: activeReport === key ? '2px solid #1e40af' : '1px solid #e2e8f0',
            cursor: 'pointer', transition: 'all 0.2s', boxShadow: activeReport === key ? '0 4px 20px rgba(30,64,175,0.15)' : '0 2px 8px rgba(0,0,0,0.05)',
          }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{cfg.title.split(' ')[0]}</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: activeReport === key ? '#1e40af' : '#1e293b' }}>
              {cfg.title.replace(/^[^\w]+/, '')}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{cfg.desc}</div>
          </div>
        ))}
      </div>

      {/* Export Buttons */}
      <div className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-card__header">
          <span className="admin-card__title">{config.title}</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="report-export-btn" onClick={exportPDF} disabled={loading}>
              <MdPictureAsPdf style={{ color: '#ef4444' }} /> Export PDF
            </button>
            <button className="report-export-btn" onClick={exportExcel} disabled={loading}>
              <MdTableChart style={{ color: '#10b981' }} /> Export Excel
            </button>
            <button className="report-export-btn" onClick={exportCSV} disabled={loading}>
              <MdCode style={{ color: '#3b82f6' }} /> Export CSV
            </button>
          </div>
        </div>
        {loading && <div style={{ textAlign: 'center', padding: 20 }}><Spin /></div>}
      </div>

      {/* Preview Table */}
      <div className="admin-card">
        <div className="admin-card__header">
          <span className="admin-card__title">📄 Report Preview</span>
          <span style={{ fontSize: 12, color: '#64748b' }}>{config.data.length} records</span>
        </div>
        <Table
          dataSource={config.data}
          columns={config.columns}
          rowKey={(_, i) => i}
          pagination={{ pageSize: 10 }}
          size="middle"
          scroll={{ x: 'max-content' }}
        />
      </div>
    </div>
  );
};

export default Reports;
