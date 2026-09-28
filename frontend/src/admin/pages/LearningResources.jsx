/**
 * LearningResources.jsx — Learning Resources Management CRUD
 */
import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Tag, Modal, Form, Space, Popconfirm, message, Tooltip } from 'antd';
import { MdAdd, MdEdit, MdDelete, MdOpenInNew } from 'react-icons/md';
import { getResources, createResource, updateResource, deleteResource } from '../api/adminApi';

const { Search } = Input;
const { Option } = Select;

const DIFFICULTY_COLOR  = { Beginner: 'green', Intermediate: 'blue', Advanced: 'red', Expert: 'purple' };
const PROVIDERS = ['Coursera','Udemy','edX','LinkedIn Learning','Pluralsight','YouTube','MIT OpenCourseWare','FreeCodeCamp','Other'];
const LANGUAGES = ['English','Sinhala','Tamil','French','Spanish','German','Japanese'];

const SAMPLE_RESOURCES = [
  { _id: 'r1',  title: 'Python for Data Science',         provider: 'Coursera',          url: 'https://coursera.org', difficultyLevel: 'Beginner',     relatedSkill: 'Python',           duration: '4 weeks',  language: 'English' },
  { _id: 'r2',  title: 'React — The Complete Guide',      provider: 'Udemy',             url: 'https://udemy.com',    difficultyLevel: 'Intermediate',  relatedSkill: 'React',            duration: '48 hours', language: 'English' },
  { _id: 'r3',  title: 'Machine Learning Specialization', provider: 'Coursera',          url: 'https://coursera.org', difficultyLevel: 'Intermediate',  relatedSkill: 'Machine Learning', duration: '3 months', language: 'English' },
  { _id: 'r4',  title: 'AWS Cloud Practitioner',          provider: 'edX',               url: 'https://edx.org',      difficultyLevel: 'Beginner',     relatedSkill: 'AWS',              duration: '6 weeks',  language: 'English' },
  { _id: 'r5',  title: 'Docker & Kubernetes MasterClass', provider: 'Udemy',             url: 'https://udemy.com',    difficultyLevel: 'Advanced',     relatedSkill: 'Docker',           duration: '20 hours', language: 'English' },
  { _id: 'r6',  title: 'Figma UI/UX Design',              provider: 'LinkedIn Learning', url: 'https://linkedin.com', difficultyLevel: 'Beginner',     relatedSkill: 'Figma',            duration: '8 hours',  language: 'English' },
  { _id: 'r7',  title: 'SQL for Beginners',               provider: 'FreeCodeCamp',      url: 'https://freecodecamp.org', difficultyLevel: 'Beginner', relatedSkill: 'SQL',             duration: '10 hours', language: 'English' },
  { _id: 'r8',  title: 'Cybersecurity Fundamentals',      provider: 'edX',               url: 'https://edx.org',      difficultyLevel: 'Intermediate',  relatedSkill: 'Cybersecurity',    duration: '8 weeks',  language: 'English' },
];

const LearningResources = () => {
  const [data, setData]         = useState(SAMPLE_RESOURCES);
  const [filtered, setFiltered] = useState(SAMPLE_RESOURCES);
  const [loading, setLoading]   = useState(false);
  const [search, setSearch]     = useState('');
  const [diffF, setDiff]        = useState('');
  const [editModal, setEditModal]= useState(false);
  const [selected, setSelected] = useState(null);
  const [form]                  = Form.useForm();

  useEffect(() => {
    getResources().then(r => { setData(r.data); setFiltered(r.data); }).catch(() => {});
  }, []);

  useEffect(() => {
    let d = data;
    if (search) d = d.filter(r => r.title?.toLowerCase().includes(search.toLowerCase()) || r.provider?.toLowerCase().includes(search.toLowerCase()) || r.relatedSkill?.toLowerCase().includes(search.toLowerCase()));
    if (diffF)  d = d.filter(r => r.difficultyLevel === diffF);
    setFiltered(d);
  }, [search, diffF, data]);

  const openEdit = (rec) => { setSelected(rec); form.setFieldsValue(rec); setEditModal(true); };
  const openAdd  = ()    => { setSelected(null); form.resetFields(); setEditModal(true); };

  const handleSave = async () => {
    try {
      const vals = await form.validateFields();
      if (selected?._id) {
        await updateResource(selected._id, vals).catch(() => {});
        setData(d => d.map(r => r._id === selected._id ? { ...r, ...vals } : r));
        message.success('Resource updated');
      } else {
        await createResource(vals).catch(() => {});
        setData(d => [...d, { _id: 'r' + Date.now(), ...vals }]);
        message.success('Resource added');
      }
      setEditModal(false);
    } catch {}
  };

  const handleDelete = (id) => {
    deleteResource(id).catch(() => {});
    setData(d => d.filter(r => r._id !== id));
    message.success('Resource deleted');
  };

  const columns = [
    {
      title: 'Course Title', dataIndex: 'title', key: 'title', sorter: (a,b) => a.title.localeCompare(b.title),
      render: (title, r) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1e293b' }}>{title}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{r.provider}</div>
        </div>
      )
    },
    {
      title: 'Difficulty', dataIndex: 'difficultyLevel', key: 'diff', width: 130,
      render: (d) => <Tag color={DIFFICULTY_COLOR[d]} style={{ borderRadius: 6, fontWeight: 500 }}>{d}</Tag>
    },
    { title: 'Related Skill', dataIndex: 'relatedSkill', key: 'skill', render: (s) => <Tag color="blue" style={{ borderRadius: 6 }}>{s}</Tag> },
    { title: 'Duration', dataIndex: 'duration', key: 'duration', width: 100 },
    { title: 'Language', dataIndex: 'language', key: 'lang', width: 100 },
    {
      title: 'URL', dataIndex: 'url', key: 'url', width: 60,
      render: (url) => <a href={url} target="_blank" rel="noreferrer"><Button size="small" icon={<MdOpenInNew />} type="link" /></a>
    },
    {
      title: 'Actions', key: 'actions', width: 100, fixed: 'right',
      render: (_, r) => (
        <Space size={4}>
          <Tooltip title="Edit"><Button size="small" type="primary" icon={<MdEdit />} onClick={() => openEdit(r)} style={{ borderRadius: 6 }} /></Tooltip>
          <Popconfirm title="Delete this resource?" onConfirm={() => handleDelete(r._id)} okButtonProps={{ danger: true }}>
            <Button size="small" danger icon={<MdDelete />} style={{ borderRadius: 6 }} />
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Learning Resources</h1><p>Manage courses and educational materials</p></div>
        <Button type="primary" icon={<MdAdd />} size="large" style={{ borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6 }} onClick={openAdd}>Add Resource</Button>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {['Beginner','Intermediate','Advanced','Expert'].map(d => (
          <div key={d} style={{ background: 'white', borderRadius: 10, padding: '12px 20px', border: '1px solid #e2e8f0', flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: { Beginner:'#10b981', Intermediate:'#3b82f6', Advanced:'#ef4444', Expert:'#8b5cf6' }[d] }}>
              {data.filter(r => r.difficultyLevel === d).length}
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{d}</div>
          </div>
        ))}
      </div>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-card__body">
          <div style={{ display: 'flex', gap: 12 }}>
            <Search placeholder="Search by title, provider or skill…" allowClear style={{ width: 300 }} onChange={e => setSearch(e.target.value)} />
            <Select placeholder="Difficulty" allowClear style={{ width: 160 }} onChange={setDiff}>
              {['Beginner','Intermediate','Advanced','Expert'].map(d => <Option key={d} value={d}>{d}</Option>)}
            </Select>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <Table dataSource={filtered} columns={columns} rowKey="_id" loading={loading} scroll={{ x: 900 }} pagination={{ pageSize: 10, showSizeChanger: true }} size="middle" />
      </div>

      <Modal title={selected ? 'Edit Resource' : 'Add Learning Resource'} open={editModal} onCancel={() => setEditModal(false)} onOk={handleSave} okText="Save" width={600} style={{ top: 40 }}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="Course Title" name="title" rules={[{ required: true }]}><Input /></Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item label="Provider" name="provider" rules={[{ required: true }]}>
              <Select>{PROVIDERS.map(p => <Option key={p} value={p}>{p}</Option>)}</Select>
            </Form.Item>
            <Form.Item label="Difficulty Level" name="difficultyLevel" rules={[{ required: true }]}>
              <Select>{['Beginner','Intermediate','Advanced','Expert'].map(d => <Option key={d} value={d}>{d}</Option>)}</Select>
            </Form.Item>
            <Form.Item label="Related Skill" name="relatedSkill"><Input placeholder="e.g. Python" /></Form.Item>
            <Form.Item label="Duration" name="duration"><Input placeholder="e.g. 4 weeks" /></Form.Item>
            <Form.Item label="Language" name="language">
              <Select>{LANGUAGES.map(l => <Option key={l} value={l}>{l}</Option>)}</Select>
            </Form.Item>
          </div>
          <Form.Item label="URL" name="url" rules={[{ type: 'url', message: 'Enter a valid URL' }]}><Input placeholder="https://…" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LearningResources;
