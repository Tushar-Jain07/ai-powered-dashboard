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
} from '@mui/icons-material';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import ChatAssistant from './ChatAssistant';

const drawerWidth = 260;

interface NavigationItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  children?: NavigationItem[];
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

  // Adjust drawer state based on screen size
  useEffect(() => {
    setDrawerOpen(isDesktop);
  }, [isDesktop]);
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
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
      
      return (
        <React.Fragment key={item.title}>
          <ListItem 
            disablePadding
            sx={{ display: 'block', mb: 0.5 }}
          >
            <ListItemButton
              component={hasChildren ? 'div' : Link}
              to={hasChildren ? undefined : item.path}
              onClick={hasChildren ? () => handleExpandItem(item.title) : undefined}
              selected={isItemActive}
              sx={{
                minHeight: 48,
                justifyContent: drawerOpen ? 'initial' : 'center',
                pl: level * 2 + 2,
                borderRadius: '8px',
                mx: 1,
                transition: theme.transitions.create(['background-color', 'box-shadow'], {
                  duration: theme.transitions.duration.standard,
                }),
                '&.Mui-selected': {
                  backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '25%',
                    height: '50%',
                    width: 3,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '0 4px 4px 0',
                  },
                  '&:hover': {
                    backgroundColor: theme => alpha(theme.palette.primary.main, 0.2),
                  }
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: drawerOpen ? 2 : 'auto',
                  justifyContent: 'center',
                  color: isItemActive ? 'primary.main' : 'inherit',
                  transition: theme.transitions.create('color', {
                    duration: theme.transitions.duration.standard,
                  }),
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.title} 
                sx={{ 
                  opacity: drawerOpen ? 1 : 0,
                  transition: theme.transitions.create('opacity', {
                    duration: theme.transitions.duration.standard,
                  }),
                  '& .MuiTypography-root': {
                    fontWeight: isItemActive ? 500 : 400,
                    fontSize: '0.9rem',
                  }
                }}
              />
              {hasChildren && drawerOpen && (
                <Box component="span" sx={{ ml: 'auto' }}>
                  {expandedItems[item.title] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
              )}
            </ListItemButton>
          </ListItem>
          
          {hasChildren && (
            <Collapse 
              in={drawerOpen && expandedItems[item.title]} 
              timeout="auto" 
              unmountOnExit
            >
              <List component="div" disablePadding>
                {renderNavigationItems(item.children || [], level + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  const drawer = (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%' 
    }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: drawerOpen ? 'space-between' : 'center',
          p: theme.spacing(drawerOpen ? 2 : 1),
        }}
      >
        {drawerOpen && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src="/logo192.png"
              alt="Logo"
              sx={{ 
                height: 32, 
                width: 32,
                mr: 1,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'rotate(10deg)',
                },
              }}
            />
            <Typography 
              variant="h6" 
              component="div"
              sx={{
                fontSize: '1.2rem',
                fontWeight: 600,
                background: theme => 
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #6b8aff, #c477ff)'
                    : 'linear-gradient(45deg, #3f51b5, #7e57c2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              AI Dashboard
            </Typography>
          </Box>
        )}
        {!isDesktop && (
          <IconButton onClick={handleDrawerToggle} size="small" color="primary">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      
      <Divider sx={{ mb: 1 }} />
      
      <Box 
        sx={{ 
          flexGrow: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '3px',
          },
          '&:hover::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(0, 0, 0, 0.3)',
          }
        }}
      >
        <List sx={{ px: 1 }}>
          {renderNavigationItems(navigationItems)}
        </List>
      </Box>
      
      {drawerOpen && (
        <Box 
          sx={{ 
            p: 2, 
            display: 'flex',
            flexDirection: 'column',
            borderTop: 1, 
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ThemeToggle variant="button" showLabel position="settings" size="small" />
          </Box>
          
          <Button 
            variant="text"
            startIcon={<HelpIcon />}
            size="small"
            color="inherit"
            sx={{ 
              justifyContent: 'flex-start',
              mb: 1,
              textTransform: 'none',
              fontWeight: 'normal',
            }}
          >
            Help Center
          </Button>
          
          <Button 
            variant="text"
            startIcon={<InfoIcon />}
            size="small"
            color="inherit"
            sx={{ 
              justifyContent: 'flex-start',
              textTransform: 'none',
              fontWeight: 'normal',
            }}
          >
            About
          </Button>
        </Box>
      )}
    </Box>
  );

  // Calculate content based on drawer state and screen size
  const contentMargin = drawerOpen && isDesktop ? `${drawerWidth}px` : 0;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {loading && (
        <LinearProgress 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: theme => theme.zIndex.drawer + 2 
          }} 
        />
      )}
    
      <AppBar 
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${contentMargin})` },
          ml: { md: contentMargin },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          backdropFilter: 'blur(8px)',
          backgroundColor: theme => 
            theme.palette.mode === 'dark' 
              ? 'rgba(18, 18, 18, 0.9)' 
              : 'rgba(255, 255, 255, 0.9)',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!isDesktop && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            {(!drawerOpen || !isDesktop) && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  component="img"
                  src="/logo192.png"
                  alt="Logo"
                  sx={{ height: 32, width: 32, mr: 1 }}
                />
                <Typography 
                  variant="h6" 
                  noWrap 
                  component="div"
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    background: theme => 
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(45deg, #6b8aff, #c477ff)'
                        : 'linear-gradient(45deg, #3f51b5, #7e57c2)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  AI Dashboard
                </Typography>
              </Box>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ThemeToggle />

            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                aria-label="notifications"
                onClick={handleOpenNotifications}
                sx={{ ml: 1 }}
              >
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Box sx={{ ml: 2 }}>
              <Button
                onClick={handleOpenUserMenu}
                color="inherit"
                startIcon={
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32,
                      bgcolor: 'primary.main',
                    }}
                  >
                    {(user as any)?.displayName?.charAt(0) || 'U'}
                  </Avatar>
                }
                endIcon={<ArrowDownIcon />}
                sx={{
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: theme => theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.05)',
                  }
                }}
              >
                <Box sx={{ textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="body2" component="span" fontWeight={500}>
                    {(user as any)?.displayName || 'User'}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    component="div" 
                    sx={{ 
                      opacity: 0.8,
                      fontSize: '0.7rem'
                    }}
                  >
                    {user?.email || 'user@example.com'}
                  </Typography>
                </Box>
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{
          width: { md: drawerOpen ? drawerWidth : 0 },
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <Drawer
          variant={isDesktop ? "permanent" : "temporary"}
          open={drawerOpen}
          onClose={isDesktop ? undefined : handleDrawerToggle}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              boxShadow: isDesktop ? 'none' : theme.shadows[3],
              border: isDesktop ? undefined : 'none',
            },
          }}
          PaperProps={{
            elevation: isDesktop ? 0 : 4,
            sx: {
              backgroundColor: theme => 
                theme.palette.mode === 'dark' ? 'background.default' : 'background.paper',
            }
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${contentMargin})` },
          ml: { md: 0 },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
          mt: '64px',
        }}
      >
        {children}
      </Box>

      {/* AI Chat Assistant Floating Button */}
      <ChatAssistant />

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleCloseUserMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          sx: { 
            minWidth: 200,
            mt: 1,
            '& .MuiMenuItem-root': {
              py: 1.5,
            }
          }
        }}
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
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleCloseNotifications}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 320 }
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={500}>
            Notifications
          </Typography>
        </Box>
        <Divider />
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <MenuItem 
              key={index} 
              onClick={handleCloseNotifications}
              sx={{
                py: 1.5,
                borderLeft: 4,
                borderLeftColor: 
                  notification.type === 'success' ? 'success.main' :
                  notification.type === 'error' ? 'error.main' :
                  notification.type === 'warning' ? 'warning.main' : 'info.main',
              }}
            >
              <ListItemText
                primary={notification.message}
                secondary={(notification as any).timestamp}
                primaryTypographyProps={{ 
                  variant: 'body2', 
                  fontWeight: 500
                }}
                secondaryTypographyProps={{ 
                  variant: 'caption',
                  sx: { display: 'block', mt: 0.5 } 
                }}
              />
            </MenuItem>
          ))
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No new notifications
            </Typography>
          </Box>
        )}
        <Divider />
        <MenuItem onClick={handleCloseNotifications} sx={{ justifyContent: 'center' }}>
          <Typography variant="body2" color="primary">
            View all notifications
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

// Helper function for theme alpha colors
const alpha = (color: string, value: number) => {
  return color.replace(/rgb\(|rgba\(/, '').replace(')', '').split(',').length === 3
    ? `rgba(${color.replace(/rgb\(|rgba\(/, '').replace(')', '')}, ${value})`
    : color;
};

export default Layout; 