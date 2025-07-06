import React from 'react';
import { Grid } from '@mui/material';

interface GridItemProps {
  children: React.ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  [key: string]: any;
}

// This component is a workaround for TypeScript errors with Grid item
const GridItem: React.FC<GridItemProps> = ({ children, ...props }) => {
  return <Grid item {...props}>{children}</Grid>;
};

export default GridItem; 