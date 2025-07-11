import React, { useState, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@mui/icons-material';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './DraggableDashboard.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export interface DraggableDashboardProps {
  widgets: {
    id: string;
    title: string;
    description?: string;
    component: React.ReactNode;
    defaultSize: [number, number];
  }[];
  showFullscreen?: boolean;
  onSaveLayout?: (layout: any) => void;
  title?: string;
  subtitle?: string;
}

const DraggableDashboard: React.FC<DraggableDashboardProps> = ({
  widgets,
  showFullscreen = false,
  onSaveLayout,
  title = 'Dashboard',
  subtitle = 'Drag and resize widgets to customize your view',
}) => {
  const theme = useTheme();
  const [layouts, setLayouts] = useState(() => {
    const defaultLayout = widgets.map((widget, index) => ({
      i: widget.id,
      x: (index * 3) % 12,
      y: Math.floor(index / 4),
      w: widget.defaultSize[0],
      h: widget.defaultSize[1],
      minW: 2,
      minH: 2,
    }));
    
    return {
      lg: defaultLayout,
      md: defaultLayout,
      sm: defaultLayout,
      xs: defaultLayout,
    };
  });

  const [isFullscreen, setIsFullscreen] = useState(showFullscreen);
  const [isEditing, setIsEditing] = useState(false);

  const handleLayoutChange = useCallback((currentLayout: any, allLayouts: any) => {
    setLayouts(allLayouts);
  }, []);

  const handleSaveLayout = useCallback(() => {
    if (onSaveLayout) {
      onSaveLayout(layouts);
    }
  }, [layouts, onSaveLayout]);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const handleToggleEdit = useCallback(() => {
    setIsEditing(!isEditing);
  }, [isEditing]);

  return (
    <Box
      sx={{
        height: isFullscreen ? '100vh' : 'auto',
        width: '100%',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        right: isFullscreen ? 0 : 'auto',
        bottom: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 1300 : 'auto',
        backgroundColor: theme.palette.background.default,
        overflow: 'auto',
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
          alignItems: 'center',
          backgroundColor: theme.palette.background.paper,
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}
      >
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={isEditing ? 'Exit edit mode' : 'Edit layout'}>
            <IconButton
              onClick={handleToggleEdit}
              color={isEditing ? 'primary' : 'default'}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          
          {onSaveLayout && (
            <Tooltip title="Save layout">
              <IconButton
                onClick={handleSaveLayout}
              >
                <SaveIcon />
              </IconButton>
            </Tooltip>
          )}
          
          <Tooltip title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            <IconButton
              onClick={handleToggleFullscreen}
            >
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Grid Layout */}
      <Box sx={{ p: 2 }}>
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
          rowHeight={100}
          onLayoutChange={handleLayoutChange}
          isDraggable={isEditing}
          isResizable={isEditing}
          margin={[16, 16]}
          containerPadding={[0, 0]}
          useCSSTransforms={true}
          preventCollision={false}
          compactType="vertical"
          style={{
            minHeight: 'calc(100vh - 200px)',
          }}
        >
          {widgets.map((widget) => (
            <Box
              key={widget.id}
              sx={{
                height: '100%',
                width: '100%',
              }}
            >
              {widget.component}
            </Box>
          ))}
        </ResponsiveGridLayout>
      </Box>
    </Box>
  );
};

export default DraggableDashboard; 