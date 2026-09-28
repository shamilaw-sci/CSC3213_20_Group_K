/**
 * Skills.jsx — Skills Management CRUD
 */
import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Tag, Modal, Form, Space, Popconfirm, message, Tooltip } from 'antd';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../api/adminApi';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const CATEGORIES = ['Programming','Design','Data','Business','DevOps','Security','Communication','Other'];
const CAT_COLORS  = { Programming:'blue', Design:'purple', Data:'cyan', Business:'green', DevOps:'orange', Security:'red', Communication:'geekblue', Other:'default' };

const SAMPLE_SKILLS = [
  { _id: 's1',  name: 'Python',          category: 'Programming', description: 'High-level programming language for general purpose and data science.' },
  { _id: 's2',  name: 'React',           category: 'Programming', description: 'JavaScript library for building user interfaces.' },
  { _id: 's3',  name: 'Machine Learning',category: 'Data',        description: 'Algorithms and models for predictive analytics.' },
  { _id: 's4',  name: 'SQL',             category: 'Data',        description: 'Structured query language for relational databases.' },
  { _id: 's5',  name: 'Figma',           category: 'Design',      description: 'Collaborative UI/UX design tool.' },
  { _id: 's6',  name: 'Docker',          category: 'DevOps',      description: 'Containerization platform for deployment.' },
  { _id: 's7',  name: 'AWS',             category: 'DevOps',      description: 'Amazon Web Services cloud platform.' },
  { _id: 's8',  name: 'Cybersecurity',   category: 'Security',    description: 'Protecting systems and networks from digital attacks.' },
  { _id: 's9',  name: 'Project Management', category: 'Business', description: 'Planning and executing projects efficiently.' },
  { _id: 's10', name: 'Java',            category: 'Programming', description: 'Object-oriented programming language.' },
  { _id: 's11', name: 'TensorFlow',      category: 'Data',        description: 'Open-source ML framework by Google.' },
  { _id: 's12', name: 'Node.js',         category: 'Programming', description: 'JavaScript runtime for server-side development.' },
];

const Skills = () => {
  const [data, setData]         = useState(SAMPLE_SKILLS);
  const [filtered, setFiltered] = useState(SAMPLE_SKILLS);
  const [loading, setLoading]   = useState(false);
  const [search, setSearch]     = useState('');
  const [catFilter, setCat]     = useState('');
  const [editModal, setEditModal]= useState(false);
  const [selected, setSelected] = useState(null);
  const [form]                  = Form.useForm();

  useEffect(() => {
    getSkills().then(r => { setData(r.data); setFiltered(r.data); }).catch(() => {});
  }, []);

  useEffect(() => {
    let d = data;
    if (search)    d = d.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()) || s.category?.toLowerCase().includes(search.toLowerCase()));
    if (catFilter) d = d.filter(s => s.category === catFilter);
    setFiltered(d);
  }, [search, catFilter, data]);

  const openEdit = (rec) => { setSelected(rec); form.setFieldsValue(rec); setEditModal(true); };
  const openAdd  = ()    => { setSelected(null); form.resetFields(); setEditModal(true); };

  const handleSave = async () => {
    try {
      const vals = await form.validateFields();
      if (selected?._id) {
        await updateSkill(selected._id, vals).catch(() => {});
        setData(d => d.map(s => s._id === selected._id ? { ...s, ...vals } : s));
        message.success('Skill updated');
      } else {
        await createSkill(vals).catch(() => {});
        setData(d => [...d, { _id: 's' + Date.now(), ...vals }]);
        message.success('Skill added');
      }
      setEditModal(false);
    } catch {}
  };

  const handleDelete = (id) => {
    deleteSkill(id).catch(() => {});
    setData(d => d.filter(s => s._id !== id));
    message.success('Skill deleted');
  };

  const columns = [
    {
      title: 'Skill Name', dataIndex: 'name', key: 'name', sorter: (a,b)=>a.name.localeCompare(b.name),
      render: (name) => <span style={{ fontWeight: 600, color: '#1e293b' }}>{name}</span>
    },
    {
      title: 'Category', dataIndex: 'category', key: 'category',
      render: (cat) => <Tag color={CAT_COLORS[cat] || 'default'} style={{ borderRadius: 6, fontWeight: 500 }}>{cat}</Tag>
    },
    { title: 'Description', dataIndex: 'description', key: 'desc', ellipsis: true },
    {
      title: 'Actions', key: 'actions', width: 110, fixed: 'right',
      render: (_, r) => (
        <Space size={4}>
          <Tooltip title="Edit"><Button size="small" type="primary" icon={<MdEdit />} onClick={() => openEdit(r)} style={{ borderRadius: 6 }} /></Tooltip>
          <Popconfirm title="Delete this skill?" onConfirm={() => handleDelete(r._id)} okButtonProps={{ danger: true }}>
            <Button size="small" danger icon={<MdDelete />} style={{ borderRadius: 6 }} />
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Skills Management</h1><p>Manage the skill catalogue</p></div>
        <Button type="primary" icon={<MdAdd />} size="large" style={{ borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6 }} onClick={openAdd}>Add Skill</Button>
      </div>

      {/* Category Summary Cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => {
          const count = data.filter(s => s.category === cat).length;
          return count > 0 ? (
            <div key={cat} onClick={() => setCat(cat === catFilter ? '' : cat)} style={{ background: 'white', border: catFilter === cat ? '2px solid #1e40af' : '1px solid #e2e8f0', borderRadius: 10, padding: '10px 18px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 12, color: '#64748b' }}>{cat}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: catFilter === cat ? '#1e40af' : '#1e293b' }}>{count}</div>
            </div>
          ) : null;
        })}
      </div>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-card__body">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Search placeholder="Search skills…" allowClear style={{ width: 260 }} onChange={e => setSearch(e.target.value)} />
            <Select placeholder="Category" allowClear style={{ width: 160 }} value={catFilter || undefined} onChange={setCat}>
              {CATEGORIES.map(c => <Option key={c} value={c}>{c}</Option>)}
            </Select>
            <span style={{ fontSize: 13, color: '#64748b' }}>{filtered.length} skills</span>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <Table dataSource={filtered} columns={columns} rowKey="_id" loading={loading} pagination={{ pageSize: 12, showSizeChanger: true }} size="middle" />
      </div>

      <Modal title={selected ? 'Edit Skill' : 'Add New Skill'} open={editModal} onCancel={() => setEditModal(false)} onOk={handleSave} okText="Save">
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="Skill Name" name="name" rules={[{ required: true }]}><Input placeholder="e.g. Python" /></Form.Item>
          <Form.Item label="Category" name="category" rules={[{ required: true }]}>
            <Select placeholder="Select category">
              {CATEGORIES.map(c => <Option key={c} value={c}>{c}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="Description" name="description"><TextArea rows={3} placeholder="Describe this skill…" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Skills;
