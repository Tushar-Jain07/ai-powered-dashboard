import React, { useState } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Grid } from '@mui/material';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import DataTable from '../components/DataTable';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`model-tabpanel-${index}`}
      aria-labelledby={`model-tab-${index}`}
      {...other}
      style={{ padding: '16px 0' }}
    >
      {value === index && children}
    </div>
  );
};

const MLModels: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [featureImportance, setFeatureImportance] = useState<any[]>([]);

  // Mock data
  const models = [
    {
      id: '1',
      name: 'Sales Forecast',
      type: 'Time Series',
      accuracy: 0.92,
      lastTrained: '2023-05-15',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Customer Churn',
      type: 'Classification',
      accuracy: 0.87,
      lastTrained: '2023-05-10',
      status: 'Active',
    },
    {
      id: '3',
      name: 'Product Recommendation',
      type: 'Clustering',
      accuracy: 0.78,
      lastTrained: '2023-05-05',
      status: 'Training',
    },
  ];

  const mockPredictions = [
    { date: '2023-06-01', actual: 120, predicted: 125 },
    { date: '2023-06-02', actual: 132, predicted: 128 },
    { date: '2023-06-03', actual: 145, predicted: 140 },
    { date: '2023-06-04', actual: 140, predicted: 142 },
    { date: '2023-06-05', actual: 155, predicted: 150 },
    { date: '2023-06-06', actual: 162, predicted: 158 },
    { date: '2023-06-07', actual: 170, predicted: 165 },
  ];

  const mockMetrics = [
    { metric: 'MAE', value: 4.2 },
    { metric: 'RMSE', value: 5.7 },
    { metric: 'MAPE', value: 3.8 },
    { metric: 'R²', value: 0.92 },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleModelSelect = (model: any) => {
    setSelectedModel(model);
    
    // Generate mock feature importance data
    if (model) {
      const features = ['Feature A', 'Feature B', 'Feature C', 'Feature D', 'Feature E'];
      const mockImportance = features.map(feature => ({
        feature,
        importance: Math.random(),
      }));
      mockImportance.sort((a: any, b: any) => b.importance - a.importance);
      setFeatureImportance(mockImportance);
    } else {
      setFeatureImportance([]);
    }
  };

  const modelColumns = [
    { id: 'name', label: 'Model Name', minWidth: 170 },
    { id: 'type', label: 'Type', minWidth: 100 },
    { 
      id: 'accuracy', 
      label: 'Accuracy', 
      minWidth: 100, 
      align: 'right' as const,
      format: (value: number) => value.toFixed(2),
    },
    { id: 'lastTrained', label: 'Last Trained', minWidth: 120 },
    { id: 'status', label: 'Status', minWidth: 100 },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Machine Learning Models
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Models
          </Typography>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <DataTable
              columns={modelColumns}
              data={models}
              onRowClick={handleModelSelect}
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="model details tabs">
                <Tab label="Predictions" />
                <Tab label="Metrics" />
                <Tab label="Feature Importance" />
              </Tabs>
            </Box>
            
            <TabPanel value={tabValue} index={0}>
              {selectedModel ? (
                <LineChart
                  data={mockPredictions}
                  xKey="date"
                  yKeys={[
                    { key: 'actual', name: 'Actual', color: '#2196f3' },
                    { key: 'predicted', name: 'Predicted', color: '#ff9800' },
                  ]}
                  title={`${selectedModel.name} - Predictions`}
                  height={400}
                />
              ) : (
                <Typography variant="body1" sx={{ p: 2 }}>
                  Select a model to view predictions
                </Typography>
              )}
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              {selectedModel ? (
                <BarChart
                  data={mockMetrics}
                  xKey="metric"
                  yKeys={[
                    { key: 'value', name: 'Value', color: '#4caf50' },
                  ]}
                  title={`${selectedModel.name} - Metrics`}
                  height={400}
                />
              ) : (
                <Typography variant="body1" sx={{ p: 2 }}>
                  Select a model to view metrics
                </Typography>
              )}
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              {selectedModel ? (
                <BarChart
                  data={featureImportance}
                  xKey="feature"
                  yKeys={[
                    { key: 'importance', name: 'Importance', color: '#9c27b0' },
                  ]}
                  title={`${selectedModel.name} - Feature Importance`}
                  height={400}
                  layout="horizontal"
                />
              ) : (
                <Typography variant="body1" sx={{ p: 2 }}>
                  Select a model to view feature importance
                </Typography>
              )}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MLModels; 