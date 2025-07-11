import React from 'react';
import { Grid, Box, useTheme, useMediaQuery } from '@mui/material';

interface GridItemProps {
  children: React.ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  isFullHeight?: boolean;
  className?: string;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

const GridItem: React.FC<GridItemProps> = ({
  children,
  xs = 12,
  sm,
  md,
  lg,
  xl,
  height,
  minHeight = '100px',
  maxHeight,
  isFullHeight = false,
  className,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...rest
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));

  // Adjust grid sizes based on screen size
  const gridSizes = {
    xs,
    sm: sm || (isMobile ? 12 : xs),
    md: md || (isMedium ? sm || xs : xs),
    lg,
    xl,
  };

  return (
    <Grid item {...gridSizes} {...rest}>
      <Box
        className={className}
        id={id}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        sx={{
          height: isFullHeight ? '100%' : height,
          minHeight,
          maxHeight,
        }}
      >
        {children}
      </Box>
    </Grid>
  );
};

export default GridItem; 