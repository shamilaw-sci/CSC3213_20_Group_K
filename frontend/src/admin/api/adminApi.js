/**
 * adminApi.js
 * Axios instance for all admin API calls.
 * Automatically attaches JWT Bearer token.
 */
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const adminApi = axios.create({
  baseURL: `${BASE_URL}/api/admin`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT token to every request
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// Handle 401 globally
adminApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

/* ─── Auth ──────────────────────────────────────────────────── */
export const loginAdmin   = (data)    => adminApi.post('/auth/login', data);
export const getProfile   = ()        => adminApi.get('/auth/profile');

/* ─── Dashboard ─────────────────────────────────────────────── */
export const getDashboardStats  = () => adminApi.get('/dashboard/stats');
export const getRecentActivity  = () => adminApi.get('/dashboard/activity');

/* ─── Students ──────────────────────────────────────────────── */
export const getStudents    = (params) => adminApi.get('/students', { params });
export const getStudent     = (id)     => adminApi.get(`/students/${id}`);
export const createStudent  = (data)   => adminApi.post('/students', data);
export const updateStudent  = (id, data) => adminApi.put(`/students/${id}`, data);
export const deleteStudent  = (id)     => adminApi.delete(`/students/${id}`);
export const toggleStudentStatus = (id) => adminApi.patch(`/students/${id}/toggle-status`);

/* ─── Careers ───────────────────────────────────────────────── */
export const getCareers    = (params) => adminApi.get('/careers', { params });
export const getCareer     = (id)     => adminApi.get(`/careers/${id}`);
export const createCareer  = (data)   => adminApi.post('/careers', data);
export const updateCareer  = (id, data) => adminApi.put(`/careers/${id}`, data);
export const deleteCareer  = (id)     => adminApi.delete(`/careers/${id}`);

/* ─── Skills ────────────────────────────────────────────────── */
export const getSkills    = (params) => adminApi.get('/skills', { params });
export const createSkill  = (data)   => adminApi.post('/skills', data);
export const updateSkill  = (id, data) => adminApi.put(`/skills/${id}`, data);
export const deleteSkill  = (id)     => adminApi.delete(`/skills/${id}`);

/* ─── Learning Resources ────────────────────────────────────── */
export const getResources   = (params) => adminApi.get('/resources', { params });
export const createResource = (data)   => adminApi.post('/resources', data);
export const updateResource = (id, data) => adminApi.put(`/resources/${id}`, data);
export const deleteResource = (id)     => adminApi.delete(`/resources/${id}`);

/* ─── Feedback ──────────────────────────────────────────────── */
export const getFeedbacks       = (params)      => adminApi.get('/feedback', { params });
export const deleteFeedback     = (id)          => adminApi.delete(`/feedback/${id}`);
export const markFeedbackReviewed = (id)        => adminApi.patch(`/feedback/${id}/review`);
export const replyFeedback      = (id, reply)   => adminApi.patch(`/feedback/${id}/reply`, { reply });

/* ─── Analytics ─────────────────────────────────────────────── */
export const getAnalytics = () => adminApi.get('/analytics');

/* ─── Reports ───────────────────────────────────────────────── */
export const getReportData = (type) => adminApi.get(`/reports/${type}`);

/* ─── Settings ──────────────────────────────────────────────── */
export const getSettings    = ()       => adminApi.get('/settings');
export const updateSettings = (data)   => adminApi.put('/settings', data);

export default adminApi;
