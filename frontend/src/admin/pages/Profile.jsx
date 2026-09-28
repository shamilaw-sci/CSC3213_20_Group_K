/**
 * Profile.jsx — Admin Profile Page
 */
import React, { useState } from 'react';
import { Form, Input, Button, message, Tag, Divider } from 'antd';
import { useAuth } from '../context/AuthContext';
import { MdEdit, MdLock, MdSave } from 'react-icons/md';

const Profile = () => {
  const { admin } = useAuth();
  const [editMode, setEditMode]   = useState(false);
  const [pwdMode, setPwdMode]     = useState(false);
  const [form]  = Form.useForm();
  const [pwdForm] = Form.useForm();

  const adminData = admin || { name: 'Super Admin', email: 'admin@futurepath.ai', role: 'Super Admin' };
  const initials = adminData.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'SA';

  const handleProfileSave = () => {
    form.validateFields().then(() => {
      message.success('Profile updated successfully!');
      setEditMode(false);
    });
  };

  const handlePasswordSave = () => {
    pwdForm.validateFields().then(vals => {
      if (vals.newPassword !== vals.confirmPassword) {
        return message.error('Passwords do not match');
      }
      message.success('Password changed successfully!');
      setPwdMode(false);
      pwdForm.resetFields();
    });
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>My Profile</h1><p>Manage your admin account</p></div>
      </div>

      {/* Hero banner */}
      <div className="profile-hero">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-hero-info">
          <h2>{adminData.name}</h2>
          <p>{adminData.email}</p>
          <Tag color="blue" style={{ borderRadius: 6, marginTop: 8, fontWeight: 600 }}>{adminData.role}</Tag>
        </div>
      </div>

      {/* Profile Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Edit Profile */}
        <div className="admin-card">
          <div className="admin-card__header">
            <span className="admin-card__title">👤 Personal Information</span>
            <Button icon={<MdEdit />} size="small" onClick={() => { setEditMode(e => !e); form.setFieldsValue({ name: adminData.name, email: adminData.email, phone: adminData.phone || '', department: adminData.department || 'IT Administration' }); }} style={{ borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              {editMode ? 'Cancel' : 'Edit'}
            </Button>
          </div>
          <div className="admin-card__body">
            {editMode ? (
              <Form form={form} layout="vertical">
                <Form.Item label="Full Name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
                <Form.Item label="Phone" name="phone"><Input placeholder="+94 77 xxx xxxx" /></Form.Item>
                <Form.Item label="Department" name="department"><Input /></Form.Item>
                <Button type="primary" icon={<MdSave />} onClick={handleProfileSave} style={{ borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6 }}>Save Changes</Button>
              </Form>
            ) : (
              <div>
                {[
                  { label: 'Full Name',   value: adminData.name },
                  { label: 'Email',       value: adminData.email },
                  { label: 'Role',        value: adminData.role || 'Super Admin' },
                  { label: 'Department',  value: 'IT Administration' },
                  { label: 'Last Login',  value: 'Today at 09:45 AM' },
                  { label: 'Member Since',value: '2024-01-15' },
                ].map(f => (
                  <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b', fontSize: 13 }}>{f.label}</span>
                    <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 13 }}>{f.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Change Password */}
        <div>
          <div className="admin-card" style={{ marginBottom: 20 }}>
            <div className="admin-card__header">
              <span className="admin-card__title">🔒 Change Password</span>
              <Button icon={<MdLock />} size="small" onClick={() => setPwdMode(e => !e)} style={{ borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                {pwdMode ? 'Cancel' : 'Change'}
              </Button>
            </div>
            <div className="admin-card__body">
              {pwdMode ? (
                <Form form={pwdForm} layout="vertical">
                  <Form.Item label="Current Password" name="currentPassword" rules={[{ required: true }]}><Input.Password /></Form.Item>
                  <Form.Item label="New Password" name="newPassword" rules={[{ required: true, min: 8, message: 'Min 8 characters' }]}><Input.Password /></Form.Item>
                  <Form.Item label="Confirm New Password" name="confirmPassword" rules={[{ required: true }]}><Input.Password /></Form.Item>
                  <Button type="primary" onClick={handlePasswordSave} style={{ borderRadius: 8 }}>Update Password</Button>
                </Form>
              ) : (
                <div style={{ color: '#64748b', fontSize: 13, padding: '8px 0' }}>
                  <p>Password last changed: <strong style={{ color: '#1e293b' }}>30 days ago</strong></p>
                  <p style={{ marginTop: 8 }}>Use a strong password with at least 8 characters, including letters, numbers, and symbols.</p>
                </div>
              )}
            </div>
          </div>

          {/* Account Stats */}
          <div className="admin-card">
            <div className="admin-card__header"><span className="admin-card__title">📊 Account Statistics</span></div>
            <div className="admin-card__body">
              {[
                { label: 'Students Managed', value: '1,284', color: '#1e40af' },
                { label: 'Careers Added',     value: '48',    color: '#10b981' },
                { label: 'Feedback Reviewed', value: '312',   color: '#f59e0b' },
                { label: 'Reports Generated', value: '67',    color: '#8b5cf6' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', fontSize: 13 }}>{s.label}</span>
                  <span style={{ fontWeight: 800, fontSize: 18, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
