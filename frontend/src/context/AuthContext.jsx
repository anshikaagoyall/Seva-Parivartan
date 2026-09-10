import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('seva_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('seva_token') || '');
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token || localStorage.getItem('seva_user')) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/me');
      if (res.data.success) {
        const currentUser = res.data.user || res.data.data || null;
        setUser(currentUser);
        setTeacherProfile(res.data.teacherProfile || null);
        localStorage.setItem('seva_user', JSON.stringify(currentUser));
      }
    } catch (err) {
      console.warn('[AuthContext] Auth verify warning:', err.message);
      setUser(null);
      setTeacherProfile(null);
      localStorage.removeItem('seva_user');
      localStorage.removeItem('seva_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token || 'cookie-session');
      setUser(res.data.user);
      if (res.data.token) {
        localStorage.setItem('seva_token', res.data.token);
      }
      localStorage.setItem('seva_user', JSON.stringify(res.data.user));
      await fetchCurrentUser();
    }
    return res.data;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      setToken(res.data.token || 'cookie-session');
      setUser(res.data.user);
      if (res.data.token) {
        localStorage.setItem('seva_token', res.data.token);
      }
      localStorage.setItem('seva_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore logout errors for session cleanup
    }

    setToken('');
    setUser(null);
    setTeacherProfile(null);
    localStorage.removeItem('seva_token');
    localStorage.removeItem('seva_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        teacherProfile,
        loading,
        login,
        register,
        logout,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
