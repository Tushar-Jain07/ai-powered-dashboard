import React from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  Tooltip,
} from '@mui/material';

interface TimelineData {
  date: string;
  value: number;
  label?: string;
  category?: string;
}

interface TimelineChartProps {
  data: TimelineData[];
  title?: string;
  height?: number;
  showPoints?: boolean;
  showArea?: boolean;
  color?: string;
}

const TimelineChart: React.FC<TimelineChartProps> = ({
  data,
  title = 'Timeline',
  height = 300,
  showPoints = true,
  showArea = true,
  color,
}) => {
  const theme = useTheme();
  
  // Sort data by date
  const sortedData = [...data].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Find min and max values
  const values = sortedData.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue;
  
  const chartColor = color || theme.palette.primary.main;
  const areaColor = theme.palette.mode === 'dark' 
    ? `${chartColor}20` 
    : `${chartColor}15`;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getYPosition = (value: number) => {
    if (valueRange === 0) return height - 40;
    return height - 40 - ((value - minValue) / valueRange) * (height - 80);
  };

  const getXPosition = (index: number) => {
    return (index / (sortedData.length - 1)) * (100 - 10) + 5; // 5% margin on each side
  };

  return (
    <Paper elevation={2} sx={{ p: 2, height }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      <Box sx={{ position: 'relative', height: height - 80 }}>
        {/* Y-axis labels */}
        <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 40 }}>
          <Typography variant="caption" sx={{ position: 'absolute', top: 0 }}>
            {maxValue.toFixed(1)}
          </Typography>
          <Typography variant="caption" sx={{ position: 'absolute', bottom: 0 }}>
            {minValue.toFixed(1)}
          </Typography>
        </Box>
        
        {/* Chart area */}
        <Box sx={{ position: 'absolute', left: 40, right: 0, top: 0, bottom: 0 }}>
          {/* Grid lines */}
          {Array.from({ length: 5 }, (_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${(i / 4) * 100}%`,
                height: 1,
                backgroundColor: theme.palette.divider,
                opacity: 0.3,
              }}
            />
          ))}
          
          {/* Area fill */}
          {showArea && sortedData.length > 1 && (
            <svg
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={chartColor} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={chartColor} stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path
                d={sortedData.map((d, i) => {
                  const x = getXPosition(i);
                  const y = getYPosition(d.value);
                  return `${i === 0 ? 'M' : 'L'} ${x}% ${y}`;
                }).join(' ') + ` L ${getXPosition(sortedData.length - 1)}% ${height - 40} L ${getXPosition(0)}% ${height - 40} Z`}
                fill="url(#areaGradient)"
                stroke="none"
              />
            </svg>
          )}
          
          {/* Line */}
          {sortedData.length > 1 && (
            <svg
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              <path
                d={sortedData.map((d, i) => {
                  const x = getXPosition(i);
                  const y = getYPosition(d.value);
                  return `${i === 0 ? 'M' : 'L'} ${x}% ${y}`;
                }).join(' ')}
                stroke={chartColor}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          
          {/* Data points */}
          {showPoints && sortedData.map((d, i) => (
            <Tooltip
              key={d.date}
              title={
                <Box>
                  <Typography variant="body2">
                    {d.label || formatDate(d.date)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Value: {d.value}
                  </Typography>
                  {d.category && (
                    <Typography variant="caption" color="text.secondary">
                      Category: {d.category}
                    </Typography>
                  )}
                </Box>
              }
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: `${getXPosition(i)}%`,
                  top: getYPosition(d.value),
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: chartColor,
                  border: `2px solid ${theme.palette.background.paper}`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translate(-50%, -50%) scale(1.2)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              />
            </Tooltip>
          ))}
        </Box>
      </Box>
      
      {/* X-axis labels */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, px: 5 }}>
        {sortedData.length > 0 && (
          <>
            <Typography variant="caption" color="text.secondary">
              {formatDate(sortedData[0].date)}
            </Typography>
            {sortedData.length > 1 && (
              <Typography variant="caption" color="text.secondary">
                {formatDate(sortedData[sortedData.length - 1].date)}
              </Typography>
            )}
          </>
        )}
      </Box>
    </Paper>
  );
};

export default TimelineChart; 