import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Button,
  Menu,
  MenuItem,
  Collapse,
  Badge,
  Tooltip,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  DataArray as DataSourcesIcon,
  BarChart as ReportsIcon,
  PsychologyAlt as MLModelsIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Notifications as NotificationsIcon,
  PersonOutlined as ProfileIcon,
  Logout as LogoutIcon,
  QuestionMark as HelpIcon,
  Info as InfoIcon,
  KeyboardArrowDown as ArrowDownIcon,
  WifiOff as OfflineIcon,
  Wifi as OnlineIcon,
} from '@mui/icons-material';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import ChatAssistant from './ChatAssistant';
import pwaService from '../services/pwaService';

const drawerWidth = 260;

interface NavigationItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  children?: NavigationItem[];
}

// Extended interfaces for User and Notification
interface ExtendedUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface ExtendedNotification {
  id: string;
  message: string;
  type: string;
  title: string;
  time: string;
}

const navigationItems: NavigationItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <DashboardIcon />,
  },
  {
    title: 'Data Sources',
    path: '/data-sources',
    icon: <DataSourcesIcon />,
    children: [
      {
        title: 'Database',
        path: '/data-sources/database',
        icon: <DataSourcesIcon />,
      },
      {
        title: 'API',
        path: '/data-sources/api',
        icon: <DataSourcesIcon />,
      },
      {
        title: 'File Upload',
        path: '/data-sources/file',
        icon: <DataSourcesIcon />,
      },
    ],
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: <ReportsIcon />,
  },
  {
    title: 'ML Models',
    path: '/ml-models',
    icon: <MLModelsIcon />,
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <SettingsIcon />,
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  const [drawerOpen, setDrawerOpen] = useState(isDesktop);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [networkStatus, setNetworkStatus] = useState({ online: true, effectiveType: 'unknown' });

  // Adjust drawer state based on screen size
  useEffect(() => {
    setDrawerOpen(isDesktop);
  }, [isDesktop]);

  // Update network status
  useEffect(() => {
    const updateNetworkStatus = () => {
      setNetworkStatus(pwaService.getNetworkStatus());
    };

    updateNetworkStatus();
    const interval = setInterval(updateNetworkStatus, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  // Close drawer on mobile when clicking a link
  const handleMobileNavigation = () => {
    if (!isDesktop) {
      setDrawerOpen(false);
    }
  };
  
  const handleExpandItem = (title: string) => {
    setExpandedItems({
      ...expandedItems,
      [title]: !expandedItems[title],
    });
  };
  
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };
  
  const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };
  
  const handleCloseNotifications = () => {
    setNotificationsAnchor(null);
  };
  
  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      logout();
      setLoading(false);
    }, 500);
  };
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  const renderNavigationItems = (items: NavigationItem[], level = 0) => {
    return items.map((item) => {
      const isItemActive = isActive(item.path);
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedItems[item.title] || false;
      
      return (
        <React.Fragment key={item.title}>
          <ListItem 
            disablePadding
            sx={{ display: 'block', mb: 0.5 }}
          >
            <ListItemButton
              component={hasChildren ? 'div' : Link}
              to={hasChildren ? undefined : item.path}
              onClick={hasChildren ? () => handleExpandItem(item.title) : handleMobileNavigation}
              selected={isItemActive}
              sx={{
                minHeight: 48,
                justifyContent: drawerOpen ? 'initial' : 'center',
                pl: level * 2 + 2,
                borderRadius: '8px',
                mx: 1,
                '&.Mui-selected': {
                  backgroundColor: theme => theme.palette.primary.main + '20',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '25%',
                    height: '50%',
                    width: 4,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '0 2px 2px 0',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: drawerOpen ? 2 : 'auto',
                  justifyContent: 'center',
                  color: isItemActive ? 'primary.main' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {drawerOpen && (
                <ListItemText 
                  primary={item.title}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: isItemActive ? 600 : 400,
                      color: isItemActive ? 'primary.main' : 'inherit',
                    },
                  }}
                />
              )}
              {hasChildren && drawerOpen && (
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => handleExpandItem(item.title)}
                >
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              )}
            </ListItemButton>
          </ListItem>
          {hasChildren && (
            <Collapse in={isExpanded && drawerOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderNavigationItems(item.children || [], level + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {loading && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }} />}
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: drawerOpen ? `${drawerWidth}px` : 0 },
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" noWrap component="div">
              AI-Powered Dashboard
            </Typography>
            
            {/* App bar navigation for desktop */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 4 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.title}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  sx={{
                    mx: 1,
                    fontWeight: isActive(item.path) ? 600 : 400,
                    opacity: isActive(item.path) ? 1 : 0.8,
                  }}
                  startIcon={item.icon}
                >
                  {item.title}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Right side tools */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Network Status */}
            <Tooltip title={networkStatus.online ? 'Online' : 'Offline'}>
              <IconButton color="inherit" size="small">
                {networkStatus.online ? <OnlineIcon /> : <OfflineIcon />}
              </IconButton>
            </Tooltip>
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton 
                color="inherit" 
                onClick={handleOpenNotifications}
                size="large"
              >
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Menu
              anchorEl={notificationsAnchor}
              open={Boolean(notificationsAnchor)}
              onClose={handleCloseNotifications}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              sx={{ mt: 1 }}
              PaperProps={{
                sx: { width: 320, maxHeight: 400 }
              }}
            >
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">Notifications</Typography>
              </Box>
              
              {notifications.length === 0 ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No new notifications
                  </Typography>
                </Box>
              ) : (
                notifications.map((notification, index) => (
                  <MenuItem key={index} onClick={handleCloseNotifications}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <Typography variant="subtitle2">
                        {notification.title || 'Notification'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        {notification.time || new Date().toLocaleString()}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
              
              <Box sx={{ p: 1.5, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
                <Button size="small">View All</Button>
              </Box>
            </Menu>
            
            {/* User Menu */}
            <Button
              onClick={handleOpenUserMenu}
              color="inherit"
              sx={{ ml: 2 }}
              endIcon={<ArrowDownIcon />}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  mr: 1,
                  bgcolor: 'primary.main',
                }}
                alt={user?.name || 'User'}
                src={user?.avatar || undefined}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : <AccountIcon />}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" component="span">
                  {user?.name || 'User'}
                </Typography>
              </Box>
            </Button>
            
            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleCloseUserMenu}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              sx={{ mt: 1 }}
            >
              <MenuItem component={Link} to="/profile" onClick={handleCloseUserMenu}>
                <ListItemIcon>
                  <ProfileIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem component={Link} to="/settings" onClick={handleCloseUserMenu}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { handleCloseUserMenu(); handleLogout(); }}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Drawer
        variant={isDesktop ? "permanent" : "temporary"}
        open={drawerOpen}
        onClose={isDesktop ? undefined : handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          px: [1],
        }}>
          <Typography variant="h6" noWrap component="div" sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <Box
              component="img"
              src="/logo192.png"
              alt="Logo"
              sx={{ height: 32, width: 32, mr: 1 }}
            />
            Dashboard
          </Typography>
          <IconButton onClick={handleDrawerToggle} sx={{ display: { md: 'none' } }}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        
        <Divider />
        
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>{renderNavigationItems(navigationItems)}</List>
        </Box>
        
        <Box sx={{ position: 'sticky', bottom: 0, bgcolor: 'background.paper', p: 2 }}>
          <ChatAssistant />
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar /> {/* Spacer for fixed app bar */}
        <Box sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 