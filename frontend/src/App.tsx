import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { CssBaseline, Box } from '@mui/material';

// Pages
import Dashboard from './pages/Dashboard';
import DataSources from './pages/DataSources';
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

// Contexts
import { useAuth } from './contexts/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: theme => theme.palette.background.default,
      }}>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/" /> : <Register />} 
          />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/data-sources" element={
            <ProtectedRoute>
              <Layout>
                <DataSources />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/data-sources/:type" element={
            <ProtectedRoute>
              <Layout>
                <DataSources />
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
            <Layout>
              <NotFound />
            </Layout>
          } />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;
