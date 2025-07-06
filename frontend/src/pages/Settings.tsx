import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  DataUsage as DataUsageIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';

const Settings: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { addNotification } = useNotifications();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [dataRetention, setDataRetention] = useState(90);

  const handleSaveSettings = () => {
    // In a real app, save to backend
    addNotification('Settings saved successfully!', 'success');
  };

  const handleResetSettings = () => {
    // Reset to defaults
    setAutoRefresh(true);
    setRefreshInterval(30);
    setLanguage('en');
    setTimezone('UTC');
    setEmailNotifications(true);
    setPushNotifications(true);
    setDataRetention(90);
    addNotification('Settings reset to defaults', 'info');
  };

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Appearance Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DarkModeIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Appearance</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={isDarkMode}
                    onChange={toggleTheme}
                    color="primary"
                  />
                }
                label="Dark Mode"
              />
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Switch between light and dark themes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Notifications</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    color="primary"
                  />
                }
                label="Email Notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                    color="primary"
                  />
                }
                label="Push Notifications"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Data & Performance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DataUsageIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Data & Performance</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    color="primary"
                  />
                }
                label="Auto Refresh Data"
              />
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                Refresh Interval (seconds)
              </Typography>
              <Slider
                value={refreshInterval}
                onChange={(_, value) => setRefreshInterval(value as number)}
                min={10}
                max={300}
                step={10}
                marks
                valueLabelDisplay="auto"
                disabled={!autoRefresh}
              />
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                Data Retention (days)
              </Typography>
              <Slider
                value={dataRetention}
                onChange={(_, value) => setDataRetention(value as number)}
                min={30}
                max={365}
                step={30}
                marks
                valueLabelDisplay="auto"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Regional Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LanguageIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Regional Settings</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Language</InputLabel>
                <Select
                  value={language}
                  label="Language"
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Timezone</InputLabel>
                <Select
                  value={timezone}
                  label="Timezone"
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  {timezones.map((tz) => (
                    <MenuItem key={tz} value={tz}>
                      {tz}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Security</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Two-Factor Authentication"
                    secondary="Add an extra layer of security to your account"
                  />
                  <ListItemSecondaryAction>
                    <Chip label="Enabled" color="success" size="small" />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Session Timeout"
                    secondary="Automatically log out after 30 minutes of inactivity"
                  />
                  <ListItemSecondaryAction>
                    <Chip label="30 min" color="primary" size="small" />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="API Access"
                    secondary="Manage API keys and access tokens"
                  />
                  <ListItemSecondaryAction>
                    <Button size="small" variant="outlined">
                      Manage
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleResetSettings}
            >
              Reset to Defaults
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
            >
              Save Settings
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings; 