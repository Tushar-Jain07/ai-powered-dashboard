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
import DataTable from '../components/DataTable';
import AdvancedSearch from '../components/AdvancedSearch';
import ExportButton from '../components/ExportButton';
import { useNotifications } from '../contexts/NotificationContext';

interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'stream';
  status: 'active' | 'inactive' | 'error';
  lastSync: string;
  records: number;
  size: string;
  description: string;
  connectionString?: string;
  endpoint?: string;
  format?: string;
}

const DataSources: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [filteredData, setFilteredData] = useState<DataSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  // Mock data generation
  useEffect(() => {
    const generateMockData = () => {
      const types: DataSource['type'][] = ['database', 'api', 'file', 'stream'];
      const statuses: DataSource['status'][] = ['active', 'inactive', 'error'];
      const formats = ['JSON', 'CSV', 'XML', 'Parquet'];
      
      const mockData: DataSource[] = Array.from({ length: 20 }, (_, i) => {
        const type = types[Math.floor(Math.random() * types.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        return {
          id: `ds-${i + 1}`,
          name: `Data Source ${i + 1}`,
          type,
          status,
          lastSync: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          records: Math.floor(Math.random() * 100000) + 1000,
          size: `${(Math.random() * 100).toFixed(1)} MB`,
          description: `Sample data source for ${type} integration`,
          connectionString: type === 'database' ? `postgresql://user:pass@host:5432/db${i + 1}` : undefined,
          endpoint: type === 'api' ? `https://api.example.com/v${i + 1}` : undefined,
          format: type === 'file' ? formats[Math.floor(Math.random() * formats.length)] : undefined,
        };
      });
      
      setDataSources(mockData);
      setFilteredData(mockData);
      setIsLoading(false);
    };

    generateMockData();
  }, []);

  const handleSearch = (query: string, filters: any[]) => {
    let results = [...dataSources];
    
    // Apply text search
    if (query) {
      results = results.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Apply filters
    filters.forEach(filter => {
      switch (filter.field) {
        case 'type':
          if (filter.operator === 'equals') {
            results = results.filter(item => item.type === filter.value);
          }
          break;
        case 'status':
          if (filter.operator === 'equals') {
            results = results.filter(item => item.status === filter.value);
          }
          break;
        case 'records':
          if (filter.operator === 'between') {
            const [min, max] = filter.value.toString().split(',').map(Number);
            results = results.filter(item => item.records >= min && item.records <= max);
          }
          break;
      }
    });
    
    setFilteredData(results);
    addNotification(`Found ${results.length} data sources`, 'info');
  };

  const handleClearSearch = () => {
    setFilteredData(dataSources);
    addNotification('Search cleared', 'info');
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      addNotification('Data sources refreshed successfully', 'success');
    } catch (error) {
      addNotification('Failed to refresh data sources', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: string, options: any) => {
    addNotification(`Exporting data sources in ${format} format...`, 'info');
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 2000));
    addNotification('Export completed successfully!', 'success');
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

  const tableColumns = [
    { id: 'name', label: 'Name', minWidth: 200 },
    { id: 'type', label: 'Type', minWidth: 120 },
    { id: 'status', label: 'Status', minWidth: 120 },
    { id: 'lastSync', label: 'Last Sync', minWidth: 150 },
    { id: 'records', label: 'Records', minWidth: 120 },
    { id: 'size', label: 'Size', minWidth: 100 },
    { id: 'actions', label: 'Actions', minWidth: 150 },
  ];

  const renderTableData = (data: DataSource[]) => {
    return data.map((item) => ({
      ...item,
      type: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getTypeIcon(item.type)}
          {item.type.toUpperCase()}
        </Box>
      ),
      status: (
        <Chip
          label={item.status}
          color={getStatusColor(item.status) as any}
          size="small"
        />
      ),
      lastSync: new Date(item.lastSync).toLocaleDateString(),
      records: item.records.toLocaleString(),
      actions: (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => addNotification(`Edit ${item.name}`, 'info')}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => addNotification(`Delete ${item.name}`, 'warning')}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    }));
  };

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Loading Data Sources...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
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
          <ExportButton
            data={filteredData}
            filename="data-sources"
            onExport={handleExport}
          />
        </Box>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Search & Filter Data Sources
          </Typography>
          <AdvancedSearch
            onSearch={handleSearch}
            onClear={handleClearSearch}
            placeholder="Search by name, type, or description..."
            searchFields={['name', 'type', 'status', 'description']}
            categories={['database', 'api', 'file', 'stream']}
            dateRange={true}
            numericRange={true}
          />
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredData.length} of {dataSources.length} data sources
        </Typography>
        {filteredData.length !== dataSources.length && (
          <Chip
            label={`${dataSources.length - filteredData.length} filtered out`}
            size="small"
            color="primary"
            sx={{ ml: 1 }}
          />
        )}
      </Box>

      {/* Data Sources Table */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Data Sources Overview
              </Typography>
              <DataTable
                data={renderTableData(filteredData)}
                columns={tableColumns}
                searchable={false}
              />
            </CardContent>
          </Card>
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