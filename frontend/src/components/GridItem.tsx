import React, { memo } from 'react';
import { Grid, Box, useTheme, useMediaQuery } from '@mui/material';

interface GridItemProps {
  children: React.ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  height?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  isAnimated?: boolean;
  animationDelay?: number;
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
  isAnimated = false,
  animationDelay = 0,
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

  // Dynamically adjust grid sizes based on screen size
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
          opacity: isAnimated ? 0 : 1,
          transform: isAnimated ? 'translateY(20px)' : 'translateY(0)',
          animation: isAnimated
            ? `fadeIn 0.5s ease-out ${animationDelay}s forwards`
            : 'none',
          '@keyframes fadeIn': {
            '0%': {
              opacity: 0,
              transform: 'translateY(20px)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
        }}
      >
        {children}
      </Box>
    </Grid>
  );
};

export default memo(GridItem); 