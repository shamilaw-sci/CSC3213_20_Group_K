/**
 * Careers.jsx — Career Management CRUD
 */
import React, { useState, useEffect } from 'react';
import {
  Table, Button, Input, Select, Tag, Modal, Form,
  Space, Popconfirm, message, Tooltip, InputNumber, Rate
} from 'antd';
import { MdAdd, MdEdit, MdDelete, MdVisibility } from 'react-icons/md';
import { getCareers, createCareer, updateCareer, deleteCareer } from '../api/adminApi';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const SAMPLE_CAREERS = [
  { _id: 'c1', name: 'Software Engineer',    description: 'Design and develop software systems and applications.', requiredSkills: ['Java','Python','React'], industry: 'Technology', educationLevel: "Bachelor's", demandLevel: 'Very High', averageSalary: 85000, jobOutlook: 'Excellent', certifications: ['AWS Certified','Google Cloud'] },
  { _id: 'c2', name: 'Data Scientist',        description: 'Analyze and interpret complex data to guide decisions.', requiredSkills: ['Python','ML','SQL'], industry: 'Technology', educationLevel: "Master's", demandLevel: 'High', averageSalary: 92000, jobOutlook: 'Very Good', certifications: ['TensorFlow','Databricks'] },
  { _id: 'c3', name: 'UX Designer',           description: 'Create user-centered digital experiences.', requiredSkills: ['Figma','CSS','User Research'], industry: 'Design', educationLevel: "Bachelor's", demandLevel: 'High', averageSalary: 72000, jobOutlook: 'Good', certifications: ['Google UX','NN/g UX'] },
  { _id: 'c4', name: 'Cybersecurity Analyst', description: 'Protect systems from digital attacks.', requiredSkills: ['Network Security','SIEM','Python'], industry: 'Security', educationLevel: "Bachelor's", demandLevel: 'Very High', averageSalary: 90000, jobOutlook: 'Excellent', certifications: ['CISSP','CEH'] },
  { _id: 'c5', name: 'Cloud Architect',        description: 'Design and oversee cloud infrastructure.', requiredSkills: ['AWS','Kubernetes','Terraform'], industry: 'Technology', educationLevel: "Bachelor's", demandLevel: 'Very High', averageSalary: 115000, jobOutlook: 'Excellent', certifications: ['AWS SA','GCP Pro'] },
  { _id: 'c6', name: 'Business Analyst',       description: 'Bridge business needs with IT solutions.', requiredSkills: ['SQL','Excel','BPMN'], industry: 'Business', educationLevel: "Bachelor's", demandLevel: 'Medium', averageSalary: 68000, jobOutlook: 'Good', certifications: ['CBAP','PMI-PBA'] },
  { _id: 'c7', name: 'Machine Learning Engineer', description: 'Build and deploy ML models at scale.', requiredSkills: ['PyTorch','MLOps','Python'], industry: 'Technology', educationLevel: "Master's", demandLevel: 'Very High', averageSalary: 105000, jobOutlook: 'Excellent', certifications: ['AWS ML','TensorFlow Dev'] },
  { _id: 'c8', name: 'DevOps Engineer',        description: 'Automate and manage CI/CD pipelines.', requiredSkills: ['Docker','Jenkins','Linux'], industry: 'Technology', educationLevel: "Bachelor's", demandLevel: 'High', averageSalary: 88000, jobOutlook: 'Very Good', certifications: ['CKA','AWS DevOps'] },
];

const DEMAND_COLOR = { 'Very High': 'blue', 'High': 'green', 'Medium': 'orange', 'Low': 'red' };
const INDUSTRIES = ['Technology','Design','Security','Business','Healthcare','Finance','Education'];

const Careers = () => {
  const [data, setData]         = useState(SAMPLE_CAREERS);
  const [filtered, setFiltered] = useState(SAMPLE_CAREERS);
  const [loading, setLoading]   = useState(false);
  const [search, setSearch]     = useState('');
  const [industryF, setIndustry]= useState('');
  const [demandF, setDemand]    = useState('');
  const [viewModal, setViewModal]= useState(false);
  const [editModal, setEditModal]= useState(false);
  const [selected, setSelected] = useState(null);
  const [form]                  = Form.useForm();

  useEffect(() => {
    getCareers().then(r => { setData(r.data); setFiltered(r.data); }).catch(() => {});
  }, []);

  useEffect(() => {
    let d = data;
    if (search)   d = d.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.industry?.toLowerCase().includes(search.toLowerCase()));
    if (industryF) d = d.filter(c => c.industry === industryF);
    if (demandF)   d = d.filter(c => c.demandLevel === demandF);
    setFiltered(d);
  }, [search, industryF, demandF, data]);

  const openEdit = (rec) => { setSelected(rec); form.setFieldsValue({ ...rec, requiredSkills: rec?.requiredSkills?.join(', '), certifications: rec?.certifications?.join(', ') }); setEditModal(true); };
  const openAdd  = ()    => { setSelected(null); form.resetFields(); setEditModal(true); };

  const handleSave = async () => {
    try {
      const vals = await form.validateFields();
      const payload = {
        ...vals,
        requiredSkills: vals.requiredSkills?.split(',').map(s => s.trim()).filter(Boolean) || [],
        certifications: vals.certifications?.split(',').map(s => s.trim()).filter(Boolean) || [],
      };
      if (selected?._id) {
        await updateCareer(selected._id, payload).catch(() => {});
        setData(d => d.map(c => c._id === selected._id ? { ...c, ...payload } : c));
        message.success('Career updated');
      } else {
        const fakeId = 'c' + Date.now();
        setData(d => [...d, { _id: fakeId, ...payload }]);
        message.success('Career added');
      }
      setEditModal(false);
    } catch (err) { if (err.errorFields) return; message.error('Error saving'); }
  };

  const handleDelete = (id) => {
    deleteCareer(id).catch(() => {});
    setData(d => d.filter(c => c._id !== id));
    message.success('Career deleted');
  };

  const columns = [
    {
      title: 'Career Name', dataIndex: 'name', key: 'name', sorter: (a,b) => a.name?.localeCompare(b.name),
      render: (name, r) => (
        <div>
          <div style={{ fontWeight: 700, color: '#1e293b' }}>{name}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{r.industry}</div>
        </div>
      )
    },
    { title: 'Education Level', dataIndex: 'educationLevel', key: 'edu', width: 130 },
    {
      title: 'Demand Level', dataIndex: 'demandLevel', key: 'demand', width: 120,
      sorter: (a,b) => a.demandLevel?.localeCompare(b.demandLevel),
      render: (d) => <Tag color={DEMAND_COLOR[d] || 'default'} style={{ borderRadius: 6 }}>{d}</Tag>
    },
    {
      title: 'Avg. Salary (USD)', dataIndex: 'averageSalary', key: 'salary', width: 150, sorter: (a,b)=>a.averageSalary-b.averageSalary,
      render: (s) => s ? `$${s.toLocaleString()}` : '—'
    },
    {
      title: 'Required Skills', dataIndex: 'requiredSkills', key: 'skills',
      render: (skills) => (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {(skills || []).slice(0, 3).map(s => <Tag key={s} color="blue" style={{ borderRadius: 6, fontSize: 11 }}>{s}</Tag>)}
          {(skills || []).length > 3 && <Tag style={{ borderRadius: 6, fontSize: 11 }}>+{skills.length - 3}</Tag>}
        </div>
      )
    },
    { title: 'Job Outlook', dataIndex: 'jobOutlook', key: 'outlook', render: (o) => <Tag color="purple" style={{ borderRadius: 6 }}>{o}</Tag> },
    {
      title: 'Actions', key: 'actions', width: 140, fixed: 'right',
      render: (_, r) => (
        <Space size={4}>
          <Tooltip title="View"><Button size="small" icon={<MdVisibility />} onClick={() => { setSelected(r); setViewModal(true); }} style={{ borderRadius: 6 }} /></Tooltip>
          <Tooltip title="Edit"><Button size="small" type="primary" icon={<MdEdit />} onClick={() => openEdit(r)} style={{ borderRadius: 6 }} /></Tooltip>
          <Popconfirm title="Delete this career?" onConfirm={() => handleDelete(r._id)} okButtonProps={{ danger: true }}>
            <Button size="small" danger icon={<MdDelete />} style={{ borderRadius: 6 }} />
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Career Management</h1><p>Manage career paths and opportunities</p></div>
        <Button type="primary" icon={<MdAdd />} size="large" style={{ borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6 }} onClick={openAdd}>Add Career</Button>
      </div>

      <div className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-card__body">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Search placeholder="Search careers…" allowClear style={{ width: 260 }} onChange={e => setSearch(e.target.value)} />
            <Select placeholder="Industry" allowClear style={{ width: 160 }} onChange={setIndustry}>{INDUSTRIES.map(i => <Option key={i} value={i}>{i}</Option>)}</Select>
            <Select placeholder="Demand Level" allowClear style={{ width: 150 }} onChange={setDemand}>
              {['Very High','High','Medium','Low'].map(d => <Option key={d} value={d}>{d}</Option>)}
            </Select>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <Table dataSource={filtered} columns={columns} rowKey="_id" loading={loading} scroll={{ x: 1100 }} pagination={{ pageSize: 10, showSizeChanger: true }} size="middle" />
      </div>

      {/* View Modal */}
      <Modal title={null} open={viewModal} onCancel={() => setViewModal(false)} footer={[<Button key="close" onClick={() => setViewModal(false)}>Close</Button>, <Button key="edit" type="primary" onClick={() => { setViewModal(false); openEdit(selected); }}>Edit</Button>]} width={680}>
        {selected && (
          <div>
            <div style={{ background: 'linear-gradient(135deg,#059669,#10b981)', borderRadius: '12px 12px 0 0', padding: '28px 24px', margin: '-24px -24px 24px', color: 'white' }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>💼 {selected.name}</div>
              <div style={{ opacity: 0.85, marginTop: 4 }}>{selected.industry} • {selected.educationLevel}</div>
            </div>
            <p style={{ color: '#475569', marginBottom: 20 }}>{selected.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>DEMAND LEVEL</div>
                <Tag color={DEMAND_COLOR[selected.demandLevel]} style={{ borderRadius: 6, fontSize: 13, padding: '2px 10px' }}>{selected.demandLevel}</Tag>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>AVG SALARY</div>
                <div style={{ fontWeight: 700, fontSize: 20, color: '#1e293b' }}>${selected.averageSalary?.toLocaleString()}/yr</div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>JOB OUTLOOK</div>
                <Tag color="purple" style={{ borderRadius: 6 }}>{selected.jobOutlook}</Tag>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>EDUCATION</div>
                <div style={{ fontWeight: 600 }}>{selected.educationLevel}</div>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#1e293b' }}>Required Skills</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(selected.requiredSkills || []).map(s => <Tag key={s} color="blue" style={{ borderRadius: 6 }}>{s}</Tag>)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#1e293b' }}>Required Certifications</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(selected.certifications || []).map(c => <Tag key={c} color="geekblue" style={{ borderRadius: 6 }}>{c}</Tag>)}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal title={selected ? 'Edit Career' : 'Add New Career'} open={editModal} onCancel={() => setEditModal(false)} onOk={handleSave} okText="Save" width={680} style={{ top: 40 }}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item label="Career Name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item label="Industry" name="industry" rules={[{ required: true }]}>
              <Select>{INDUSTRIES.map(i => <Option key={i} value={i}>{i}</Option>)}</Select>
            </Form.Item>
            <Form.Item label="Education Level" name="educationLevel">
              <Select><Option value="Bachelor's">Bachelor's</Option><Option value="Master's">Master's</Option><Option value="PhD">PhD</Option><Option value="Diploma">Diploma</Option></Select>
            </Form.Item>
            <Form.Item label="Demand Level" name="demandLevel">
              <Select>{['Very High','High','Medium','Low'].map(d => <Option key={d} value={d}>{d}</Option>)}</Select>
            </Form.Item>
            <Form.Item label="Average Salary (USD)" name="averageSalary"><InputNumber style={{ width: '100%' }} min={0} formatter={v => `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} /></Form.Item>
            <Form.Item label="Job Outlook" name="jobOutlook"><Select><Option value="Excellent">Excellent</Option><Option value="Very Good">Very Good</Option><Option value="Good">Good</Option><Option value="Fair">Fair</Option></Select></Form.Item>
          </div>
          <Form.Item label="Description" name="description"><TextArea rows={3} /></Form.Item>
          <Form.Item label="Required Skills (comma-separated)" name="requiredSkills"><Input placeholder="e.g. Python, React, SQL" /></Form.Item>
          <Form.Item label="Required Certifications (comma-separated)" name="certifications"><Input placeholder="e.g. AWS, CISSP" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Careers;
