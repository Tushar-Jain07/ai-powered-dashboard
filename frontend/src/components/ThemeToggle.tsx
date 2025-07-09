import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon,
  ListItemText,
  Switch,
  Typography,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  DarkMode as DarkIcon,
  LightMode as LightIcon,
  SettingsBrightness as AutoIcon,
  FormatPaint as ThemeIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';

interface ThemeToggleProps {
  showLabel?: boolean;
  variant?: 'icon' | 'button' | 'menu';
  size?: 'small' | 'medium' | 'large';
  position?: 'header' | 'settings' | 'toolbar';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  showLabel = false, 
  variant = 'icon',
  size = 'medium',
  position = 'header',
}) => {
  const { theme, setTheme, mode } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [rotationDeg, setRotationDeg] = useState(0);
  
  // Detect system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (mode === 'system') {
        // Trigger a re-render when system preference changes
        setTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode, setTheme]);
  
  // Get the actual mode based on system preference if needed
  const getEffectiveMode = () => {
    if (mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return mode;
  };
  
  const effectiveMode = getEffectiveMode();
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    handleMenuClose();
    
    // Add animation when theme changes
    setRotationDeg(prev => prev + 360);
    
    // Store preference in localStorage
    localStorage.setItem('theme-preference', newTheme);
  };
  
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 28;
      default:
        return 24;
    }
  };
  
  const iconSizePx = getIconSize();
  
  // Icon based on current theme
  const ThemeIconComponent = effectiveMode === 'dark' ? DarkIcon : LightIcon;
  
  // Simple icon toggle
  if (variant === 'icon') {
    return (
      <Tooltip 
        title={`Switch to ${effectiveMode === 'dark' ? 'light' : 'dark'} mode`} 
        arrow
      >
        <IconButton
          onClick={() => handleThemeChange(effectiveMode === 'dark' ? 'light' : 'dark')}
          color="inherit"
          aria-label="Toggle theme"
          size={size}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          sx={{
            transition: 'all 0.3s ease',
            transform: `rotate(${rotationDeg}deg)`,
            '&:hover': {
              background: theme => theme.palette.mode === 'dark' 
                ? 'rgba(255,255,255,0.1)' 
                : 'rgba(0,0,0,0.05)',
            }
          }}
        >
          <Box sx={{ 
            position: 'relative', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: iconSizePx,
            height: iconSizePx,
          }}>
            <Fade in={!isHovering} timeout={400}>
              <Box sx={{ position: 'absolute' }}>
                <ThemeIconComponent fontSize={size} />
              </Box>
            </Fade>
            <Fade in={isHovering} timeout={400}>
              <Box sx={{ position: 'absolute' }}>
                {effectiveMode === 'dark' ? (
                  <LightIcon fontSize={size} />
                ) : (
                  <DarkIcon fontSize={size} />
                )}
              </Box>
            </Fade>
          </Box>
        </IconButton>
      </Tooltip>
    );
  }
  
  // Button variant with menu
  return (
    <Box>
      <Tooltip title="Change theme">
        <IconButton
          onClick={handleMenuOpen}
          color="inherit"
          size={size}
          endIcon={<ArrowDownIcon />}
          startIcon={
            mode === 'system' ? <AutoIcon /> : 
            mode === 'dark' ? <DarkIcon /> : <LightIcon />
          }
          variant={position === 'settings' ? 'outlined' : 'text'}
          sx={{
            minWidth: position === 'settings' ? 120 : 'auto',
            '&:hover': {
              background: theme => theme.palette.mode === 'dark' 
                ? 'rgba(255,255,255,0.1)' 
                : 'rgba(0,0,0,0.05)',
            }
          }}
        >
          {showLabel && (
            mode === 'system' ? 'Auto' : 
            mode === 'dark' ? 'Dark' : 'Light'
          )}
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem 
          onClick={() => handleThemeChange('light')}
          selected={mode === 'light'}
          sx={{
            minWidth: 180,
            py: 1,
            transition: 'background-color 0.2s',
          }}
        >
          <ListItemIcon>
            <LightIcon />
          </ListItemIcon>
          <ListItemText>Light Mode</ListItemText>
        </MenuItem>
        
        <MenuItem 
          onClick={() => handleThemeChange('dark')}
          selected={mode === 'dark'}
          sx={{
            minWidth: 180,
            py: 1,
            transition: 'background-color 0.2s',
          }}
        >
          <ListItemIcon>
            <DarkIcon />
          </ListItemIcon>
          <ListItemText>Dark Mode</ListItemText>
        </MenuItem>
        
        <MenuItem 
          onClick={() => handleThemeChange('system')}
          selected={mode === 'system'}
          sx={{
            minWidth: 180,
            py: 1,
            transition: 'background-color 0.2s',
          }}
        >
          <ListItemIcon>
            <AutoIcon />
          </ListItemIcon>
          <ListItemText>
            <Box component="span" sx={{ display: 'flex', flexDirection: 'column' }}>
              System Preference
              <Typography variant="caption" color="text.secondary">
                {window.matchMedia('(prefers-color-scheme: dark)').matches 
                  ? 'Currently dark' 
                  : 'Currently light'}
              </Typography>
            </Box>
          </ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ThemeToggle; 