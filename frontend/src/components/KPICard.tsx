import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as RemoveIcon,
  Info as InfoIcon,
  Fullscreen as FullscreenIcon,
} from '@mui/icons-material';

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
  onClick?: () => void;
  onInfo?: () => void;
  onFullscreen?: () => void;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon,
  description,
  trend = 'stable',
  color,
  onClick,
  onInfo,
  onFullscreen,
}) => {
  const theme = useTheme();

  const getChangeColor = () => {
    if (change > 0) return theme.palette.success.main;
    if (change < 0) return theme.palette.error.main;
    return theme.palette.warning.main;
  };

  const getChangeIcon = () => {
    if (change > 0) return <TrendingUpIcon />;
    if (change < 0) return <TrendingDownIcon />;
    return <RemoveIcon />;
  };

  const getChangeText = () => {
    const absChange = Math.abs(change);
    if (change > 0) return `+${absChange}%`;
    if (change < 0) return `-${absChange}%`;
    return `${absChange}%`;
  };

  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header with actions */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 2 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                bgcolor: color || theme.palette.primary.main,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
            {onInfo && (
              <Tooltip title="More information">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onInfo();
                  }}
                >
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          
          {onFullscreen && (
            <Tooltip title="Fullscreen view">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onFullscreen();
                }}
              >
                <FullscreenIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Title */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>

        {/* Value */}
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          {value}
        </Typography>

        {/* Change indicator */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            icon={getChangeIcon()}
            label={getChangeText()}
            size="small"
            sx={{
              bgcolor: getChangeColor(),
              color: 'white',
              fontWeight: 600,
              '& .MuiChip-icon': {
                color: 'white',
              },
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
          >
            vs last period
          </Typography>
        </Box>

        {/* Description */}
        {description && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mt: 1,
              display: 'block',
              lineHeight: 1.4,
            }}
          >
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default KPICard; 