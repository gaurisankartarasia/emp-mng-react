

import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  // Check for token and fetch user data on mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await apiClient.get('/auth/session');
        setUser(response.data.employee); // Assuming the endpoint returns user data in response.data.employee
      } catch (error) {
        console.error('Token verification failed:', error);
        setUser(null); // Clear user state if token is invalid
      } finally {
        setLoading(false); // Set loading to false after verification
      }
    };

    verifyToken();
  }, []);

  const login = async (identifier, password) => {
    try {
      const response = await apiClient.post('/auth/login', { identifier, password });
      const { employee } = response.data;
      setUser(employee);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading, // Expose loading state
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;