import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Skeleton,
  Tooltip,
  IconButton,
  useTheme,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  loading?: boolean;
  info?: string;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | string;
  onClick?: () => void;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendLabel,
  loading = false,
  info,
  color = 'primary',
  onClick,
}) => {
  const theme = useTheme();

  // Determine trend color and icon
  let trendColor = theme.palette.grey[500];
  let TrendIcon = TrendingFlatIcon;
  
  if (trend !== undefined) {
    if (trend > 0) {
      trendColor = theme.palette.success.main;
      TrendIcon = TrendingUpIcon;
    } else if (trend < 0) {
      trendColor = theme.palette.error.main;
      TrendIcon = TrendingDownIcon;
    }
  }

  // Get color from theme if it's a theme color
  let mainColor = color;
  if (color === 'primary' || color === 'secondary' || color === 'success' || 
      color === 'error' || color === 'warning' || color === 'info') {
    mainColor = theme.palette[color].main;
  }

  return (
    <Card 
      sx={{ 
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ height: '100%', p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                {title}
              </Typography>
              {info && (
                <Tooltip title={info} arrow placement="top">
                  <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
                    <InfoOutlinedIcon fontSize="small" color="action" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
          {icon && (
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: `${mainColor}15`,
                color: mainColor,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
        
        {loading ? (
          <>
            <Skeleton variant="text" width="80%" height={40} />
            <Skeleton variant="text" width="60%" />
          </>
        ) : (
          <>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
              {value}
            </Typography>
            
            {(subtitle || trend !== undefined) && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {trend !== undefined && (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: trendColor,
                      mr: 1,
                    }}
                  >
                    <TrendIcon fontSize="small" />
                    <Typography variant="caption" sx={{ fontWeight: 'bold', ml: 0.5 }}>
                      {trend > 0 ? '+' : ''}{trend}%
                    </Typography>
                  </Box>
                )}
                
                {(subtitle || trendLabel) && (
                  <Typography variant="caption" color="text.secondary">
                    {trendLabel || subtitle}
                  </Typography>
                )}
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default KPICard; 