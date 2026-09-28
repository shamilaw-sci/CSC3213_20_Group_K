/**
 * Feedback.jsx — Feedback Management
 */
import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Modal, Form, Input, Space, Popconfirm, message, Rate, Tooltip } from 'antd';
import { MdDelete, MdCheckCircle, MdReply } from 'react-icons/md';
import { getFeedbacks, deleteFeedback, markFeedbackReviewed, replyFeedback } from '../api/adminApi';

const { TextArea } = Input;
const { Search } = Input;

const SAMPLE_FEEDBACK = [
  { _id: 'f1', student: 'Ashan Perera',    rating: 5, comment: 'The career recommendations were spot-on! I found my dream job path through this system.',      status: 'Pending',  date: '2025-07-28', reply: null },
  { _id: 'f2', student: 'Nimal Silva',     rating: 4, comment: 'Very helpful platform. The skill matching is accurate and suggestions are relevant.',           status: 'Reviewed', date: '2025-07-27', reply: 'Thank you for your feedback, Nimal!' },
  { _id: 'f3', student: 'Kavindu Manoj',  rating: 3, comment: 'Good but could use more career options for business students.',                                  status: 'Pending',  date: '2025-07-26', reply: null },
  { _id: 'f4', student: 'Sachini Dias',   rating: 5, comment: 'Excellent! The profile completion feature motivated me to add more information.',                status: 'Reviewed', date: '2025-07-25', reply: 'Great to hear, Sachini!' },
  { _id: 'f5', student: 'Tharushi Lanka', rating: 4, comment: 'I liked the learning resources section. Found many relevant courses.',                           status: 'Pending',  date: '2025-07-24', reply: null },
  { _id: 'f6', student: 'Dulshan Jay',    rating: 2, comment: 'The recommendations did not match my interests well. Needs improvement.',                        status: 'Pending',  date: '2025-07-23', reply: null },
  { _id: 'f7', student: 'Malsha Rath',    rating: 5, comment: 'Amazing system! Changed my perspective on career planning completely.',                          status: 'Pending',  date: '2025-07-22', reply: null },
  { _id: 'f8', student: 'Sahan Wicks',    rating: 4, comment: 'Good interface, easy to use. Could improve the recommendation explanations.',                   status: 'Reviewed', date: '2025-07-21', reply: 'Thanks for the suggestion, Sahan!' },
];

const Feedback = () => {
  const [data, setData]         = useState(SAMPLE_FEEDBACK);
  const [filtered, setFiltered] = useState(SAMPLE_FEEDBACK);
  const [search, setSearch]     = useState('');
  const [statusF, setStatusF]   = useState('');
  const [replyModal, setReply]  = useState(false);
  const [selected, setSelected] = useState(null);
  const [form]                  = Form.useForm();

  useEffect(() => {
    getFeedbacks().then(r => { setData(r.data); setFiltered(r.data); }).catch(() => {});
  }, []);

  useEffect(() => {
    let d = data;
    if (search)  d = d.filter(f => f.student?.toLowerCase().includes(search.toLowerCase()) || f.comment?.toLowerCase().includes(search.toLowerCase()));
    if (statusF) d = d.filter(f => f.status === statusF);
    setFiltered(d);
  }, [search, statusF, data]);

  const handleDelete = (id) => {
    deleteFeedback(id).catch(() => {});
    setData(d => d.filter(f => f._id !== id));
    message.success('Feedback deleted');
  };

  const handleMarkReviewed = (id) => {
    markFeedbackReviewed(id).catch(() => {});
    setData(d => d.map(f => f._id === id ? { ...f, status: 'Reviewed' } : f));
    message.success('Marked as reviewed');
  };

  const handleReply = async () => {
    try {
      const vals = await form.validateFields();
      await replyFeedback(selected._id, vals.reply).catch(() => {});
      setData(d => d.map(f => f._id === selected._id ? { ...f, reply: vals.reply, status: 'Reviewed' } : f));
      message.success('Reply sent');
      setReply(false);
    } catch {}
  };

  const RATING_STARS = (rating) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <Rate disabled value={rating} style={{ fontSize: 14 }} />
      <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{rating}/5</span>
    </div>
  );

  const columns = [
    {
      title: 'Student', dataIndex: 'student', key: 'student', sorter: (a,b) => a.student.localeCompare(b.student),
      render: (name) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{name?.[0]}</div>
          <span style={{ fontWeight: 600 }}>{name}</span>
        </div>
      )
    },
    { title: 'Rating', dataIndex: 'rating', key: 'rating', width: 200, sorter: (a,b) => a.rating - b.rating, render: RATING_STARS },
    { title: 'Comment', dataIndex: 'comment', key: 'comment', ellipsis: true },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 110, sorter: (a,b) => new Date(a.date)-new Date(b.date) },
    {
      title: 'Status', dataIndex: 'status', key: 'status', width: 110,
      render: (s) => <span className={`status-badge ${s?.toLowerCase()}`}>{s}</span>
    },
    {
      title: 'Reply', dataIndex: 'reply', key: 'reply', width: 80,
      render: (r) => r ? <Tag color="blue" style={{ borderRadius: 6 }}>Replied</Tag> : <Tag style={{ borderRadius: 6 }}>None</Tag>
    },
    {
      title: 'Actions', key: 'actions', width: 140, fixed: 'right',
      render: (_, r) => (
        <Space size={4}>
          {r.status !== 'Reviewed' && (
            <Tooltip title="Mark Reviewed">
              <Button size="small" icon={<MdCheckCircle />} style={{ borderRadius: 6, color: '#10b981', borderColor: '#10b981' }} onClick={() => handleMarkReviewed(r._id)} />
            </Tooltip>
          )}
          <Tooltip title="Reply">
            <Button size="small" type="primary" icon={<MdReply />} style={{ borderRadius: 6 }} onClick={() => { setSelected(r); form.setFieldsValue({ reply: r.reply || '' }); setReply(true); }} />
          </Tooltip>
          <Popconfirm title="Delete this feedback?" onConfirm={() => handleDelete(r._id)} okButtonProps={{ danger: true }}>
            <Button size="small" danger icon={<MdDelete />} style={{ borderRadius: 6 }} />
          </Popconfirm>
        </Space>
      )
    },
  ];

  const avgRating = (data.reduce((s, f) => s + f.rating, 0) / data.length).toFixed(1);

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Feedback Management</h1><p>Student ratings and comments</p></div>
      </div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b' }}>{avgRating}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>Average Rating</div>
          <Rate disabled value={parseFloat(avgRating)} style={{ fontSize: 16, marginTop: 4 }} />
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#1e40af' }}>{data.length}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>Total Feedback</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b' }}>{data.filter(f => f.status === 'Pending').length}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>Pending Review</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#10b981' }}>{data.filter(f => f.status === 'Reviewed').length}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>Reviewed</div>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-card__body">
          <div style={{ display: 'flex', gap: 12 }}>
            <Search placeholder="Search by student or comment…" allowClear style={{ width: 300 }} onChange={e => setSearch(e.target.value)} />
            <Button.Group>
              <Button type={statusF === '' ? 'primary' : 'default'} onClick={() => setStatusF('')}>All</Button>
              <Button type={statusF === 'Pending' ? 'primary' : 'default'} onClick={() => setStatusF('Pending')}>Pending</Button>
              <Button type={statusF === 'Reviewed' ? 'primary' : 'default'} onClick={() => setStatusF('Reviewed')}>Reviewed</Button>
            </Button.Group>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <Table dataSource={filtered} columns={columns} rowKey="_id" scroll={{ x: 1000 }} pagination={{ pageSize: 10 }} size="middle" />
      </div>

      {/* Reply Modal */}
      <Modal title={`Reply to ${selected?.student}`} open={replyModal} onCancel={() => setReply(false)} onOk={handleReply} okText="Send Reply">
        {selected && (
          <div>
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14, marginBottom: 16, marginTop: 12 }}>
              <Rate disabled value={selected.rating} style={{ fontSize: 14 }} />
              <p style={{ marginTop: 8, color: '#475569' }}>{selected.comment}</p>
            </div>
            <Form form={form} layout="vertical">
              <Form.Item label="Your Reply" name="reply" rules={[{ required: true, message: 'Please enter a reply' }]}>
                <TextArea rows={4} placeholder="Type your reply to the student…" />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Feedback;
