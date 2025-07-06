import React, { useState } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import DataTable from '../components/DataTable';
import KPICard from '../components/KPICard';
import Widget from '../components/Widget';

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // Mock data
  const reports = [
    {
      id: '1',
      name: 'Monthly Sales Report',
      type: 'Sales',
      lastGenerated: '2023-05-15',
      status: 'Generated',
    },
    {
      id: '2',
      name: 'Customer Analytics',
      type: 'Analytics',
      lastGenerated: '2023-05-14',
      status: 'Generated',
    },
    {
      id: '3',
      name: 'Product Performance',
      type: 'Performance',
      lastGenerated: '2023-05-10',
      status: 'Pending',
    },
  ];

  const mockSalesData = [
    { month: 'Jan', sales: 12000, target: 10000 },
    { month: 'Feb', sales: 15000, target: 12000 },
    { month: 'Mar', sales: 18000, target: 15000 },
    { month: 'Apr', sales: 22000, target: 18000 },
    { month: 'May', sales: 25000, target: 20000 },
    { month: 'Jun', sales: 28000, target: 22000 },
  ];

  const mockCustomerData = [
    { name: 'New', value: 150 },
    { name: 'Returning', value: 250 },
    { name: 'Loyal', value: 100 },
  ];

  const mockProductData = [
    { product: 'Product A', sales: 5000, revenue: 25000 },
    { product: 'Product B', sales: 3500, revenue: 17500 },
    { product: 'Product C', sales: 4200, revenue: 21000 },
    { product: 'Product D', sales: 2800, revenue: 14000 },
    { product: 'Product E', sales: 3200, revenue: 16000 },
  ];

  const reportColumns = [
    { id: 'name', label: 'Report Name', minWidth: 170 },
    { id: 'type', label: 'Type', minWidth: 100 },
    { id: 'lastGenerated', label: 'Last Generated', minWidth: 120 },
    { id: 'status', label: 'Status', minWidth: 100 },
  ];

  const handleReportSelect = (report: any) => {
    setSelectedReport(report);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Available Reports
          </Typography>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <DataTable
              columns={reportColumns}
              data={reports}
              onRowClick={handleReportSelect}
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          {selectedReport ? (
            <>
              <Typography variant="h5" gutterBottom>
                {selectedReport.name}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <KPICard
                    title="Total Sales"
                    value="$125,000"
                    trend={12.5}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <KPICard
                    title="Orders"
                    value="1,250"
                    trend={8.3}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <KPICard
                    title="Customers"
                    value="500"
                    trend={15.2}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <KPICard
                    title="Conversion Rate"
                    value="3.2%"
                    trend={-0.5}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Widget
                    id="sales-trend"
                    title="Sales Trend vs Target"
                    loading={false}
                  >
                    <LineChart
                      data={mockSalesData}
                      xKey="month"
                      yKeys={[
                        { key: 'sales', name: 'Sales', color: '#2196f3' },
                        { key: 'target', name: 'Target', color: '#ff9800' },
                      ]}
                      height={300}
                    />
                  </Widget>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Widget
                    id="customer-distribution"
                    title="Customer Distribution"
                    loading={false}
                  >
                    <PieChart
                      data={mockCustomerData}
                      height={300}
                    />
                  </Widget>
                </Grid>
                
                <Grid item xs={12}>
                  <Widget
                    id="product-performance"
                    title="Product Performance"
                    loading={false}
                  >
                    <BarChart
                      data={mockProductData}
                      xKey="product"
                      yKeys={[
                        { key: 'sales', name: 'Sales', color: '#4caf50' },
                        { key: 'revenue', name: 'Revenue', color: '#9c27b0' },
                      ]}
                      height={300}
                    />
                  </Widget>
                </Grid>
              </Grid>
            </>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Select a report to view details
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports; 