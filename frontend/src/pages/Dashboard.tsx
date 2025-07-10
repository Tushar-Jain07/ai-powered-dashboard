import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Fade,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  ViewQuilt as ViewQuiltIcon,
  ViewList as ViewListIcon,
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

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData[]>([]);
  const [filteredData, setFilteredData] = useState<DashboardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { addNotification } = useNotifications();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Generate mock data with memoization for better performance
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

  // Create widgets for the draggable dashboard
  const dashboardWidgets = useMemo(() => [
    {
      id: 'search',
      title: 'Search & Filter',
      description: 'Filter data by various criteria',
      component: (
        <Widget
          id="search-filters"
          title="Search & Filter Data"
          subtitle="Use advanced filters to narrow down results"
          description="Filter by category, date range, value range, or create custom filters"
        >
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <AdvancedSearch
              onSearch={handleSearch}
              onClear={handleClearSearch}
              placeholder="Search data points..."
              searchFields={['name', 'category', 'value', 'status']}
              categories={['Sales', 'Marketing', 'Operations', 'Finance', 'HR']}
              dateRange={true}
              numericRange={true}
              saveFilters={true}
            />
          </Box>
        </Widget>
      ),
      defaultSize: [12, 5] as [number, number],
    },
    {
      id: 'kpi-1',
      title: 'Revenue',
      component: <KPICard {...kpiData[0]} />,
      defaultSize: [3, 3] as [number, number],
    },
    {
      id: 'kpi-2',
      title: 'Users',
      component: <KPICard {...kpiData[1]} />,
      defaultSize: [3, 3] as [number, number],
    },
    {
      id: 'kpi-3',
      title: 'Conversion',
      component: <KPICard {...kpiData[2]} />,
      defaultSize: [3, 3] as [number, number],
    },
    {
      id: 'kpi-4',
      title: 'Session',
      component: <KPICard {...kpiData[3]} />,
      defaultSize: [3, 3] as [number, number],
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Visual representation of data',
      component: (
        <Widget
          id="analytics-widget"
          title="Advanced Analytics"
          description="Visual representation of filtered data"
          loading={isRefreshing}
          onRefresh={handleRefresh}
          onDownload={() => handleExport('png', { type: 'chart' })}
        >
          <Box sx={{ p: { xs: 0, sm: 0 }, height: '400px' }}>
            <AdvancedAnalytics data={filteredData} />
          </Box>
        </Widget>
      ),
      defaultSize: [8, 8] as [number, number],
    },
    {
      id: 'summary',
      title: 'Summary',
      description: 'Statistical overview',
      component: (
        <Widget
          id="data-summary"
          title="Data Summary"
          description="Statistical breakdown of current data"
          loading={isRefreshing}
        >
          <Box sx={{ p: 3, height: '400px', overflow: 'auto' }}>
            <Typography variant="subtitle1" gutterBottom>
              Summary Statistics
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Total Records:</strong> {filteredData.length}
              </Typography>
              <Typography variant="body2">
                <strong>Average Value:</strong> {
                  filteredData.length ? 
                  (filteredData.reduce((sum, item) => sum + item.value, 0) / filteredData.length).toFixed(2) :
                  '0'
                }
              </Typography>
              <Typography variant="body2">
                <strong>Min Value:</strong> {
                  filteredData.length ? 
                  Math.min(...filteredData.map(item => item.value)) :
                  '0'
                }
              </Typography>
              <Typography variant="body2">
                <strong>Max Value:</strong> {
                  filteredData.length ? 
                  Math.max(...filteredData.map(item => item.value)) :
                  '0'
                }
              </Typography>
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Category Distribution
            </Typography>
            <Box>
              {filteredData.length > 0 && 
                Array.from(
                  new Set(filteredData.map(item => item.category))
                ).map(category => {
                  const count = filteredData.filter(item => item.category === category).length;
                  const percentage = Math.round((count / filteredData.length) * 100);
                  
                  return (
                    <Box key={category} sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">{category}</Typography>
                        <Typography variant="body2">{count} ({percentage}%)</Typography>
                      </Box>
                      <Box 
                        sx={{ 
                          height: 4, 
                          bgcolor: 'background.paper',
                          borderRadius: 1,
                          mt: 0.5,
                          overflow: 'hidden'
                        }}
                      >
                        <Box 
                          sx={{ 
                            height: '100%', 
                            width: `${percentage}%`,
                            bgcolor: 'primary.main',
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })
              }
            </Box>
          </Box>
        </Widget>
      ),
      defaultSize: [4, 8] as [number, number],
    },
    {
      id: 'data-table',
      title: 'Data Table',
      description: 'Detailed data records',
      component: (
        <Widget
          id="data-table-widget"
          title="Data Table"
          subtitle={`Showing ${filteredData.length} of ${data.length} records`}
          description="Detailed table view of all data points"
          loading={isRefreshing}
          onRefresh={handleRefresh}
          onDownload={() => handleExport('csv', { type: 'table' })}
        >
          <DataTable 
            columns={tableColumns} 
            data={filteredData}
            pagination
          />
        </Widget>
      ),
      defaultSize: [12, 7] as [number, number],
    },
  ], [kpiData, filteredData, data, isRefreshing, handleSearch, handleClearSearch, handleRefresh, handleExport, tableColumns]);

  const handleSaveLayout = useCallback((layout: any) => {
    // Save layout to localStorage or server
    addNotification('Dashboard layout saved successfully!', 'success');
  }, [addNotification]);

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '50vh' 
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="main">
      <Fade in={!isLoading} timeout={500}>
    <Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        mb: 3,
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography 
          variant="h4" 
              component="h1"
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            mb: { xs: 1, sm: 0 }
          }}
        >
          Dashboard
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          width: { xs: '100%', sm: 'auto' }
        }}>
          <Button
            variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={isRefreshing}
                aria-label="Refresh dashboard data"
                fullWidth={isSmall}
              >
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button
                variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => addNotification('Add new item clicked', 'info')}
                aria-label="Add new item"
                fullWidth={isSmall}
          >
            Add New
          </Button>
          <ExportButton
            data={filteredData}
            filename="dashboard-data"
            onExport={handleExport}
            aria-label="Export data"
          />
        </Box>
      </Box>

          {/* View Toggle */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="dashboard views"
              variant={isMobile ? "fullWidth" : "standard"}
            >
              <Tab 
                icon={<ViewQuiltIcon />} 
                label={!isMobile && "Customizable Dashboard"} 
                iconPosition="start" 
                id="tab-0" 
                aria-controls="tabpanel-0" 
              />
              <Tab 
                icon={<ViewListIcon />} 
                label={!isMobile && "Standard Dashboard"} 
                iconPosition="start" 
                id="tab-1" 
                aria-controls="tabpanel-1"
              />
            </Tabs>
          </Box>

          {/* Customizable Dashboard View */}
          <TabPanel value={tabValue} index={0}>
            <DraggableDashboard 
              widgets={dashboardWidgets}
              onSaveLayout={handleSaveLayout}
              title="Customizable Dashboard"
              subtitle="Drag and resize widgets to personalize your view"
            />
          </TabPanel>

          {/* Standard Dashboard View */}
          <TabPanel value={tabValue} index={1}>
      {/* Search and Filters */}
            <GridItem isAnimated animationDelay={0.4}>
              <Widget
                id="search-filters"
                title="Search & Filter Data"
                subtitle="Use advanced filters to narrow down results"
                description="Filter by category, date range, value range, or create custom filters"
              >
                <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <AdvancedSearch
            onSearch={handleSearch}
            onClear={handleClearSearch}
            placeholder="Search data points..."
            searchFields={['name', 'category', 'value', 'status']}
            categories={['Sales', 'Marketing', 'Operations', 'Finance', 'HR']}
            dateRange={true}
            numericRange={true}
                    saveFilters={true}
                  />
                </Box>
              </Widget>
            </GridItem>

            {/* KPI Cards */}
            <Box sx={{ mb: 4, mt: 3 }}>
              <Box 
                component="div" 
                display="grid" 
                gridTemplateColumns={{
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)',
                }}
                gap={3}
              >
                {kpiData.map((kpi, index) => (
                  <GridItem 
                    key={`kpi-${index}`} 
                    isAnimated 
                    animationDelay={0.1 * index}
                  >
                    <KPICard {...kpi} />
                  </GridItem>
                ))}
              </Box>
            </Box>

            {/* Analytics Widgets */}
            <Box 
              component="div" 
              display="grid" 
              gridTemplateColumns={{
                xs: '1fr',
                lg: '2fr 1fr',
              }}
              gap={3}
              sx={{ my: 3 }}
            >
              <GridItem isAnimated animationDelay={0.5}>
          <Widget
            id="analytics"
            title="Advanced Analytics"
                  description="Visual representation of filtered data"
                  loading={isRefreshing}
                  onRefresh={handleRefresh}
                  onDownload={() => handleExport('png', { type: 'chart' })}
          >
                  <Box sx={{ p: { xs: 0, sm: 0 }, height: '400px' }}>
            <AdvancedAnalytics data={filteredData} />
                  </Box>
                </Widget>
              </GridItem>
              <GridItem isAnimated animationDelay={0.6}>
                <Widget
                  id="data-summary"
                  title="Data Summary"
                  description="Statistical breakdown of current data"
                  loading={isRefreshing}
                >
                  <Box sx={{ p: 3, height: '400px', overflow: 'auto' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Summary Statistics
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Total Records:</strong> {filteredData.length}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Average Value:</strong> {
                          filteredData.length ? 
                          (filteredData.reduce((sum, item) => sum + item.value, 0) / filteredData.length).toFixed(2) :
                          '0'
                        }
                      </Typography>
                      <Typography variant="body2">
                        <strong>Min Value:</strong> {
                          filteredData.length ? 
                          Math.min(...filteredData.map(item => item.value)) :
                          '0'
                        }
                      </Typography>
                      <Typography variant="body2">
                        <strong>Max Value:</strong> {
                          filteredData.length ? 
                          Math.max(...filteredData.map(item => item.value)) :
                          '0'
                        }
                      </Typography>
                    </Box>

                    <Typography variant="subtitle1" gutterBottom>
                      Category Distribution
                    </Typography>
                    <Box>
                      {filteredData.length > 0 && 
                        Array.from(
                          new Set(filteredData.map(item => item.category))
                        ).map(category => {
                          const count = filteredData.filter(item => item.category === category).length;
                          const percentage = Math.round((count / filteredData.length) * 100);
                          
                          return (
                            <Box key={category} sx={{ mb: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2">{category}</Typography>
                                <Typography variant="body2">{count} ({percentage}%)</Typography>
                              </Box>
                              <Box 
                                sx={{ 
                                  height: 4, 
                                  bgcolor: 'background.paper',
                                  borderRadius: 1,
                                  mt: 0.5,
                                  overflow: 'hidden'
                                }}
                              >
                                <Box 
                                  sx={{ 
                                    height: '100%', 
                                    width: `${percentage}%`,
                                    bgcolor: 'primary.main',
                                  }}
                                />
                              </Box>
                            </Box>
                          );
                        })
                      }
                    </Box>
                  </Box>
          </Widget>
              </GridItem>
            </Box>

            {/* Data Table */}
            <GridItem isAnimated animationDelay={0.7}>
          <Widget
            id="data-table"
                title="Data Table"
                subtitle={`Showing ${filteredData.length} of ${data.length} records`}
                description="Detailed table view of all data points"
                loading={isRefreshing}
                onRefresh={handleRefresh}
                onDownload={() => handleExport('csv', { type: 'table' })}
                height={400}
          >
            <DataTable 
              columns={tableColumns} 
              data={filteredData}
              pagination
            />
          </Widget>
            </GridItem>
          </TabPanel>
        </Box>
      </Fade>
    </Box>
  );
};

export default Dashboard; 