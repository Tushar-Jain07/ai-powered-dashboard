import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  Paper,
} from '@mui/material';

interface HeatmapData {
  x: string;
  y: string;
  value: number;
}

interface HeatmapChartProps {
  data: HeatmapData[];
  title?: string;
  xLabel?: string;
  yLabel?: string;
  width?: number;
  height?: number;
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({
  data,
  title = 'Heatmap',
  xLabel = 'X Axis',
  yLabel = 'Y Axis',
  width = 400,
  height = 300,
}) => {
  const theme = useTheme();

  // Get unique x and y values
  const xValues = [...new Set(data.map(d => d.x))];
  const yValues = [...new Set(data.map(d => d.y))];

  // Find min and max values for color scaling
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const getColor = (value: number) => {
    const normalized = (value - minValue) / (maxValue - minValue);
    const hue = 200 + normalized * 160; // Blue to Red
    return `hsl(${hue}, 70%, 50%)`;
  };

  const cellSize = Math.min(width / xValues.length, height / yValues.length, 40);

  return (
    <Paper elevation={2} sx={{ p: 2, width, height }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" sx={{ mr: 2 }}>
          {yLabel}:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {yValues.map((y, index) => (
            <Box
              key={y}
              sx={{
                height: cellSize,
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.75rem',
                color: 'text.secondary',
              }}
            >
              {y}
            </Box>
          ))}
        </Box>
        
        <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column' }}>
          {yValues.map((y) => (
            <Box
              key={y}
              sx={{
                display: 'flex',
                height: cellSize,
              }}
            >
              {xValues.map((x) => {
                const item = data.find(d => d.x === x && d.y === y);
                const value = item?.value || 0;
                
                return (
                  <Box
                    key={`${x}-${y}`}
                    sx={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: getColor(value),
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      color: 'white',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.8,
                        transform: 'scale(1.05)',
                      },
                    }}
                    title={`${x} vs ${y}: ${value}`}
                  >
                    {value > 0 ? value : ''}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
        
        <Box sx={{ ml: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {xLabel}:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {xValues.map((x, index) => (
              <Box
                key={x}
                sx={{
                  width: cellSize,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                  transform: 'rotate(-45deg)',
                }}
              >
                {x}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      
      {/* Color scale legend */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          Scale:
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {Array.from({ length: 10 }, (_, i) => {
            const value = minValue + (i / 9) * (maxValue - minValue);
            return (
              <Box
                key={i}
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: getColor(value),
                  border: '1px solid rgba(0,0,0,0.1)',
                }}
              />
            );
          })}
        </Box>
        <Typography variant="caption" sx={{ ml: 1 }}>
          {minValue} - {maxValue}
        </Typography>
      </Box>
    </Paper>
  );
};

export default HeatmapChart; 