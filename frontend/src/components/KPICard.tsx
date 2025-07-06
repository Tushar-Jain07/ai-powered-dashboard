import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon,
  trend,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getTrendIcon = () => {
    if (!change) return null;
    
    if (change > 0) {
      return <TrendingUpIcon sx={{ color: 'success.main', fontSize: { xs: '1rem', sm: '1.25rem' } }} />;
    } else if (change < 0) {
      return <TrendingDownIcon sx={{ color: 'error.main', fontSize: { xs: '1rem', sm: '1.25rem' } }} />;
    }
    return null;
  };

  const getChangeColor = () => {
    if (!change) return 'text.secondary';
    return change > 0 ? 'success.main' : change < 0 ? 'error.main' : 'text.secondary';
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease-in-out',
        },
      }}
    >
      <CardContent sx={{ 
        p: { xs: 2, sm: 3 },
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
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
            <Box sx={{ 
              color: 'primary.main',
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
            }}>
              {icon}
            </Box>
          )}
        </Box>

        <Box>
          <Typography 
            variant="h4" 
            component="div"
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
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              flexWrap: 'wrap'
            }}>
              {getTrendIcon()}
              <Typography 
                variant="body2" 
                color={getChangeColor()}
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
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  ml: 0.5
                }}
              >
                vs last month
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default KPICard; 