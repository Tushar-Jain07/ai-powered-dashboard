import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Chip,
  LinearProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Business,
  People,
  AttachMoney,
  ShoppingCart,
  Assessment,
  Insights,
  Notifications,
  Add,
  Refresh,
  Download,
  Share,
  Settings,
  Analytics,
  Timeline,
  PieChart,
  BarChart,
  TableChart,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart as RechartsBarChart, Bar } from 'recharts';

// Enhanced Business Intelligence Dashboard
const BusinessDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [insights, setInsights] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock business data
  const businessMetrics = {
    revenue: { value: 2847500, change: 12.5, trend: 'up' },
    customers: { value: 12450, change: 8.2, trend: 'up' },
    orders: { value: 8934, change: -2.1, trend: 'down' },
    conversion: { value: 3.24, change: 15.7, trend: 'up' },
    avgOrder: { value: 319, change: 5.3, trend: 'up' },
    retention: { value: 78.5, change: 2.1, trend: 'up' },
  };

  const salesData = [
    { month: 'Jan', revenue: 240000, orders: 1200, customers: 2100 },
    { month: 'Feb', revenue: 280000, orders: 1400, customers: 2300 },
    { month: 'Mar', revenue: 320000, orders: 1600, customers: 2500 },
    { month: 'Apr', revenue: 290000, orders: 1450, customers: 2400 },
    { month: 'May', revenue: 350000, orders: 1750, customers: 2700 },
    { month: 'Jun', revenue: 380000, orders: 1900, customers: 2900 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 45, revenue: 1280000, color: '#8884d8' },
    { name: 'Clothing', value: 25, revenue: 710000, color: '#82ca9d' },
    { name: 'Books', value: 15, revenue: 425000, color: '#ffc658' },
    { name: 'Home & Garden', value: 10, revenue: 285000, color: '#ff7300' },
    { name: 'Sports', value: 5, revenue: 142000, color: '#00ff00' },
  ];

  const aiInsights = [
    {
      id: 1,
      type: 'opportunity',
      title: 'Revenue Growth Opportunity',
      description: 'Electronics category shows 23% higher conversion rate. Consider increasing inventory and marketing spend.',
      impact: 'high',
      confidence: 87,
      action: 'Increase electronics marketing budget by 15%',
    },
    {
      id: 2,
      type: 'warning',
      title: 'Customer Retention Alert',
      description: 'Customer retention rate dropped 2.1% this month. Focus on customer satisfaction initiatives.',
      impact: 'medium',
      confidence: 92,
      action: 'Implement customer feedback survey',
    },
    {
      id: 3,
      type: 'trend',
      title: 'Seasonal Trend Detected',
      description: 'Sales typically increase 18% in Q3. Prepare inventory and staffing accordingly.',
      impact: 'high',
      confidence: 78,
      action: 'Plan Q3 inventory and hiring',
    },
  ];

  const businessAlerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Low Stock Alert',
      message: 'Electronics inventory below 20% threshold',
      time: '2 hours ago',
      action: 'Reorder now',
    },
    {
      id: 2,
      type: 'warning',
      title: 'High Cart Abandonment',
      message: 'Cart abandonment rate increased to 68%',
      time: '4 hours ago',
      action: 'Review checkout process',
    },
    {
      id: 3,
      type: 'info',
      title: 'New Customer Milestone',
      message: 'Reached 12,000 active customers',
      time: '1 day ago',
      action: 'Celebrate achievement',
    },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setInsights(aiInsights);
      setAlerts(businessAlerts);
      setIsLoading(false);
    }, 1500);
  }, []);

  const MetricCard = ({ title, value, change, trend, icon, color }: any) => (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ 
              p: 1, 
              borderRadius: 2, 
              backgroundColor: `${color}.light`, 
              color: `${color}.main`,
              mr: 2 
            }}>
              {icon}
            </Box>
            <Typography variant="h6" color="text.secondary">
              {title}
            </Typography>
          </Box>
          <Chip
            icon={trend === 'up' ? <TrendingUp /> : <TrendingDown />}
            label={`${change > 0 ? '+' : ''}${change}%`}
            color={trend === 'up' ? 'success' : 'error'}
            size="small"
          />
        </Box>
        <Typography variant="h4" fontWeight="bold" color="text.primary">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={Math.min(Math.abs(change) * 5, 100)}
          color={trend === 'up' ? 'success' : 'error'}
          sx={{ mt: 2, height: 4, borderRadius: 2 }}
        />
      </CardContent>
    </Card>
  );

  const InsightCard = ({ insight }: any) => (
    <Card sx={{ mb: 2, borderLeft: 4, borderLeftColor: 
      insight.type === 'opportunity' ? 'success.main' : 
      insight.type === 'warning' ? 'warning.main' : 'info.main' 
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            {insight.title}
          </Typography>
          <Chip 
            label={`${insight.confidence}% confidence`} 
            size="small" 
            color={insight.confidence > 80 ? 'success' : insight.confidence > 60 ? 'warning' : 'error'}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {insight.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip 
            label={insight.action} 
            size="small" 
            variant="outlined"
            color="primary"
          />
          <Button size="small" variant="text" color="primary">
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const AlertCard = ({ alert }: any) => (
    <Card sx={{ mb: 1, borderLeft: 4, borderLeftColor: 
      alert.type === 'critical' ? 'error.main' : 
      alert.type === 'warning' ? 'warning.main' : 'info.main' 
    }}>
      <CardContent sx={{ py: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              {alert.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {alert.message} • {alert.time}
            </Typography>
          </Box>
          <Button size="small" variant="outlined" color="primary">
            {alert.action}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Loading Business Intelligence...</Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Business Intelligence Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-powered insights and analytics for data-driven decisions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Refresh />}>
            Refresh
          </Button>
          <Button variant="outlined" startIcon={<Download />}>
            Export
          </Button>
          <Button variant="contained" startIcon={<Add />}>
            Add Report
          </Button>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Revenue"
            value={`$${businessMetrics.revenue.value.toLocaleString()}`}
            change={businessMetrics.revenue.change}
            trend={businessMetrics.revenue.trend}
            icon={<AttachMoney />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Customers"
            value={businessMetrics.customers.value.toLocaleString()}
            change={businessMetrics.customers.change}
            trend={businessMetrics.customers.trend}
            icon={<People />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Orders"
            value={businessMetrics.orders.value.toLocaleString()}
            change={businessMetrics.orders.change}
            trend={businessMetrics.orders.trend}
            icon={<ShoppingCart />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Conversion"
            value={`${businessMetrics.conversion.value}%`}
            change={businessMetrics.conversion.change}
            trend={businessMetrics.conversion.trend}
            icon={<TrendingUp />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Avg Order"
            value={`$${businessMetrics.avgOrder.value}`}
            change={businessMetrics.avgOrder.change}
            trend={businessMetrics.avgOrder.trend}
            icon={<Assessment />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Retention"
            value={`${businessMetrics.retention.value}%`}
            change={businessMetrics.retention.change}
            trend={businessMetrics.retention.trend}
            icon={<Business />}
            color="success"
          />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab icon={<Analytics />} label="Analytics" />
          <Tab icon={<Insights />} label="AI Insights" />
          <Tab icon={<Notifications />} label="Alerts" />
          <Tab icon={<Timeline />} label="Trends" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Sales Chart */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardHeader
                title="Revenue & Sales Trends"
                action={
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Metric</InputLabel>
                    <Select
                      value={selectedMetric}
                      onChange={(e) => setSelectedMetric(e.target.value)}
                      label="Metric"
                    >
                      <MenuItem value="revenue">Revenue</MenuItem>
                      <MenuItem value="orders">Orders</MenuItem>
                      <MenuItem value="customers">Customers</MenuItem>
                    </Select>
                  </FormControl>
                }
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey={selectedMetric} 
                      stroke="#8884d8" 
                      strokeWidth={3}
                      dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Category Breakdown */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardHeader title="Revenue by Category" />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <RechartsPieChart
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <Box sx={{ mt: 2 }}>
                  {categoryData.map((category) => (
                    <Box key={category.name} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          backgroundColor: category.color, 
                          borderRadius: '50%', 
                          mr: 1 
                        }} />
                        <Typography variant="body2">{category.name}</Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="bold">
                        ${category.revenue.toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Typography variant="h6" gutterBottom>
              AI-Powered Business Insights
            </Typography>
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card>
              <CardHeader title="Insight Categories" />
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Opportunities</Typography>
                  <LinearProgress variant="determinate" value={60} color="success" sx={{ height: 8, borderRadius: 4 }} />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Warnings</Typography>
                  <LinearProgress variant="determinate" value={25} color="warning" sx={{ height: 8, borderRadius: 4 }} />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Trends</Typography>
                  <LinearProgress variant="determinate" value={15} color="info" sx={{ height: 8, borderRadius: 4 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Typography variant="h6" gutterBottom>
              Business Alerts & Notifications
            </Typography>
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card>
              <CardHeader title="Alert Summary" />
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="h3" color="error.main">3</Typography>
                  <Typography variant="body2" color="text.secondary">Critical Alerts</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="h3" color="warning.main">5</Typography>
                  <Typography variant="body2" color="text.secondary">Warnings</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="info.main">12</Typography>
                  <Typography variant="body2" color="text.secondary">Info Notifications</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Business Trends Analysis" />
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsBarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                    <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
                    <Bar dataKey="customers" fill="#ffc658" name="Customers" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default BusinessDashboard;
