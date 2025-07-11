import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      if (localStorage.getItem('token')) {
        setAuthToken(localStorage.getItem('token') as string);
        
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Set auth token
  const setAuthToken = (token: string) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      
      // Set token
      setAuthToken(res.data.token);
      
      // Set user
      setUser(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
      throw err;
    }
  };

  // Register user
  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      
      // Set token
      setAuthToken(res.data.token);
      
      // Set user
      setUser(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during registration');
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    setAuthToken('');
    setUser(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 