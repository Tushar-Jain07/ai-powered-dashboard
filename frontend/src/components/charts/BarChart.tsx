import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

export interface BarChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  yKeys: Array<{ key: string; color?: string; name?: string; stackId?: string }>;
  title?: string;
  height?: number | string;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  xAxisTickFormatter?: (value: any) => string;
  yAxisTickFormatter?: (value: any) => string;
  tooltipFormatter?: (value: any, name: string) => [string, string];
  layout?: 'horizontal' | 'vertical';
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  xKey,
  yKeys,
  title,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
  xAxisLabel,
  yAxisLabel,
  xAxisTickFormatter,
  yAxisTickFormatter,
  tooltipFormatter,
  layout = 'horizontal',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ width: '100%', height: height }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout={layout}
          margin={{
            top: isMobile ? 0 : 5,
            right: isMobile ? 10 : 30,
            left: isMobile ? 5 : 20,
            bottom: isMobile ? 10 : 25,
          }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />}
          
          {showXAxis && (
            <XAxis
              dataKey={layout === 'horizontal' ? xKey : undefined}
              type={layout === 'horizontal' ? 'category' : 'number'}
              label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -10 } : undefined}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              tickFormatter={xAxisTickFormatter}
              stroke={theme.palette.divider}
            />
          )}
          
          {showYAxis && (
            <YAxis
              dataKey={layout === 'vertical' ? xKey : undefined}
              type={layout === 'vertical' ? 'category' : 'number'}
              label={
                yAxisLabel
                  ? {
                      value: yAxisLabel,
                      angle: -90,
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' },
                    }
                  : undefined
              }
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              tickFormatter={yAxisTickFormatter}
              stroke={theme.palette.divider}
            />
          )}
          
          {showTooltip && (
            <Tooltip
              formatter={tooltipFormatter}
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 4,
              }}
            />
          )}
          
          {showLegend && (
            <Legend
              wrapperStyle={{
                paddingTop: isMobile ? 4 : 10,
                fontSize: isMobile ? 10 : 12,
                color: theme.palette.text.primary,
              }}
            />
          )}
          
          {yKeys.map((yKey, index) => (
            <Bar
              key={yKey.key}
              dataKey={yKey.key}
              name={yKey.name || yKey.key}
              fill={yKey.color || theme.palette.primary.main}
              stackId={yKey.stackId}
              radius={[3, 3, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BarChart; 