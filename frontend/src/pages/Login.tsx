import React, { useState } from 'react';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Box,
  Typography,
  Container,
  Alert,
  Paper,
  Grid,
  Divider,
  Chip,
  useTheme,
} from '@mui/material';
import {
  LockOutlined as LockIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Psychology as AIIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { login, error: authError, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // Get redirect path from location state or default to dashboard
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Clear previous errors
    setError(null);
    clearError();
    
    // Basic validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!password) {
      setError('Password is required');
      return;
    }
    
    try {
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials for portfolio
  const handleDemoLogin = () => {
    setEmail('demo@ai-dashmind.com');
    setPassword('demo123');
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Left side - Project Information */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'primary.main',
                    mr: 2,
                  }}
                >
                  <DashboardIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" component="h1" fontWeight="bold" color="primary.main">
                    AI-Dashmind
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Intelligent Dashboard
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h4" component="h2" gutterBottom fontWeight="600">
                Advanced AI-Powered Analytics Dashboard
              </Typography>
              
              <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4, fontSize: '1.1rem' }}>
                Experience the future of data analytics with our intelligent dashboard featuring 
                real-time insights, machine learning predictions, and interactive visualizations.
              </Typography>

              {/* Feature highlights */}
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AIIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" fontWeight="500">
                        AI-Powered Insights
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AnalyticsIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" fontWeight="500">
                        Real-time Analytics
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <DashboardIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" fontWeight="500">
                        Interactive Dashboards
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SecurityIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" fontWeight="500">
                        Secure & Scalable
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Tech stack */}
              {/* Removed 'Built with Modern Technologies' and Chip components as requested */}
            </Box>
          </Grid>

          {/* Right side - Login Form */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={8} 
              sx={{ 
                p: 4, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <LockIcon sx={{ fontSize: 28 }} />
                </Avatar>
                
                <Typography component="h1" variant="h4" fontWeight="600" gutterBottom>
                  Welcome Back
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                  Sign in to access your AI-powered dashboard
                </Typography>
                
                {(error || authError) && (
                  <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                    {error || authError}
                  </Alert>
                )}
                
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 3 }}
                  />
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ 
                      mb: 2, 
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>

                  {/* Demo login button */}
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={handleDemoLogin}
                    sx={{ 
                      mb: 3,
                      py: 1.5,
                      fontSize: '1rem',
                    }}
                  >
                    Try Demo Account
                  </Button>

                  <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>

                  <Grid container justifyContent="center">
                    <Grid item>
                      <Link component={RouterLink} to="/register" variant="body2" sx={{ fontWeight: 500 }}>
                        Don't have an account? Sign Up
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login; 