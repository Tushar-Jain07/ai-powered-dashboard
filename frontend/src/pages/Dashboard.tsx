import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  ViewQuilt as ViewQuiltIcon,
  ViewList as ViewListIcon,
  Fullscreen as FullscreenIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import KPICard from '../components/KPICard';
import Widget from '../components/Widget';
import DataTable from '../components/DataTable';
import AdvancedSearch from '../components/AdvancedSearch';
import AdvancedAnalytics from '../components/AdvancedAnalytics';
import ExportButton from '../components/ExportButton';
import GridItem from '../components/GridItem';
import DraggableDashboard from '../components/DraggableDashboard';
import { useNotifications } from '../contexts/NotificationContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface DashboardData {
  id: string;
  name: string;
  value: number;
  change: number;
  category: string;
  date: string;
  trend: 'up' | 'down' | 'stable';
  status: 'active' | 'inactive' | 'pending';
}

// Dashboard component with enhanced analytics and AI features
const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData[]>([]);
  const [filteredData, setFilteredData] = useState<DashboardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { addNotification } = useNotifications();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Generate mock data
  const generateMockData = useCallback(() => {
      const categories = ['Sales', 'Marketing', 'Operations', 'Finance', 'HR'];
    return Array.from({ length: 50 }, (_, i) => ({
        id: `item-${i + 1}`,
        name: `Data Point ${i + 1}`,
        value: Math.floor(Math.random() * 1000) + 100,
        change: Math.floor(Math.random() * 40) - 20,
        category: categories[Math.floor(Math.random() * categories.length)],
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        trend: Math.random() > 0.5 ? 'up' : 'down' as 'up' | 'down' | 'stable',
        status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)] as 'active' | 'inactive' | 'pending',
      }));
  }, []);

  // Initial data load
  useEffect(() => {
    const mockData = generateMockData();
      setData(mockData);
      setFilteredData(mockData);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [generateMockData]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      const newData = generateMockData();
      setData(newData);
      setFilteredData(newData);
      setIsRefreshing(false);
      addNotification('Dashboard data refreshed successfully', 'success');
    }, 1000);
  }, [generateMockData, addNotification]);

  const handleSearch = useCallback((query: string, filters: any[]) => {
    let results = [...data];
    
    // Apply text search
    if (query) {
      results = results.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Apply filters
    filters.forEach(filter => {
      if (filter.field === 'category' && filter.operator === 'in' && Array.isArray(filter.value)) {
        results = results.filter(item => filter.value.includes(item.category));
        return;
      }
      
      switch (filter.field) {
        case 'category':
          if (filter.operator === 'equals') {
            results = results.filter(item => item.category === filter.value);
          }
          break;
        case 'value':
          if (filter.operator === 'between' && typeof filter.value === 'string') {
            const [min, max] = filter.value.toString().split(',').map(Number);
            results = results.filter(item => item.value >= min && item.value <= max);
          } else if (filter.operator === 'greater_than') {
            results = results.filter(item => item.value > Number(filter.value));
          } else if (filter.operator === 'less_than') {
            results = results.filter(item => item.value < Number(filter.value));
          }
          break;
        case 'date':
          if (filter.operator === 'between' && typeof filter.value === 'string') {
            const [from, to] = filter.value.toString().split(',');
            results = results.filter(item => {
              const itemDate = new Date(item.date);
              return (!from || itemDate >= new Date(from)) && (!to || itemDate <= new Date(to));
            });
          }
          break;
        case 'status':
          if (filter.operator === 'equals') {
            results = results.filter(item => item.status === filter.value);
          }
          break;
      }
    });
    
    setFilteredData(results);
    addNotification(`Found ${results.length} results`, 'info');
  }, [data, addNotification]);

  const handleClearSearch = useCallback(() => {
    setFilteredData(data);
    addNotification('Search cleared', 'info');
  }, [data, addNotification]);

  const handleExport = useCallback(async (format: string, options: any) => {
    addNotification(`Exporting data in ${format} format...`, 'info');
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 2000));
    addNotification('Export completed successfully!', 'success');
  }, [addNotification]);

  const kpiData = useMemo(() => [
    {
      title: 'Total Revenue',
      value: '$125,430',
      change: 12.5,
      icon: <TrendingUpIcon />,
    },
    {
      title: 'Active Users',
      value: '2,847',
      change: -3.2,
      icon: <TrendingDownIcon />,
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: 8.1,
      icon: <TrendingUpIcon />,
    },
    {
      title: 'Avg. Session',
      value: '4m 32s',
      change: 2.3,
      icon: <TrendingUpIcon />,
    },
  ], []);

  const tableColumns = useMemo(() => [
    { id: 'name', label: 'Name', minWidth: 200 },
    { id: 'value', label: 'Value', minWidth: 120 },
    { id: 'change', label: 'Change (%)', minWidth: 120 },
    { id: 'category', label: 'Category', minWidth: 150 },
    { id: 'date', label: 'Date', minWidth: 150 },
    { id: 'status', label: 'Status', minWidth: 120 },
  ], []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of your business metrics and KPIs
        </Typography>
      </Box>

      {/* Action buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
          startIcon={<AddIcon />}
        >
          Add Widget
              </Button>
              <Button
                variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        <Tooltip title="Fullscreen">
          <IconButton>
            <FullscreenIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Tab Navigation */}
      <Box sx={{ mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
            >
              <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ViewQuiltIcon fontSize="small" />
                Grid View
              </Box>
            } 
              />
              <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ViewListIcon fontSize="small" />
                List View
              </Box>
            } 
              />
            </Tabs>
          </Box>

      {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
        {/* KPI Cards */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {kpiData.map((kpi) => (
              <Box key={kpi.title} sx={{ width: { xs: '100%', sm: '48%', md: '23%' }, mb: 2 }}>
                <KPICard {...kpi} />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Search and Table */}
              <Widget
          title="Data Analysis" 
          subtitle="Explore and filter your data"
          id="data-analysis-widget"
        >
          <Box sx={{ p: 2 }}>
          <AdvancedSearch
            onSearch={handleSearch}
            onClear={handleClearSearch}
            placeholder="Search data points..."
            searchFields={['name', 'category', 'value', 'status']}
            categories={['Sales', 'Marketing', 'Operations', 'Finance', 'HR']}
            dateRange={true}
            numericRange={true}
                  />
                </Box>

          <Box sx={{ mt: 2 }}>
            <DataTable 
              columns={tableColumns} 
              data={filteredData}
              pagination={true}
              exportable={true}
              onExport={handleExport}
            />
          </Box>
          </Widget>
          </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* List View Content */}
        <Box sx={{ mb: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Data List</Typography>
                <ExportButton onExport={handleExport} data={filteredData} />
              </Box>
              <DataTable
                columns={tableColumns}
                data={filteredData}
                pagination={true}
                exportable={false}
                density="compact"
              />
            </CardContent>
          </Card>
        </Box>
      </TabPanel>
    </Box>
  );
};

export default Dashboard; 