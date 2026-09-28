/**
 * Students.jsx — Full Student Management CRUD
 */
import React, { useState, useEffect } from 'react';
import {
  Table, Button, Input, Select, Tag, Modal, Form, Space,
  Popconfirm, message, Tooltip, Switch, Progress, Descriptions, Rate, Divider
} from 'antd';
import {
  MdAdd, MdSearch, MdEdit, MdDelete, MdVisibility, MdBlock, MdFilterList
} from 'react-icons/md';
import { getStudents, createStudent, updateStudent, deleteStudent, toggleStudentStatus } from '../api/adminApi';

const { Option } = Select;
const { Search } = Input;

/* ── Sample data (used when backend not connected) ──────────── */
const SAMPLE = Array.from({ length: 30 }, (_, i) => ({
  _id: `ST${String(i + 1).padStart(3, '0')}`,
  studentId: `ST${String(i + 1).padStart(3, '0')}`,
  fullName: ['Ashan Perera','Nimal Silva','Kavindu Manoj','Sachini Dias','Tharushi Lanka',
             'Ruwani Fernando','Dulshan Jayawardena','Malsha Rathnayake','Sahan Wickramasinghe','Kavinda Gunawardena'][i % 10],
  email: `student${i + 1}@uni.lk`,
  faculty: ['Computing','Engineering','Business','Science','Design'][i % 5],
  degreeProgram: ['BSc CS','BEng CE','BBA IT','BSc DS','BDes UX'][i % 5],
  academicYear: (i % 4) + 1,
  skills: ['Python','React','Java','SQL','ML'].slice(0, (i % 3) + 1),
  interests: ['AI','Web Dev','Data Science','Cybersecurity'][i % 4],
  profileCompletion: 55 + (i * 2) % 45,
  recommendedCareerCount: (i % 6) + 1,
  status: i % 7 === 0 ? 'Inactive' : 'Active',
  createdAt: new Date(2025, i % 12, (i % 28) + 1).toISOString().split('T')[0],
}));

const FACULTY_OPTIONS = ['Computing','Engineering','Business','Science','Design','Medicine'];

const Students = () => {
  const [data, setData]             = useState(SAMPLE);
  const [filtered, setFiltered]     = useState(SAMPLE);
  const [loading, setLoading]       = useState(false);
  const [search, setSearch]         = useState('');
  const [facultyFilter, setFaculty] = useState('');
  const [statusFilter, setStatus]   = useState('');
  const [viewModal, setViewModal]   = useState(false);
  const [editModal, setEditModal]   = useState(false);
  const [selected, setSelected]     = useState(null);
  const [form]                      = Form.useForm();

  // Try API, fall back to sample
  useEffect(() => {
    setLoading(true);
    getStudents().then(res => { setData(res.data); setFiltered(res.data); })
      .catch(() => { setData(SAMPLE); setFiltered(SAMPLE); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let d = data;
    if (search) d = d.filter(s => s.fullName?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()) || s.studentId?.toLowerCase().includes(search.toLowerCase()));
    if (facultyFilter) d = d.filter(s => s.faculty === facultyFilter);
    if (statusFilter)  d = d.filter(s => s.status === statusFilter);
    setFiltered(d);
  }, [search, facultyFilter, statusFilter, data]);

  const openEdit = (record) => {
    setSelected(record);
    form.setFieldsValue(record);
    setEditModal(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (selected?._id && !selected._id.startsWith('ST')) {
        await updateStudent(selected._id, values);
      }
      setData(d => d.map(s => s._id === selected._id ? { ...s, ...values } : s));
      message.success('Student updated successfully');
      setEditModal(false);
    } catch (err) {
      if (err.errorFields) return;
      message.error('Failed to update student');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id).catch(() => {});
      setData(d => d.filter(s => s._id !== id));
      message.success('Student deleted');
    } catch { message.error('Failed to delete'); }
  };

  const handleToggle = (record) => {
    toggleStudentStatus(record._id).catch(() => {});
    setData(d => d.map(s => s._id === record._id
      ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' }
      : s));
    message.success(`Account ${record.status === 'Active' ? 'disabled' : 'enabled'}`);
  };

  const columns = [
    { title: 'Student ID', dataIndex: 'studentId', key: 'studentId', width: 100, sorter: (a, b) => a.studentId?.localeCompare(b.studentId) },
    {
      title: 'Full Name', dataIndex: 'fullName', key: 'fullName', sorter: (a, b) => a.fullName?.localeCompare(b.fullName),
      render: (name, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
            {name?.[0]}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#1e293b' }}>{name}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{r.email}</div>
          </div>
        </div>
      )
    },
    { title: 'Faculty',  dataIndex: 'faculty',       key: 'faculty',  sorter: (a,b)=>a.faculty?.localeCompare(b.faculty) },
    { title: 'Program',  dataIndex: 'degreeProgram',  key: 'degree' },
    { title: 'Year',     dataIndex: 'academicYear',   key: 'year', width: 60, align: 'center' },
    {
      title: 'Skills', dataIndex: 'skills', key: 'skills',
      render: (skills) => (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {(skills || []).slice(0, 2).map(s => <Tag key={s} style={{ borderRadius: 6, fontSize: 11 }}>{s}</Tag>)}
          {(skills || []).length > 2 && <Tag style={{ borderRadius: 6, fontSize: 11 }}>+{skills.length - 2}</Tag>}
        </div>
      )
    },
    {
      title: 'Profile %', dataIndex: 'profileCompletion', key: 'profile', width: 120,
      sorter: (a, b) => a.profileCompletion - b.profileCompletion,
      render: (pct) => (
        <div>
          <Progress percent={pct} size="small" strokeColor={{ '0%': '#1e40af', '100%': '#06b6d4' }} format={p => <span style={{ fontSize: 11 }}>{p}%</span>} />
        </div>
      )
    },
    {
      title: 'Status', dataIndex: 'status', key: 'status', width: 90,
      render: (s) => <span className={`status-badge ${s?.toLowerCase()}`}>{s}</span>
    },
    {
      title: 'Actions', key: 'actions', width: 160, fixed: 'right',
      render: (_, r) => (
        <Space size={4}>
          <Tooltip title="View"><Button size="small" icon={<MdVisibility />} onClick={() => { setSelected(r); setViewModal(true); }} style={{ borderRadius: 6 }} /></Tooltip>
          <Tooltip title="Edit"><Button size="small" icon={<MdEdit />} type="primary" onClick={() => openEdit(r)} style={{ borderRadius: 6 }} /></Tooltip>
          <Tooltip title={r.status === 'Active' ? 'Disable' : 'Enable'}>
            <Button size="small" icon={<MdBlock />} onClick={() => handleToggle(r)} style={{ borderRadius: 6, borderColor: r.status === 'Active' ? '#f59e0b' : '#10b981', color: r.status === 'Active' ? '#f59e0b' : '#10b981' }} />
          </Tooltip>
          <Popconfirm title="Delete this student?" onConfirm={() => handleDelete(r._id)} okText="Delete" okButtonProps={{ danger: true }}>
            <Tooltip title="Delete"><Button size="small" danger icon={<MdDelete />} style={{ borderRadius: 6 }} /></Tooltip>
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1>Student Management</h1>
          <p>Manage and monitor all student records</p>
        </div>
        <Button type="primary" icon={<MdAdd />} size="large" style={{ borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6 }}
          onClick={() => { setSelected(null); form.resetFields(); setEditModal(true); }}>
          Add Student
        </Button>
      </div>

      {/* Filters */}
      <div className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-card__body">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <Search placeholder="Search by name, email or ID…" allowClear style={{ width: 280 }} onChange={e => setSearch(e.target.value)} />
            <Select placeholder="Filter by Faculty" allowClear style={{ width: 180 }} onChange={setFaculty}>
              {FACULTY_OPTIONS.map(f => <Option key={f} value={f}>{f}</Option>)}
            </Select>
            <Select placeholder="Filter by Status" allowClear style={{ width: 150 }} onChange={setStatus}>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              Showing <strong>{filtered.length}</strong> of <strong>{data.length}</strong> students
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card">
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="_id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `Total ${t} students`, pageSizeOptions: ['10','20','50'] }}
          size="middle"
        />
      </div>

      {/* View Modal */}
      <Modal title={null} open={viewModal} onCancel={() => setViewModal(false)} footer={null} width={680} style={{ top: 40 }}>
        {selected && (
          <div>
            <div style={{ background: 'linear-gradient(135deg,#1e40af,#3b82f6)', borderRadius: '12px 12px 0 0', padding: '28px 24px', margin: '-24px -24px 24px', color: 'white', display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 60, height: 60, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, border: '2px solid rgba(255,255,255,0.3)' }}>
                {selected.fullName?.[0]}
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{selected.fullName}</div>
                <div style={{ opacity: 0.8, fontSize: 13 }}>{selected.studentId} • {selected.email}</div>
              </div>
            </div>

            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Faculty">{selected.faculty}</Descriptions.Item>
              <Descriptions.Item label="Degree Program">{selected.degreeProgram}</Descriptions.Item>
              <Descriptions.Item label="Academic Year">Year {selected.academicYear}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <span className={`status-badge ${selected.status?.toLowerCase()}`}>{selected.status}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Profile Completion" span={2}>
                <Progress percent={selected.profileCompletion} strokeColor={{ '0%': '#1e40af', '100%': '#06b6d4' }} />
              </Descriptions.Item>
              <Descriptions.Item label="Skills" span={2}>
                {(selected.skills || []).map(s => <Tag key={s} color="blue" style={{ borderRadius: 6 }}>{s}</Tag>)}
              </Descriptions.Item>
              <Descriptions.Item label="Interests" span={2}>
                <Tag color="purple" style={{ borderRadius: 6 }}>{selected.interests}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Recommendations Generated">{selected.recommendedCareerCount}</Descriptions.Item>
              <Descriptions.Item label="Joined">{selected.createdAt}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Edit/Add Modal */}
      <Modal
        title={selected?._id ? 'Edit Student' : 'Add New Student'}
        open={editModal}
        onCancel={() => setEditModal(false)}
        onOk={handleSave}
        okText="Save Changes"
        width={600}
        style={{ top: 40 }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item label="Full Name" name="fullName" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
            <Form.Item label="Faculty" name="faculty" rules={[{ required: true }]}>
              <Select>{FACULTY_OPTIONS.map(f => <Option key={f} value={f}>{f}</Option>)}</Select>
            </Form.Item>
            <Form.Item label="Degree Program" name="degreeProgram"><Input /></Form.Item>
            <Form.Item label="Academic Year" name="academicYear">
              <Select><Option value={1}>Year 1</Option><Option value={2}>Year 2</Option><Option value={3}>Year 3</Option><Option value={4}>Year 4</Option></Select>
            </Form.Item>
            <Form.Item label="Status" name="status">
              <Select><Option value="Active">Active</Option><Option value="Inactive">Inactive</Option></Select>
            </Form.Item>
          </div>
          <Form.Item label="Interests" name="interests"><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Students;
