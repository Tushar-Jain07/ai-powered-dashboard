import React, { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Typography,
  Tooltip,
  LinearProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  Collapse,
  Divider,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  ArrowUpward as ArrowUpwardIcon,
} from '@mui/icons-material';

interface WidgetProps {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  children: React.ReactNode;
  loading?: boolean;
  actions?: React.ReactNode;
  onRefresh?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  onSettings?: () => void;
  height?: number | string;
  width?: number | string;
  fullWidth?: boolean;
  className?: string;
  headerAction?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  variant?: 'default' | 'outlined' | 'elevation' | 'transparent';
  importance?: 'normal' | 'high' | 'low';
  lastUpdated?: string;
}

const Widget: React.FC<WidgetProps> = ({
  id,
  title,
  subtitle,
  description,
  children,
  loading = false,
  actions,
  onRefresh,
  onDownload,
  onDelete,
  onSettings,
  height,
  width,
  fullWidth = false,
  className = '',
  headerAction,
  collapsible = true,
  defaultCollapsed = false,
  variant = 'default',
  importance = 'normal',
  lastUpdated,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isExpanded, setIsExpanded] = useState(!defaultCollapsed);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleRefresh = () => {
    handleMenuClose();
    if (onRefresh) onRefresh();
  };
  
  const handleDownload = () => {
    handleMenuClose();
    if (onDownload) onDownload();
  };
  
  const handleDelete = () => {
    handleMenuClose();
    if (onDelete) onDelete();
  };
  
  const handleSettings = () => {
    handleMenuClose();
    if (onSettings) onSettings();
  };
  
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  const handleToggleInfo = () => {
    setShowInfo(!showInfo);
  };

  // Get styles based on importance
  const getImportanceStyles = () => {
    switch (importance) {
      case 'high':
        return {
          boxShadow: theme.palette.mode === 'dark' 
            ? `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}`
            : `0 0 15px ${alpha(theme.palette.primary.main, 0.3)}`,
          borderLeft: `4px solid ${theme.palette.primary.main}`,
        };
      case 'low':
        return {
          opacity: 0.9,
        };
      default:
        return {};
    }
  };

  // Get card variant style
  const getCardStyle = () => {
    switch (variant) {
      case 'outlined':
        return {
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
        };
      case 'elevation':
        return {
          boxShadow: theme.shadows[3],
        };
      case 'transparent':
        return {
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(10px)',
        };
      default:
        return {};
    }
  };
  
  return (
    <Card
      sx={{
        height: isFullscreen ? '100vh' : height || 'auto',
        width: isFullscreen ? '100vw' : fullWidth ? '100%' : width || 'auto',
        display: 'flex',
        flexDirection: 'column',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        right: isFullscreen ? 0 : 'auto',
        bottom: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 1300 : 'auto',
        transition: theme.transitions.create(['box-shadow', 'transform', 'opacity'], {
          duration: theme.transitions.duration.standard,
        }),
        overflow: 'hidden',
        '&:hover': {
          boxShadow: theme.shadows[5],
          transform: isFullscreen ? 'none' : 'translateY(-3px)',
        },
        ...getCardStyle(),
        ...getImportanceStyles(),
      }}
      className={`widget ${className}`}
      data-widget-id={id}
      elevation={variant === 'default' ? 2 : 0}
      aria-label={title}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isFavorite && (
              <Box component="span" sx={{ mr: 1, color: 'warning.main', display: 'flex', alignItems: 'center' }}>
                <StarIcon fontSize="small" />
              </Box>
            )}
            <Typography variant="h6" component="h3" sx={{ 
              fontWeight: 500, 
              fontSize: { xs: '1rem', sm: '1.125rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {title}
            </Typography>
          </Box>
        }
        subheader={
          subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ 
              fontSize: '0.875rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {subtitle}
            </Typography>
          )
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {headerAction}
            
            {collapsible && (
              <Tooltip title={isExpanded ? 'Collapse' : 'Expand'}>
                <IconButton
                  size="small"
                  onClick={handleToggleExpand}
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? 'Collapse widget' : 'Expand widget'}
                >
                  {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            )}
            
            <Tooltip title={isFavorite ? 'Remove favorite' : 'Mark as favorite'}>
              <IconButton
                size="small"
                onClick={handleToggleFavorite}
                color={isFavorite ? 'warning' : 'default'}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                aria-pressed={isFavorite}
              >
                {isFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Widget options">
              <IconButton
                size="small"
                aria-label="Widget options"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                aria-controls={Boolean(anchorEl) ? 'widget-menu' : undefined}
                aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Menu
              id="widget-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  minWidth: 200,
                  maxWidth: '100%',
                }
              }}
            >
              {onRefresh && (
                <MenuItem onClick={handleRefresh}>
                  <ListItemIcon>
                    <RefreshIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Refresh" />
                </MenuItem>
              )}
              
              {onDownload && (
                <MenuItem onClick={handleDownload}>
                  <ListItemIcon>
                    <DownloadIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Download" />
                </MenuItem>
              )}
              
              <MenuItem onClick={handleToggleFullscreen}>
                <ListItemIcon>
                  {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
                </ListItemIcon>
                <ListItemText primary={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} />
              </MenuItem>
              
              <MenuItem onClick={handleToggleInfo}>
                <ListItemIcon>
                  <InfoIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Widget Info" />
              </MenuItem>
              
              {onSettings && (
                <MenuItem onClick={handleSettings}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </MenuItem>
              )}
              
              {onDelete && (
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Remove Widget" />
                </MenuItem>
              )}
            </Menu>
          </Box>
        }
        sx={{
          p: { xs: 1.5, sm: 2 },
          bgcolor: theme => variant === 'transparent' 
            ? 'transparent' 
            : alpha(theme.palette.background.paper, 0.6),
          borderBottom: theme => `1px solid ${theme.palette.divider}`,
        }}
      />
      
      {loading && (
        <LinearProgress 
          sx={{ 
            height: 2, 
            borderRadius: 0,
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
          }} 
          aria-label="Loading widget content" 
        />
      )}

      <Collapse in={showInfo} timeout="auto">
        <Box sx={{ p: 2, backgroundColor: alpha(theme.palette.background.default, 0.5) }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Widget ID:</strong> {id}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Description:</strong> {description}
            </Typography>
          )}
          {lastUpdated && (
            <Typography variant="body2" color="text.secondary">
              <strong>Last Updated:</strong> {lastUpdated}
            </Typography>
          )}
        </Box>
        <Divider />
      </Collapse>
      
      <Collapse in={isExpanded} timeout="auto" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CardContent 
          sx={{ 
            p: { xs: 0, sm: 0 },
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            '&:last-child': { pb: 0 },
          }}
        >
          {children}
        </CardContent>
      </Collapse>
      
      {actions && (
        <Box sx={{ 
          p: 1, 
          display: 'flex', 
          justifyContent: 'flex-end',
          alignItems: 'center',
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.4),
        }}>
          {actions}
        </Box>
      )}
    </Card>
  );
};

export default Widget; 