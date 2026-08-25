import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('veluntu_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [agency, setAgency] = useState(() => {
    const saved = localStorage.getItem('veluntu_agency');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('veluntu_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        if (res.success && res.data) {
          setUser(res.data.user);
          setAgency(res.data.agency);
          localStorage.setItem('veluntu_user', JSON.stringify(res.data.user));
          localStorage.setItem('veluntu_agency', JSON.stringify(res.data.agency));
        }
      } catch (err) {
        console.warn('Session expired or invalid:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('veluntu_token', res.token);
      localStorage.setItem('veluntu_user', JSON.stringify(res.user));
      localStorage.setItem('veluntu_agency', JSON.stringify(res.agency));
      setUser(res.user);
      setAgency(res.agency);
      return res;
    }
    throw new Error(res.error || 'Falha ao autenticar');
  };

  const register = async (formData) => {
    const res = await api.registerAgency(formData);
    if (res.success && res.token) {
      localStorage.setItem('veluntu_token', res.token);
      localStorage.setItem('veluntu_user', JSON.stringify(res.user));
      localStorage.setItem('veluntu_agency', JSON.stringify(res.agency));
      setUser(res.user);
      setAgency(res.agency);
      return res;
    }
    throw new Error(res.error || 'Falha ao registrar agência');
  };

  const logout = () => {
    localStorage.removeItem('veluntu_token');
    localStorage.removeItem('veluntu_user');
    localStorage.removeItem('veluntu_agency');
    setUser(null);
    setAgency(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        agency,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
