import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Box,
  Skeleton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

interface WidgetProps {
  id: string;
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onSettings?: () => void;
  onFullscreen?: () => void;
  onDownload?: () => void;
  height?: number | string;
  actions?: React.ReactNode;
}

const Widget: React.FC<WidgetProps> = ({
  id,
  title,
  children,
  loading = false,
  error = null,
  onRefresh,
  onSettings,
  onFullscreen,
  onDownload,
  height = 'auto',
  actions,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: () => void | undefined) => {
    if (action) {
      action();
    }
    handleMenuClose();
  };

  const hasActions = onRefresh || onSettings || onFullscreen || onDownload || actions;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={title}
        action={
          hasActions && (
            <Box>
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
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                aria-label="widget actions"
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {onSettings && (
                  <MenuItem onClick={() => handleAction(onSettings)}>
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Settings</ListItemText>
                  </MenuItem>
                )}
                {onFullscreen && (
                  <MenuItem onClick={() => handleAction(onFullscreen)}>
                    <ListItemIcon>
                      <FullscreenIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Fullscreen</ListItemText>
                  </MenuItem>
                )}
                {onDownload && (
                  <MenuItem onClick={() => handleAction(onDownload)}>
                    <ListItemIcon>
                      <DownloadIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Download</ListItemText>
                  </MenuItem>
                )}
                {actions}
              </Menu>
            </Box>
          )
        }
      />
      <CardContent sx={{ flexGrow: 1, p: 0, height }}>
        {loading ? (
          <Box sx={{ p: 2 }}>
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="text" sx={{ mt: 1 }} />
            <Skeleton variant="text" width="60%" />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2, textAlign: 'center', color: 'error.main' }}>
            {error}
          </Box>
        ) : (
          <Box sx={{ height: '100%' }}>
            {children}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Widget; 