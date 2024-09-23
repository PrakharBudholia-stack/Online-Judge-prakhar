import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import { useHistory } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          const response = await axiosInstance.get('/api/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Error initializing auth:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', { email, password });
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      axiosInstance.defaults.headers.common['Authorization'] = `${response.data.accessToken}`;
      setUser(response.data);
     
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete axiosInstance.defaults.headers.common['Authorization'];
      setUser(null);
      history.push('/login');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };