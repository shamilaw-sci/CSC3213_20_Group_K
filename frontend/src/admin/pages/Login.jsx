/**
 * Login.jsx — Admin Login Page
 */
import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginAdmin } from '../api/adminApi';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await loginAdmin({ email: values.email, password: values.password });
      login(res.data.admin, res.data.token, values.remember);
      message.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      message.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // Demo quick-login
  const demoLogin = () => {
    login(
      { name: 'Super Admin', email: 'admin@futurepath.ai', role: 'Super Admin' },
      'demo-token-12345',
      true
    );
    navigate('/admin/dashboard');
  };

  return (
    <div className="admin-login-root">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">🎓</div>
          <h1>FuturePath AI</h1>
          <p>Admin Control Panel</p>
        </div>

        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input placeholder="admin@futurepath.ai" autoComplete="email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="Enter your password" autoComplete="current-password" />
          </Form.Item>

          <div className="login-extras" style={{ marginBottom: 24 }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a href="#forgot" className="login-forgot">Forgot password?</a>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="login-submit-btn"
            >
              Sign In to Dashboard
            </Button>
          </Form.Item>

          <Button
            block
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
              borderRadius: 12,
              height: 42,
              fontWeight: 600,
            }}
            onClick={demoLogin}
          >
            🚀 Demo Login (No Backend Needed)
          </Button>
        </Form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
          CSC3213 Group K • FuturePath AI Career Guidance System
        </p>
      </div>
    </div>
  );
};

export default Login;
