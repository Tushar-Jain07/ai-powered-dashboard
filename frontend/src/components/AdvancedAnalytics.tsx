import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon,
  TableChart as TableChartIcon,
  Download as DownloadIcon,
  Fullscreen as FullscreenIcon,
  ShowChart as AreaChartIcon,
  ScatterPlot as ScatterPlotIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
} from 'recharts';
import { useNotifications } from '../contexts/NotificationContext';
import ExportButton from './ExportButton';

interface AnalyticsData {
  id: string;
  name: string;
  value: number;
  change: number;
  category: string;
  date: string;
  trend: 'up' | 'down' | 'stable';
}

interface AdvancedAnalyticsProps {
  data?: AnalyticsData[];
  title?: string;
  refreshInterval?: number;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  data = [],
  title = 'Advanced Analytics',
  refreshInterval = 30000,
}) => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['value']);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const { addNotification } = useNotifications();

  const chartTypes = [
    { value: 'line', label: 'Line Chart', icon: <LineChartIcon /> },
    { value: 'area', label: 'Area Chart', icon: <AreaChartIcon /> },
    { value: 'bar', label: 'Bar Chart', icon: <BarChartIcon /> },
    { value: 'pie', label: 'Pie Chart', icon: <PieChartIcon /> },
    { value: 'radar', label: 'Radar Chart', icon: <TimelineIcon /> },
    { value: 'scatter', label: 'Scatter Plot', icon: <ScatterPlotIcon /> },
  ];

  const timeRanges = [
    { value: '1d', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
  ];

  const metrics = [
    { value: 'value', label: 'Value' },
    { value: 'change', label: 'Change' },
    { value: 'trend', label: 'Trend' },
  ];

  useEffect(() => {
    processData();
  }, [data, timeRange, selectedMetrics]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const processData = () => {
    // Process data based on selected time range and metrics
    let filteredData = [...data];
    
    // Filter by time range
    const now = new Date();
    const timeRangeMs = {
      '1d': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000,
    };

    if (timeRange !== 'all') {
      const cutoffDate = new Date(now.getTime() - timeRangeMs[timeRange as keyof typeof timeRangeMs]);
      filteredData = filteredData.filter(item => new Date(item.date) >= cutoffDate);
    }

    // Group by category for pie chart
    if (chartType === 'pie') {
      const grouped = filteredData.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.value;
        return acc;
      }, {} as Record<string, number>);

      const pieData = Object.entries(grouped).map(([name, value]) => ({
        name,
        value,
      }));

      setProcessedData(pieData);
    } else {
      setProcessedData(filteredData);
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      addNotification('Data refreshed successfully', 'success');
    } catch (error) {
      addNotification('Failed to refresh data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const renderChart = () => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000'];

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              {selectedMetrics.map((metric, index) => (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              {selectedMetrics.map((metric, index) => (
                <Area
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  fill={colors[index % colors.length]}
                  stroke={colors[index % colors.length]}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              {selectedMetrics.map((metric, index) => (
                <Bar
                  key={metric}
                  dataKey={metric}
                  fill={colors[index % colors.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={processedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={processedData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar
                name="Value"
                dataKey="value"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <RechartsTooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey="value" name="Value" />
              <YAxis type="number" dataKey="change" name="Change" />
              <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Data Points" data={processedData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return <Typography>Select a chart type</Typography>;
    }
  };

  const renderDataTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Change</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Trend</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {processedData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.value}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {row.change > 0 ? (
                    <TrendingUpIcon color="success" fontSize="small" />
                  ) : (
                    <TrendingDownIcon color="error" fontSize="small" />
                  )}
                  {row.change}%
                </Box>
              </TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Chip
                  label={row.trend}
                  color={row.trend === 'up' ? 'success' : row.trend === 'down' ? 'error' : 'default'}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">{title}</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh Data">
              <IconButton onClick={refreshData} disabled={isLoading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <ExportButton data={processedData} filename="analytics-data" />
            <Tooltip title="Fullscreen">
              <IconButton>
                <FullscreenIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {isLoading && <LinearProgress sx={{ mb: 2 }} />}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Chart" />
            <Tab label="Table" />
            <Tab label="Insights" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <>
            {/* Controls */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Chart Type</InputLabel>
                  <Select
                    value={chartType}
                    label="Chart Type"
                    onChange={(e) => setChartType(e.target.value)}
                  >
                    {chartTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {type.icon}
                          {type.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Time Range</InputLabel>
                  <Select
                    value={timeRange}
                    label="Time Range"
                    onChange={(e) => setTimeRange(e.target.value)}
                  >
                    {timeRanges.map((range) => (
                      <MenuItem key={range.value} value={range.value}>
                        {range.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {metrics.map((metric) => (
                    <Chip
                      key={metric.value}
                      label={metric.label}
                      onClick={() => handleMetricToggle(metric.value)}
                      color={selectedMetrics.includes(metric.value) ? 'primary' : 'default'}
                      variant={selectedMetrics.includes(metric.value) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>

            {/* Chart */}
            <Box sx={{ height: 400 }}>
              {processedData.length > 0 ? (
                renderChart()
              ) : (
                <Alert severity="info">No data available for the selected criteria</Alert>
              )}
            </Box>
          </>
        )}

        {activeTab === 1 && (
          <Box>
            {processedData.length > 0 ? (
              renderDataTable()
            ) : (
              <Alert severity="info">No data available</Alert>
            )}
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Key Insights
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Total Records
                    </Typography>
                    <Typography variant="h4">{processedData.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="success.main">
                      Average Value
                    </Typography>
                    <Typography variant="h4">
                      {processedData.length > 0
                        ? (processedData.reduce((sum, item) => sum + item.value, 0) / processedData.length).toFixed(2)
                        : '0'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="warning.main">
                      Categories
                    </Typography>
                    <Typography variant="h4">
                      {new Set(processedData.map(item => item.category)).size}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedAnalytics; 