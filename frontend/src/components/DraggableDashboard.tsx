import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './DraggableDashboard.css';
import { 
  Box, 
  Typography, 
  IconButton, 
  Tooltip, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Paper
} from '@mui/material';
import {
  Save as SaveIcon,
  Undo as UndoIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  ViewModule as ViewModuleIcon,
  ViewStream as ViewStreamIcon,
} from '@mui/icons-material';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Define widget types
interface WidgetDefinition {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  defaultSize: [number, number]; // w, h
}

// Layout configuration for a widget
export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  static?: boolean;
}

interface DraggableDashboardProps {
  widgets: WidgetDefinition[];
  defaultLayouts?: { [key: string]: LayoutItem[] };
  onLayoutChange?: (layout: { [key: string]: LayoutItem[] }) => void;
  onResetLayout?: () => void;
  onSaveLayout?: (layout: { [key: string]: LayoutItem[] }) => void;
  title?: string;
  subtitle?: string;
}

const DraggableDashboard: React.FC<DraggableDashboardProps> = ({
  widgets,
  defaultLayouts,
  onLayoutChange,
  onResetLayout,
  onSaveLayout,
  title = 'Customizable Dashboard',
  subtitle = 'Drag and resize widgets to customize your view',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Define breakpoint configuration
  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

  // Generate default layout if not provided
  const generateDefaultLayout = () => {
    let defaultLayout: LayoutItem[] = [];
    let y = 0;
    
    widgets.forEach((widget, i) => {
      const [w, h] = widget.defaultSize;
      defaultLayout.push({
        i: widget.id,
        x: 0,
        y: y,
        w: Math.min(w, cols.lg), // Ensure width is not greater than cols
        h,
        minW: 2,
        minH: 2,
      });
      y += h; // Stack widgets vertically
    });

    return { lg: defaultLayout, md: defaultLayout, sm: defaultLayout, xs: defaultLayout, xxs: defaultLayout };
  };

  // State
  const [layouts, setLayouts] = useState(defaultLayouts || generateDefaultLayout());
  const [locked, setLocked] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');

  // Handle layout change
  const handleLayoutChange = (currentLayout: any, allLayouts: any) => {
    setLayouts(allLayouts);
    if (onLayoutChange) {
      onLayoutChange(allLayouts);
    }
  };

  // Handle save layout
  const handleSaveLayout = () => {
    if (onSaveLayout) {
      onSaveLayout(layouts);
    }
    // Save to localStorage as a backup
    localStorage.setItem('dashboardLayout', JSON.stringify(layouts));
    showMessage('Layout saved successfully', 'success');
  };

  // Handle reset layout
  const handleResetLayout = () => {
    const newLayouts = generateDefaultLayout();
    setLayouts(newLayouts);
    if (onResetLayout) {
      onResetLayout();
    }
    localStorage.removeItem('dashboardLayout');
    showMessage('Layout reset to default', 'info');
  };

  // Show snackbar message
  const showMessage = (message: string, severity: 'success' | 'info' | 'warning' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setShowSnackbar(true);
  };

  // Toggle lock/unlock
  const toggleLock = () => {
    setLocked(!locked);
    showMessage(locked ? 'Widgets unlocked' : 'Widgets locked', 'info');
  };

  // Toggle compact mode
  const toggleCompact = () => {
    setIsCompact(!isCompact);
    showMessage(isCompact ? 'Standard view enabled' : 'Compact view enabled', 'info');
  };

  // Load layout from localStorage on mount
  useEffect(() => {
    const savedLayout = localStorage.getItem('dashboardLayout');
    if (savedLayout) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        setLayouts(parsedLayout);
      } catch (e) {
        console.error('Error parsing saved layout:', e);
      }
    }
  }, []);

  return (
    <Box sx={{ 
      width: '100%',
      overflow: 'hidden',
      p: 0,
    }}>
      {/* Dashboard Controls */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 2,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
          borderRadius: 2,
          background: theme => theme.palette.mode === 'dark' 
            ? 'linear-gradient(45deg, rgba(66,66,74,1) 0%, rgba(28,28,35,1) 100%)'
            : 'linear-gradient(45deg, rgba(250,250,252,1) 0%, rgba(245,245,245,1) 100%)',
          boxShadow: theme => theme.palette.mode === 'dark'
            ? '0 8px 16px rgba(0,0,0,0.4)'
            : '0 8px 16px rgba(0,0,0,0.1)',
        }}
      >
        <Box>
          <Typography variant="h5" component="h2" fontWeight="500">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          width: { xs: '100%', md: 'auto' } 
        }}>
          <Tooltip title={locked ? "Unlock widgets" : "Lock widgets"}>
            <Button
              variant="outlined"
              size="small"
              startIcon={locked ? <LockIcon /> : <LockOpenIcon />}
              onClick={toggleLock}
              color={locked ? "primary" : "inherit"}
              aria-label={locked ? "Unlock widgets" : "Lock widgets"}
            >
              {locked ? "Locked" : "Unlocked"}
            </Button>
          </Tooltip>

          <Tooltip title={isCompact ? "Standard view" : "Compact view"}>
            <Button
              variant="outlined"
              size="small"
              startIcon={isCompact ? <ViewModuleIcon /> : <ViewStreamIcon />}
              onClick={toggleCompact}
              aria-label={isCompact ? "Switch to standard view" : "Switch to compact view"}
            >
              {isCompact ? "Standard" : "Compact"}
            </Button>
          </Tooltip>

          <Tooltip title="Save layout">
            <Button
              variant="outlined"
              size="small"
              startIcon={<SaveIcon />}
              onClick={handleSaveLayout}
              aria-label="Save current layout"
            >
              Save
            </Button>
          </Tooltip>

          <Tooltip title="Reset layout">
            <Button
              variant="outlined"
              size="small"
              startIcon={<UndoIcon />}
              onClick={handleResetLayout}
              aria-label="Reset to default layout"
            >
              Reset
            </Button>
          </Tooltip>
        </Box>
      </Paper>

      {/* Responsive Grid Layout */}
      <Box sx={{ position: 'relative', width: '100%' }}>
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={breakpoints}
          cols={cols}
          rowHeight={isMobile ? 70 : isTablet ? 100 : 120}
          containerPadding={[0, 0]}
          margin={[16, 16]}
          isDraggable={!locked}
          isResizable={!locked}
          onLayoutChange={handleLayoutChange}
          useCSSTransforms={true}
          compactType={isCompact ? 'vertical' : null}
          preventCollision={!isCompact}
          isBounded
        >
          {widgets.map(widget => (
            <Box 
              key={widget.id} 
              sx={{ 
                overflow: 'hidden',
                borderRadius: 2,
                boxShadow: theme => theme.shadows[2],
                transition: 'box-shadow 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: theme => theme.shadows[5],
                },
                border: '1px solid',
                borderColor: 'divider',
                animation: 'fadeIn 0.5s ease-out forwards',
                '@keyframes fadeIn': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(10px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
              className="widget-container"
              aria-label={widget.title}
            >
              {widget.component}
            </Box>
          ))}
        </ResponsiveGridLayout>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity={snackbarSeverity}
          variant="filled"
          elevation={6}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DraggableDashboard; 