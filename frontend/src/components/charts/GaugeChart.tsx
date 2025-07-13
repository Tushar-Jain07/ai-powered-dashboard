import React from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
} from '@mui/material';

interface GaugeChartProps {
  value: number;
  maxValue: number;
  title?: string;
  subtitle?: string;
  size?: number;
  color?: string;
  showPercentage?: boolean;
  formatValue?: (value: number) => string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  maxValue,
  title = 'Gauge',
  subtitle,
  size = 200,
  color,
  showPercentage = true,
  formatValue,
}) => {
  const theme = useTheme();
  
  const percentage = Math.min((value / maxValue) * 100, 100);
  const angle = (percentage / 100) * 180; // 180 degrees for semi-circle
  
  const gaugeColor = color || theme.palette.primary.main;
  const backgroundColor = theme.palette.mode === 'dark' 
    ? theme.palette.grey[800] 
    : theme.palette.grey[200];

  const formatDisplayValue = (val: number) => {
    if (formatValue) return formatValue(val);
    return showPercentage ? `${Math.round(percentage)}%` : val.toString();
  };

  return (
    <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      <Box sx={{ position: 'relative', width: size, height: size / 2, mx: 'auto' }}>
        {/* Background arc */}
        <Box
          sx={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: '50%',
            border: `8px solid ${backgroundColor}`,
            borderBottom: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            transform: 'rotate(-90deg)',
          }}
        />
        
        {/* Value arc */}
        <Box
          sx={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: '50%',
            border: `8px solid ${gaugeColor}`,
            borderBottom: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            transform: `rotate(${angle - 90}deg)`,
            transition: 'transform 0.5s ease-in-out',
          }}
        />
        
        {/* Center content */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h3"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: gaugeColor,
              lineHeight: 1,
            }}
          >
            {formatDisplayValue(value)}
          </Typography>
          
          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              {subtitle}
            </Typography>
          )}
          
          {showPercentage && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 0.5 }}
            >
              {value} / {maxValue}
            </Typography>
          )}
        </Box>
      </Box>
      
      {/* Progress indicator */}
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            0
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {maxValue}
          </Typography>
        </Box>
        
        <Box
          sx={{
            width: '100%',
            height: 4,
            backgroundColor,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: `${percentage}%`,
              height: '100%',
              backgroundColor: gaugeColor,
              transition: 'width 0.5s ease-in-out',
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default GaugeChart; 