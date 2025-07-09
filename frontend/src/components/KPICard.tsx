import React, { memo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
} from '@mui/icons-material';

interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  comparisonPeriod?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon,
  trend,
  comparisonPeriod = 'vs last month',
}) => {
  const theme = useTheme();

  const getTrendIcon = () => {
    if (change === undefined) return null;
    
    if (change > 0) {
      return (
        <Tooltip title={`Increased by ${change.toFixed(1)}%`}>
          <TrendingUpIcon 
            sx={{ 
              color: 'success.main', 
              fontSize: { xs: '1rem', sm: '1.25rem' },
              verticalAlign: 'middle'
            }} 
            aria-label="trend up" 
          />
        </Tooltip>
      );
    } else if (change < 0) {
      return (
        <Tooltip title={`Decreased by ${Math.abs(change).toFixed(1)}%`}>
          <TrendingDownIcon 
            sx={{ 
              color: 'error.main', 
              fontSize: { xs: '1rem', sm: '1.25rem' },
              verticalAlign: 'middle'
            }} 
            aria-label="trend down" 
          />
        </Tooltip>
      );
    }
    
    return (
      <Tooltip title="No change">
        <TrendingFlatIcon 
          sx={{ 
            color: 'text.secondary', 
            fontSize: { xs: '1rem', sm: '1.25rem' },
            verticalAlign: 'middle'
          }} 
          aria-label="no change" 
        />
      </Tooltip>
    );
  };

  const getChangeColor = () => {
    if (change === undefined) return 'text.secondary';
    return change > 0 ? 'success.main' : change < 0 ? 'error.main' : 'text.secondary';
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-4px)',
        },
        '&:after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          backgroundColor: change > 0 ? 'success.main' : change < 0 ? 'error.main' : 'primary.main',
          opacity: 0,
          transition: 'opacity 0.3s ease-in-out',
        },
        '&:hover:after': {
          opacity: 1,
        }
      }}
      aria-label={`${title}: ${value}${change !== undefined ? `, ${change > 0 ? 'up' : 'down'} ${Math.abs(change).toFixed(1)}%` : ''}`}
      tabIndex={0}
    >
      <CardContent 
        component="div"
        sx={{ 
          p: { xs: 2, sm: 3 },
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          '&:last-child': { pb: { xs: 2, sm: 3 } },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          mb: 2 
        }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            component="h3"
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {title}
          </Typography>
          {icon && (
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                color: 'white',
                '& > *': {
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }
              }}
              aria-hidden="true"
            >
              {icon}
            </Box>
          )}
        </Box>

        <Box>
          <Typography 
            variant="h4" 
            component="p"
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
              fontWeight: 700,
              mb: 1,
              lineHeight: 1.2
            }}
          >
            {value}
          </Typography>

          {change !== undefined && (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                flexWrap: 'wrap'
              }}
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {getTrendIcon()}
              <Typography 
                variant="body2" 
                color={getChangeColor()}
                component="span"
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                {change > 0 ? '+' : ''}{change?.toFixed(1)}%
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                component="span"
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  ml: 0.5
                }}
              >
                {comparisonPeriod}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default memo(KPICard); 