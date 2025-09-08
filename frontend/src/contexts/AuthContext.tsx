import * as React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { User } from '@/types';

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

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {}
});

interface AuthProviderProps {
  children: React.ReactNode;
}

// Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setAuthToken(storedToken);
        try {
          const res = await api.get('/auth/me');
          // Backend shape: { success, data: user }
          setUser(res.data?.data ?? null);
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
      // Backend shape: { success, data: { token, user } }
      const token = res.data?.data?.token as string | undefined;
      const loggedInUser = res.data?.data?.user as User | undefined;

      if (token) setAuthToken(token);
      if (loggedInUser) setUser(loggedInUser);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'An error occurred during login');
      throw err;
    }
  };

  // Register user
  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      // Backend shape: { success, data: { token, user } }
      const token = res.data?.data?.token as string | undefined;
      const newUser = res.data?.data?.user as User | undefined;

      if (token) setAuthToken(token);
      if (newUser) setUser(newUser);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'An error occurred during registration');
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
        clearError,
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