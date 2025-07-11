import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  Button,
} from '@mui/material';
import {
  DarkMode as DarkIcon,
  LightMode as LightIcon,
  SettingsBrightness as AutoIcon,
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
        >
          <ThemeIconComponent fontSize={size} />
        </IconButton>
      </Tooltip>
    );
  }
  
  // Button variant with menu
  return (
    <Box>
      <Tooltip title="Change theme">
        <Button
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
          }}
        >
          {showLabel && (
            mode === 'system' ? 'Auto' : 
            mode === 'dark' ? 'Dark' : 'Light'
          )}
        </Button>
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