import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Fade,
  Zoom,
  Slide,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import KPICard from '../components/KPICard';
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import PieChart from '../components/charts/PieChart';

const Reports: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);

  const kpiData = [
    {
      title: 'Total Reports',
      value: '1,234',
      change: 12.5,
      icon: <AssessmentIcon />,
    },
    {
      title: 'Active Reports',
      value: '856',
      change: 8.2,
      icon: <BarChartIcon />,
    },
    {
      title: 'Generated Today',
      value: '45',
      change: 15.3,
      icon: <TimelineIcon />,
    },
    {
      title: 'Failed Reports',
      value: '12',
      change: -5.2,
      icon: <TrendingDownIcon />,
    },
  ];

  const chartData = {
    bar: [
      { month: 'Jan', reports: 65 },
      { month: 'Feb', reports: 59 },
      { month: 'Mar', reports: 80 },
      { month: 'Apr', reports: 81 },
      { month: 'May', reports: 56 },
      { month: 'Jun', reports: 55 },
    ],
    line: [
      { month: 'Jan', successRate: 85 },
      { month: 'Feb', successRate: 88 },
      { month: 'Mar', successRate: 92 },
      { month: 'Apr', successRate: 89 },
      { month: 'May', successRate: 95 },
      { month: 'Jun', successRate: 91 },
    ],
    pie: [
      { name: 'Completed', value: 65, color: '#4BC0C0' },
      { name: 'In Progress', value: 20, color: '#FFD93D' },
      { name: 'Failed', value: 10, color: '#FF6384' },
      { name: 'Pending', value: 5, color: '#9966FF' },
    ],
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleExport = (format: string) => {
    console.log(`Exporting reports in ${format} format`);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Slide direction="down" in={true} timeout={500}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Reports
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Generate and manage analytical reports
          </Typography>
        </Box>
      </Slide>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiData.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={kpi.title}>
            <Zoom in={true} timeout={600 + index * 100}>
              <div>
                <KPICard {...kpi} />
              </div>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Fade in={true} timeout={800}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Reports Generated Over Time</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={handleRefresh}
                      disabled={loading}
                    >
                      Refresh
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleExport('csv')}
                    >
                      Export
                    </Button>
                  </Box>
                </Box>
                <Box sx={{ height: 300 }}>
                  <BarChart data={chartData.bar} xKey="month" yKeys={[{ key: 'reports', name: 'Reports', color: '#36A2EB' }]} />
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Fade in={true} timeout={900}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Report Status Distribution
                </Typography>
                <Box sx={{ height: 300 }}>
                  <PieChart data={chartData.pie} />
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12}>
          <Fade in={true} timeout={1000}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Success Rate Trend</Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    variant="outlined"
                  >
                    New Report
                  </Button>
                </Box>
                <Box sx={{ height: 300 }}>
                  <LineChart data={chartData.line} xKey="month" yKeys={[{ key: 'successRate', name: 'Success Rate', color: '#4BC0C0' }]} />
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports; 