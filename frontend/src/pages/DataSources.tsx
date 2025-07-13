import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CloudUpload as UploadIcon,
  Dataset as DatabaseIcon,
  Api as ApiIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import { useNotifications } from '../contexts/NotificationContext';

// Simplified DataSource interface
interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'stream';
  status: 'active' | 'inactive' | 'error';
  lastSync: string;
  records: number;
  size: string;
  description: string;
}

const DataSources: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  // Simplified mock data generation
  useEffect(() => {
    console.log('DataSources component mounted');
    
    const generateMockData = () => {
      try {
        console.log('Generating mock data...');
        
        const mockData: DataSource[] = [
          {
            id: 'ds-1',
            name: 'Customer Database',
            type: 'database',
            status: 'active',
            lastSync: new Date().toISOString(),
            records: 15000,
            size: '45.2 MB',
            description: 'Main customer database with user information',
          },
          {
            id: 'ds-2',
            name: 'Sales API',
            type: 'api',
            status: 'active',
            lastSync: new Date().toISOString(),
            records: 8500,
            size: '12.8 MB',
            description: 'External sales data API integration',
          },
          {
            id: 'ds-3',
            name: 'Product Catalog',
            type: 'file',
            status: 'active',
            lastSync: new Date().toISOString(),
            records: 3200,
            size: '8.5 MB',
            description: 'Product catalog CSV file',
          },
          {
            id: 'ds-4',
            name: 'Analytics Stream',
            type: 'stream',
            status: 'active',
            lastSync: new Date().toISOString(),
            records: 25000,
            size: '67.3 MB',
            description: 'Real-time analytics data stream',
          },
        ];
        
        console.log('Mock data generated:', mockData.length, 'items');
        setDataSources(mockData);
        setError(null);
      } catch (err) {
        console.error('Error generating mock data:', err);
        setError('Failed to load data sources');
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate loading delay
    setTimeout(generateMockData, 1000);
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addNotification('Data sources refreshed successfully', 'success');
    } catch (error) {
      addNotification('Failed to refresh data sources', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: DataSource['type']) => {
    switch (type) {
      case 'database':
        return <DatabaseIcon />;
      case 'api':
        return <ApiIcon />;
      case 'file':
        return <StorageIcon />;
      case 'stream':
        return <UploadIcon />;
      default:
        return <StorageIcon />;
    }
  };

  const getStatusColor = (status: DataSource['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  // Show error if there's one
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '400px',
        p: 3 
      }}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Loading Data Sources...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please wait while we load your data sources.
        </Typography>
      </Box>
    );
  }

  console.log('DataSources component rendering with:', {
    dataSourcesCount: dataSources.length,
    isLoading,
    error
  });

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Data Sources
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => addNotification('Add new data source clicked', 'info')}
          >
            Add Data Source
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Data Sources Grid */}
      <Grid container spacing={3}>
        {dataSources.map((dataSource) => (
          <Grid item xs={12} sm={6} md={4} key={dataSource.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getTypeIcon(dataSource.type)}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {dataSource.name}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {dataSource.description}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={dataSource.type.toUpperCase()}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={dataSource.status}
                    color={getStatusColor(dataSource.status) as any}
                    size="small"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Records: {dataSource.records.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Size: {dataSource.size}
                  </Typography>
                </Box>
                
                <Typography variant="caption" color="text.secondary">
                  Last sync: {new Date(dataSource.lastSync).toLocaleDateString()}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => addNotification(`Edit ${dataSource.name}`, 'info')}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => addNotification(`Delete ${dataSource.name}`, 'warning')}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
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
              startIcon={<UploadIcon />}
              onClick={() => addNotification('Bulk import clicked', 'info')}
            >
              Bulk Import
            </Button>
            <Button
              variant="outlined"
              onClick={() => addNotification('Test connections clicked', 'info')}
            >
              Test Connections
            </Button>
            <Button
              variant="outlined"
              onClick={() => addNotification('Schedule sync clicked', 'info')}
            >
              Schedule Sync
            </Button>
            <Button
              variant="outlined"
              onClick={() => addNotification('Backup data sources clicked', 'info')}
            >
              Backup
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DataSources; 