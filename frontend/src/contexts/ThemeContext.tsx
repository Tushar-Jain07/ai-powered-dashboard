import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, PaletteMode } from '@mui/material';
import { blue, purple, grey } from '@mui/material/colors';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  theme: any; // MUI theme object
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  themeColor: string;
  setThemeColor: (color: string) => void;
  isSystemPreferenceDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get stored preferences or default values
  const getInitialMode = (): ThemeMode => {
    const savedMode = localStorage.getItem('theme-preference');
    if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
      return savedMode as ThemeMode;
    }
    return 'system';
  };

  const getInitialColor = (): string => {
    const savedColor = localStorage.getItem('theme-color');
    if (savedColor) {
      return savedColor;
    }
    return blue[500]; // Default theme color
  };

  const [mode, setMode] = useState<ThemeMode>(getInitialMode());
  const [themeColor, setThemeColor] = useState<string>(getInitialColor());
  const [isSystemPreferenceDark, setIsSystemPreferenceDark] = useState<boolean>(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsSystemPreferenceDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Calculate effective mode
  const effectiveMode = useMemo((): PaletteMode => {
    if (mode === 'system') {
      return isSystemPreferenceDark ? 'dark' : 'light';
    }
    return mode as PaletteMode;
  }, [mode, isSystemPreferenceDark]);

  // Build the theme
  const theme = useMemo(() => {
    const themeObj = createTheme({
      palette: {
        mode: effectiveMode,
        primary: {
          main: themeColor,
          ...(effectiveMode === 'dark' ? {
            light: purple[300],
          } : {
            light: blue[300],
          }),
        },
        secondary: {
          main: purple[500],
        },
        background: {
          default: effectiveMode === 'dark' ? '#121212' : '#f7f8fc',
          paper: effectiveMode === 'dark' ? '#1e1e2d' : '#ffffff',
        },
        text: {
          primary: effectiveMode === 'dark' ? '#f1f1f1' : '#2b3445',
          secondary: effectiveMode === 'dark' ? '#aeb4be' : '#626e84',
        },
        divider: effectiveMode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
        grey: {
          ...grey,
          ...(effectiveMode === 'dark' ? {
            A100: '#292929',
            A200: '#303030',
            A400: '#383838',
            A700: '#424242',
          } : {
            A100: '#f5f5f5',
            A200: '#eeeeee',
            A400: '#e0e0e0',
            A700: '#bdbdbd',
          }),
        },
      },
      typography: {
        fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        h1: {
          fontWeight: 600,
        },
        h2: {
          fontWeight: 600,
        },
        h3: {
          fontWeight: 600,
        },
        h4: {
          fontWeight: 600,
        },
        h5: {
          fontWeight: 600,
        },
        h6: {
          fontWeight: 600,
        },
        subtitle1: {
          fontSize: '1.125rem',
        },
      },
      shape: {
        borderRadius: 10,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: 8,
              fontWeight: 500,
              boxShadow: 'none',
              padding: '6px 16px',
              '&:hover': {
                boxShadow: effectiveMode === 'dark' ? '0 4px 12px 0 rgba(0,0,0,0.3)' : '0 4px 12px 0 rgba(0,0,0,0.1)',
              },
            },
            containedPrimary: {
              '&:hover': {
                backgroundColor: effectiveMode === 'dark' ? purple[400] : blue[600],
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              backgroundImage: 'none',
              boxShadow: effectiveMode === 'dark' 
                ? '0px 3px 14px 1px rgba(0, 0, 0, 0.25)' 
                : '0px 3px 14px 1px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease-in-out',
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              boxShadow: effectiveMode === 'dark' 
                ? '0 4px 20px 0 rgba(0, 0, 0, 0.4)' 
                : '0 4px 20px 0 rgba(0, 0, 0, 0.08)',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              borderBottom: effectiveMode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.08)'
                : '1px solid rgba(0, 0, 0, 0.08)',
            },
          },
        },
        MuiMenuItem: {
          styleOverrides: {
            root: {
              '&:hover': {
                backgroundColor: effectiveMode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.08)' 
                  : 'rgba(0, 0, 0, 0.04)',
              },
              '&.Mui-selected': {
                backgroundColor: effectiveMode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.16)' 
                  : 'rgba(0, 0, 0, 0.08)',
                '&:hover': {
                  backgroundColor: effectiveMode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.22)' 
                    : 'rgba(0, 0, 0, 0.12)',
                }
              }
            }
          }
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              '&.Mui-selected': {
                color: effectiveMode === 'dark' ? blue[300] : blue[700],
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: effectiveMode === 'dark' ? blue[400] : blue[300],
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: blue[500],
              },
              '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                borderColor: '#f44336',
              },
            },
          },
        },
        MuiSwitch: {
          styleOverrides: {
            root: {
              width: 42,
              height: 26,
              padding: 0,
              '& .MuiSwitch-switchBase': {
                padding: 1,
                margin: 2,
                transitionDuration: '300ms',
                '&.Mui-checked': {
                  transform: 'translateX(16px)',
                  color: '#fff',
                  '& + .MuiSwitch-track': {
                    opacity: 1,
                    border: 0,
                  },
                  '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 0.5,
                  },
                },
                '&.Mui-focusVisible .MuiSwitch-thumb': {
                  border: '6px solid #fff',
                },
                '&.Mui-disabled .MuiSwitch-thumb': {
                  color: effectiveMode === 'dark' ? 'rgb(100,100,100)' : 'rgb(255,255,255)',
                },
              },
              '& .MuiSwitch-thumb': {
                boxSizing: 'border-box',
                width: 22,
                height: 22,
              },
              '& .MuiSwitch-track': {
                borderRadius: 26 / 2,
                border: `1px solid ${effectiveMode === 'dark' ? 'rgb(55,55,55)' : 'rgb(200,200,200)'}`,
                opacity: 1,
              },
            },
          },
        },
      },
    });
    return themeObj;
  }, [effectiveMode, themeColor]);

  // Set theme mode
  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem('theme-preference', newMode);
  };

  // Toggle between light and dark modes
  const toggleTheme = () => {
    const newMode = effectiveMode === 'dark' ? 'light' : 'dark';
    setTheme(newMode);
  };

  // Update theme color
  const handleSetThemeColor = (color: string) => {
    setThemeColor(color);
    localStorage.setItem('theme-color', color);
  };

  const value = {
    mode,
    theme,
    setTheme,
    toggleTheme,
    isDarkMode: effectiveMode === 'dark',
    themeColor,
    setThemeColor: handleSetThemeColor,
    isSystemPreferenceDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 