/**
 * AuthContext.jsx
 * Admin authentication context using JWT + localStorage.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const stored = localStorage.getItem('adminUser');
    if (token && stored) {
      try { setAdmin(JSON.parse(stored)); } catch (_) {}
    }
    setLoading(false);
  }, []);

  const login = (user, token, remember = false) => {
    const storage = remember ? localStorage : sessionStorage;
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));
    setAdmin(user);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    sessionStorage.removeItem('adminToken');
    setAdmin(null);
  };

  const isAuthenticated = () => !!admin && !!localStorage.getItem('adminToken');

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
