import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';

export interface LineChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  yKeys: Array<{ key: string; color?: string; name?: string }>;
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
}

const LineChart: React.FC<LineChartProps> = ({
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
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', height: height }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 25,
          }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />}
          
          {showXAxis && (
            <XAxis
              dataKey={xKey}
              label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -10 } : undefined}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              tickFormatter={xAxisTickFormatter}
              stroke={theme.palette.divider}
            />
          )}
          
          {showYAxis && (
            <YAxis
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
                paddingTop: 10,
                fontSize: 12,
                color: theme.palette.text.primary,
              }}
            />
          )}
          
          {yKeys.map((yKey, index) => (
            <Line
              key={yKey.key}
              type="monotone"
              dataKey={yKey.key}
              name={yKey.name || yKey.key}
              stroke={yKey.color || theme.palette.primary.main}
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default LineChart; 