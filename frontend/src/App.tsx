import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { CssBaseline, Box } from '@mui/material';

// Import pages directly
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import MLModels from './pages/MLModels';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ChatAssistant from './components/ChatAssistant';
import PWAInstall from './components/PWAInstall';

// Contexts
import { useAuth } from './contexts/AuthContext';
import { useNotifications } from './contexts/NotificationContext';

function App() {
  const { isAuthenticated, loading } = useAuth();
  const { notifications } = useNotifications();

  // Show simple loading text if authentication is being checked
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <CssBaseline />
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content" style={{
        position: 'absolute',
        left: 0,
        top: 0,
        background: '#1976d2',
        color: '#fff',
        padding: '8px 16px',
        zIndex: 2000,
        transform: 'translateY(-100%)',
        transition: 'transform 0.2s',
      }}
      onFocus={e => (e.currentTarget.style.transform = 'translateY(0)')}
      onBlur={e => (e.currentTarget.style.transform = 'translateY(-100%)')}
      >
        Skip to main content
      </a>
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: theme => theme.palette.background.default,
      }}>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/" /> : <Login />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? <Navigate to="/" /> : <Register />
            } 
          />
          
          {/* Default route - redirect to login if not authenticated */}
          <Route path="/" element={
            isAuthenticated ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          } />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/reports" element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/ml-models" element={
            <ProtectedRoute>
              <Layout>
                <MLModels />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } />

          {/* 404 route */}
          <Route path="*" element={
            isAuthenticated ? (
              <Layout>
                <NotFound />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          } />
        </Routes>

        {/* PWA Components - Only show when authenticated */}
        {isAuthenticated && (
          <>
            <ChatAssistant />
            <PWAInstall />
          </>
        )}
      </Box>
    </BrowserRouter>
  );
}

export default App;
