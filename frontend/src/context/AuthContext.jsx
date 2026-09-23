import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/apiClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('accessToken') || null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const response = await apiClient('/user/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        throw new Error('Failed to fetch user');
      }
    } catch (error) {
      console.error('Session expired or invalid:', error);
      clearAuth();
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const clearAuth = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
  }, []);

  useEffect(() => {
    const handleLogoutEvent = () => clearAuth();
    window.addEventListener('auth_logout', handleLogoutEvent);
    return () => window.removeEventListener('auth_logout', handleLogoutEvent);
  }, [clearAuth]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('accessToken', token);
      fetchUser();
    } else {
      clearAuth();
      setIsAuthLoading(false);
    }
  }, [token, fetchUser, clearAuth]);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8080/Auth/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }

      const data = await response.json();
      if (data.accessToken) {
        setToken(data.accessToken);
        // fetchUser will be triggered by the token change effect
        return { success: true };
      } else {
        throw new Error('Invalid response from server.');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:8080/Auth/Logout', {
        method: 'POST',
        credentials: 'include' // Important: ensures the backend clears the HttpOnly refresh cookie
      });
    } catch (err) {
      console.error('Logout API failed, but clearing local state anyway', err);
    } finally {
      clearAuth();
    }
  };

  const value = {
    token,
    user,
    isAuthenticated,
    isAuthLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};