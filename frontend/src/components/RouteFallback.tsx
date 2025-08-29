import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const RouteFallback: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 2 }}>
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">Loading page…</Typography>
    </Box>
  );
};

export default RouteFallback;


