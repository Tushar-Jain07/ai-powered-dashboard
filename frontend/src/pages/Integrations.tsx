import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardHeader, CardContent, Button, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress, Alert } from '@mui/material';
import { Cloud, IntegrationInstructions, Storage, CloudUpload, Link as LinkIcon, CheckCircle, ErrorOutline } from '@mui/icons-material';

const connectors = [
  { id: 'csv', name: 'CSV / Excel', icon: <CloudUpload color="primary" />, description: 'Upload CSV or Excel files to import data.' },
  { id: 'mongodb', name: 'MongoDB', icon: <Storage color="secondary" />, description: 'Connect a MongoDB database.' },
  { id: 'rest', name: 'REST API', icon: <IntegrationInstructions color="info" />, description: 'Pull data from any REST endpoint.' },
  { id: 'google-sheets', name: 'Google Sheets', icon: <Cloud color="success" />, description: 'Sync a Google Sheet to your dashboard.' },
];

const Integrations: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const openConfig = (id: string) => {
    setSelected(id);
    setStatus('idle');
    setConfigOpen(true);
  };

  const connect = async () => {
    setIsConnecting(true);
    setStatus('idle');
    setTimeout(() => {
      setIsConnecting(false);
      setStatus('success');
    }, 1200);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Integrations</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Connect external data sources to power your Business Intelligence.
      </Typography>

      <Grid container spacing={3}>
        {connectors.map((c) => (
          <Grid item xs={12} sm={6} md={3} key={c.id}>
            <Card>
              <CardHeader avatar={c.icon} title={c.name} subheader={c.description} />
              <CardContent>
                <Button fullWidth variant="contained" onClick={() => openConfig(c.id)}>
                  Configure
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={configOpen} onClose={() => setConfigOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Configure {selected}</DialogTitle>
        <DialogContent>
          {isConnecting && <LinearProgress sx={{ mb: 2 }} />}
          {status === 'success' && (
            <Alert icon={<CheckCircle fontSize="inherit" />} severity="success" sx={{ mb: 2 }}>
              Connected successfully! Data will sync periodically.
            </Alert>
          )}
          {status === 'error' && (
            <Alert icon={<ErrorOutline fontSize="inherit" />} severity="error" sx={{ mb: 2 }}>
              Connection failed. Please verify your credentials.
            </Alert>
          )}

          {selected === 'csv' && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Upload CSV/Excel</Typography>
              <Button variant="outlined" component="label">
                Upload File
                <input hidden type="file" accept=".csv,.xlsx" />
              </Button>
            </Box>
          )}

          {selected === 'mongodb' && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>MongoDB Connection</Typography>
              <TextField fullWidth label="MongoDB URI" placeholder="mongodb+srv://user:pass@cluster/db" sx={{ mb: 2 }} />
              <TextField fullWidth label="Database" sx={{ mb: 2 }} />
              <TextField fullWidth label="Collection" />
            </Box>
          )}

          {selected === 'rest' && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>REST API</Typography>
              <TextField fullWidth label="Endpoint URL" placeholder="https://api.example.com/data" sx={{ mb: 2 }} />
              <TextField fullWidth label="API Key (optional)" sx={{ mb: 2 }} />
              <TextField fullWidth label="Polling Interval (mins)" type="number" />
            </Box>
          )}

          {selected === 'google-sheets' && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Google Sheets</Typography>
              <TextField fullWidth label="Sheet URL" placeholder="https://docs.google.com/spreadsheets/..." sx={{ mb: 2 }} />
              <TextField fullWidth label="Range (e.g., Sheet1!A:D)" />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigOpen(false)}>Close</Button>
          <Button variant="contained" onClick={connect} disabled={isConnecting}>Connect</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Active Integrations</Typography>
        <Chip label="Demo: Google Sheets (every 30 mins)" color="success" sx={{ mr: 1, mb: 1 }} />
        <Chip label="Demo: REST API (hourly)" color="info" sx={{ mr: 1, mb: 1 }} />
      </Box>
    </Box>
  );
};

export default Integrations;


