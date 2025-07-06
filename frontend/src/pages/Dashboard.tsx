import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import KPICard from '../components/KPICard';
import Widget from '../components/Widget';
import DataTable from '../components/DataTable';
import AdvancedSearch from '../components/AdvancedSearch';
import AdvancedAnalytics from '../components/AdvancedAnalytics';
import ExportButton from '../components/ExportButton';
import { useNotifications } from '../contexts/NotificationContext';

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
  const { addNotification } = useNotifications();

  // Mock data generation
  useEffect(() => {
    const generateMockData = () => {
      const categories = ['Sales', 'Marketing', 'Operations', 'Finance', 'HR'];
      const mockData: DashboardData[] = Array.from({ length: 50 }, (_, i) => ({
        id: `item-${i + 1}`,
        name: `Data Point ${i + 1}`,
        value: Math.floor(Math.random() * 1000) + 100,
        change: Math.floor(Math.random() * 40) - 20,
        category: categories[Math.floor(Math.random() * categories.length)],
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        trend: Math.random() > 0.5 ? 'up' : 'down',
        status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)] as 'active' | 'inactive' | 'pending',
      }));
      setData(mockData);
      setFilteredData(mockData);
      setIsLoading(false);
    };

    generateMockData();
  }, []);

  const handleSearch = (query: string, filters: any[]) => {
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
      switch (filter.field) {
        case 'category':
          if (filter.operator === 'equals') {
            results = results.filter(item => item.category === filter.value);
          }
          break;
        case 'value':
          if (filter.operator === 'between') {
            const [min, max] = filter.value.toString().split(',').map(Number);
            results = results.filter(item => item.value >= min && item.value <= max);
          }
          break;
        case 'date':
          if (filter.operator === 'between') {
            const [from, to] = filter.value.toString().split(',');
            results = results.filter(item => {
              const itemDate = new Date(item.date);
              return itemDate >= new Date(from) && itemDate <= new Date(to);
            });
          }
          break;
      }
    });
    
    setFilteredData(results);
    addNotification(`Found ${results.length} results`, 'info');
  };

  const handleClearSearch = () => {
    setFilteredData(data);
    addNotification('Search cleared', 'info');
  };

  const handleExport = async (format: string, options: any) => {
    addNotification(`Exporting data in ${format} format...`, 'info');
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 2000));
    addNotification('Export completed successfully!', 'success');
  };

  const kpiData = [
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
  ];

  const tableColumns = [
    { id: 'name', label: 'Name', minWidth: 200 },
    { id: 'value', label: 'Value', minWidth: 120 },
    { id: 'change', label: 'Change (%)', minWidth: 120 },
    { id: 'category', label: 'Category', minWidth: 150 },
    { id: 'date', label: 'Date', minWidth: 150 },
    { id: 'status', label: 'Status', minWidth: 120 },
  ];

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => addNotification('Add new item clicked', 'info')}
          >
            Add New
          </Button>
          <ExportButton
            data={filteredData}
            filename="dashboard-data"
            onExport={handleExport}
          />
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiData.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <KPICard {...kpi} />
          </Grid>
        ))}
      </Grid>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Search & Filter Data
          </Typography>
          <AdvancedSearch
            onSearch={handleSearch}
            onClear={handleClearSearch}
            placeholder="Search by name, category, or value..."
            searchFields={['name', 'category', 'value', 'status']}
            categories={['Sales', 'Marketing', 'Operations', 'Finance', 'HR']}
            dateRange={true}
            numericRange={true}
          />
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredData.length} of {data.length} records
        </Typography>
        {filteredData.length !== data.length && (
          <Chip
            label={`${data.length - filteredData.length} filtered out`}
            size="small"
            color="primary"
            sx={{ ml: 1 }}
          />
        )}
      </Box>

      {/* Advanced Analytics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <AdvancedAnalytics
            data={filteredData}
            title="Data Analytics"
            refreshInterval={60000}
          />
        </Grid>
      </Grid>

      {/* Data Table */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Widget id="data-overview" title="Data Overview">
            <DataTable
              data={filteredData}
              columns={tableColumns}
              searchable={false}
            />
          </Widget>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={() => addNotification('Generate report clicked', 'info')}
            >
              Generate Report
            </Button>
            <Button
              variant="outlined"
              onClick={() => addNotification('Schedule export clicked', 'info')}
            >
              Schedule Export
            </Button>
            <Button
              variant="outlined"
              onClick={() => addNotification('Share dashboard clicked', 'info')}
            >
              Share Dashboard
            </Button>
            <Button
              variant="outlined"
              onClick={() => addNotification('Set alerts clicked', 'info')}
            >
              Set Alerts
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard; 