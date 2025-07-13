import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  useTheme,
  Divider,
} from '@mui/material';
import {
  GetApp as InstallIcon,
  CloudDownload as DownloadIcon,
  Notifications as NotificationIcon,
  WifiOff as OfflineIcon,
  Storage as StorageIcon,
  Update as UpdateIcon,
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import pwaService from '../services/pwaService';
import { useNotifications } from '../contexts/NotificationContext';

interface PWAInstallProps {
  showInstallPrompt?: boolean;
  onInstall?: () => void;
}

const PWAInstall: React.FC<PWAInstallProps> = ({
  showInstallPrompt = true,
  onInstall,
}) => {
  const theme = useTheme();
  const { addNotification } = useNotifications();
  const [showDialog, setShowDialog] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [networkStatus, setNetworkStatus] = useState({ online: true, effectiveType: 'unknown' });
  const [cacheSize, setCacheSize] = useState(0);
  const [pwaFeatures, setPwaFeatures] = useState({
    serviceWorker: false,
    pushNotifications: false,
    backgroundSync: false,
    offlineSupport: false,
  });

  useEffect(() => {
    checkPWAStatus();
    setupEventListeners();
    updateNetworkStatus();
    updateCacheSize();

    const interval = setInterval(updateNetworkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkPWAStatus = async () => {
    // Check if app can be installed
    setCanInstall(pwaService.canInstall());
    
    // Check if app is already installed
    setIsInstalled(pwaService.isInstalled());

    // Check PWA features
    setPwaFeatures({
      serviceWorker: 'serviceWorker' in navigator,
      pushNotifications: 'Notification' in window && Notification.permission === 'granted',
      backgroundSync: 'serviceWorker' in navigator && 'sync' in (navigator.serviceWorker as any),
      offlineSupport: 'caches' in window,
    });
  };

  const setupEventListeners = () => {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
      setCanInstall(true);
      addNotification('AI-Dashmind can be installed!', 'info');
    });

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setCanInstall(false);
      addNotification('AI-Dashmind installed successfully!', 'success');
    });
  };

  const updateNetworkStatus = () => {
    setNetworkStatus(pwaService.getNetworkStatus());
  };

  const updateCacheSize = async () => {
    const size = await pwaService.getCacheSize();
    setCacheSize(size);
  };

  const handleInstall = async () => {
    try {
      const installed = await pwaService.installApp();
      if (installed) {
        addNotification('AI-Dashmind installed successfully!', 'success');
        setShowDialog(false);
      }
      onInstall?.();
    } catch (error) {
      addNotification('Installation failed', 'error');
    }
  };

  const handleCheckUpdates = async () => {
    try {
      await pwaService.checkForUpdates();
      addNotification('Checking for updates...', 'info');
    } catch (error) {
      addNotification('Update check failed', 'error');
    }
  };

  const handleClearCache = async () => {
    try {
      await pwaService.clearCache();
      await updateCacheSize();
      addNotification('Cache cleared successfully', 'success');
    } catch (error) {
      addNotification('Failed to clear cache', 'error');
    }
  };

  const handleSyncData = async () => {
    try {
      await pwaService.syncDashboardData();
      addNotification('Data sync initiated', 'info');
    } catch (error) {
      addNotification('Data sync failed', 'error');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFeatureStatus = (feature: boolean) => {
    return feature ? (
      <Chip icon={<CheckIcon />} label="Available" color="success" size="small" />
    ) : (
      <Chip icon={<ErrorIcon />} label="Not Available" color="error" size="small" />
    );
  };

  if (!showInstallPrompt && !canInstall && isInstalled) {
    return null;
  }

  return (
    <>
      {/* Install Button */}
      {canInstall && !isInstalled && (
        <Tooltip title="Install AI-Dashmind">
          <IconButton
            color="primary"
            onClick={() => setShowDialog(true)}
            sx={{
              position: 'fixed',
              bottom: 80,
              right: 24,
              zIndex: theme.zIndex.tooltip + 1,
              bgcolor: 'background.paper',
              boxShadow: theme.shadows[4],
              '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' },
            }}
          >
            <InstallIcon />
          </IconButton>
        </Tooltip>
      )}

      {/* PWA Status Dialog */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              AI-Dashmind PWA
            </Typography>
            <IconButton onClick={() => setShowDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Install AI-Dashmind
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Install AI-Dashmind as a native app for the best experience with offline support, 
              push notifications, and background sync.
            </Typography>
            
            <Button
              variant="contained"
              startIcon={<InstallIcon />}
              onClick={handleInstall}
              fullWidth
              sx={{ mb: 2 }}
            >
              Install App
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* PWA Features */}
          <Typography variant="h6" gutterBottom>
            PWA Features
          </Typography>
          
          <List dense>
            <ListItem>
              <ListItemIcon>
                <DownloadIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Offline Support" 
                secondary="Work without internet connection"
              />
              {getFeatureStatus(pwaFeatures.offlineSupport)}
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <NotificationIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Push Notifications" 
                secondary="Receive real-time updates"
              />
              {getFeatureStatus(pwaFeatures.pushNotifications)}
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <UpdateIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Background Sync" 
                secondary="Sync data when connection returns"
              />
              {getFeatureStatus(pwaFeatures.backgroundSync)}
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Service Worker" 
                secondary="Enhanced caching and performance"
              />
              {getFeatureStatus(pwaFeatures.serviceWorker)}
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          {/* Status Information */}
          <Typography variant="h6" gutterBottom>
            Status
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip
              icon={networkStatus.online ? <CheckIcon /> : <OfflineIcon />}
              label={networkStatus.online ? 'Online' : 'Offline'}
              color={networkStatus.online ? 'success' : 'error'}
              size="small"
            />
            <Chip
              label={`Cache: ${formatBytes(cacheSize)}`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`Version: ${pwaService.getVersion()}`}
              size="small"
              variant="outlined"
            />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              size="small"
              startIcon={<UpdateIcon />}
              onClick={handleCheckUpdates}
            >
              Check Updates
            </Button>
            <Button
              size="small"
              startIcon={<StorageIcon />}
              onClick={handleClearCache}
            >
              Clear Cache
            </Button>
            <Button
              size="small"
              startIcon={<DownloadIcon />}
              onClick={handleSyncData}
            >
              Sync Data
            </Button>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PWAInstall; 