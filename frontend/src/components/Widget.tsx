import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
} from '@mui/icons-material';

export interface WidgetProps {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  children: React.ReactNode;
  loading?: boolean;
  onRefresh?: () => void;
  onDownload?: () => void;
  onSettings?: () => void;
  onFullscreen?: () => void;
  height?: number | string;
}

const Widget: React.FC<WidgetProps> = ({
  id,
  title,
  subtitle,
  description,
  children,
  loading = false,
  onRefresh,
  onDownload,
  onSettings,
  onFullscreen,
  height = 'auto',
}) => {
  return (
    <Card
      sx={{
        height,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="h3" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {subtitle}
            </Typography>
          )}
          {description && (
            <Typography variant="caption" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>
        
        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {onRefresh && (
            <Tooltip title="Refresh">
              <IconButton
                size="small"
                onClick={onRefresh}
                disabled={loading}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {onDownload && (
            <Tooltip title="Download">
              <IconButton
                size="small"
                onClick={onDownload}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {onSettings && (
            <Tooltip title="Settings">
              <IconButton
                size="small"
                onClick={onSettings}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {onFullscreen && (
            <Tooltip title="Fullscreen">
              <IconButton
                size="small"
                onClick={onFullscreen}
              >
                <FullscreenIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      
      {/* Loading indicator */}
      {loading && (
        <LinearProgress 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0,
            zIndex: 1,
          }} 
        />
      )}
      
      {/* Content */}
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <Box sx={{ height: '100%' }}>
          {children}
        </Box>
      </Box>
    </Card>
  );
};

export default Widget; 