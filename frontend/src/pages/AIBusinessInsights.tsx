import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Chip,
  LinearProgress,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Insights,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Info,
  Lightbulb,
  Analytics,
  Assessment,
  Timeline,
  ExpandMore,
  Send,
  Refresh,
  Download,
  Share,
  Star,
  StarBorder,
  Chat,
  AutoAwesome,
  Psychology,
  Business,
  AttachMoney,
  People,
  ShoppingCart,
} from '@mui/icons-material';

interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'trend' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  category: string;
  actionItems: string[];
  expectedOutcome: string;
  timeframe: string;
  priority: number;
  tags: string[];
  createdAt: string;
  isFavorite: boolean;
}

const AIBusinessInsights: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [filteredInsights, setFilteredInsights] = useState<AIInsight[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImpact, setSelectedImpact] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  // Mock AI insights data
  const mockInsights: AIInsight[] = [
    {
      id: '1',
      type: 'opportunity',
      title: 'Revenue Growth Opportunity in Electronics',
      description: 'Analysis shows electronics category has 23% higher conversion rate and 15% higher average order value. Market research indicates growing demand for smart home devices.',
      impact: 'high',
      confidence: 87,
      category: 'Sales',
      actionItems: [
        'Increase electronics inventory by 30%',
        'Launch targeted marketing campaign for smart home products',
        'Partner with electronics suppliers for better pricing',
        'Create electronics-focused landing pages'
      ],
      expectedOutcome: 'Expected 25-30% revenue increase in electronics category within 3 months',
      timeframe: '3 months',
      priority: 1,
      tags: ['electronics', 'revenue', 'conversion', 'inventory'],
      createdAt: '2024-01-15',
      isFavorite: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Customer Retention Rate Declining',
      description: 'Customer retention rate dropped from 82% to 78% over the last quarter. Analysis shows increased churn in the 18-25 age group and customers with single purchases.',
      impact: 'high',
      confidence: 92,
      category: 'Customer',
      actionItems: [
        'Implement customer feedback survey system',
        'Create loyalty program for repeat customers',
        'Develop targeted re-engagement campaigns',
        'Improve customer support response time'
      ],
      expectedOutcome: 'Stabilize retention rate and improve to 80%+ within 6 months',
      timeframe: '6 months',
      priority: 1,
      tags: ['retention', 'churn', 'customer', 'loyalty'],
      createdAt: '2024-01-14',
      isFavorite: true,
    },
    {
      id: '3',
      type: 'trend',
      title: 'Seasonal Sales Pattern Detected',
      description: 'AI analysis reveals strong seasonal patterns in sales data. Q3 typically shows 18% increase in sales, with peak demand in August and September.',
      impact: 'medium',
      confidence: 78,
      category: 'Analytics',
      actionItems: [
        'Prepare inventory for Q3 demand surge',
        'Plan seasonal marketing campaigns',
        'Adjust staffing levels for peak season',
        'Set up automated inventory alerts'
      ],
      expectedOutcome: 'Optimize seasonal operations and capture maximum Q3 revenue',
      timeframe: '2 months',
      priority: 2,
      tags: ['seasonal', 'trends', 'inventory', 'planning'],
      createdAt: '2024-01-13',
      isFavorite: false,
    },
    {
      id: '4',
      type: 'recommendation',
      title: 'Optimize Checkout Process',
      description: 'Cart abandonment rate is 68%, which is 12% higher than industry average. Analysis shows most users abandon at payment step due to limited payment options.',
      impact: 'medium',
      confidence: 85,
      category: 'UX',
      actionItems: [
        'Add more payment options (PayPal, Apple Pay, Google Pay)',
        'Implement guest checkout option',
        'Add progress indicators during checkout',
        'Optimize mobile checkout experience'
      ],
      expectedOutcome: 'Reduce cart abandonment by 15-20% and increase conversions',
      timeframe: '1 month',
      priority: 2,
      tags: ['checkout', 'conversion', 'ux', 'payments'],
      createdAt: '2024-01-12',
      isFavorite: false,
    },
    {
      id: '5',
      type: 'opportunity',
      title: 'Untapped Market Segment',
      description: 'Analysis reveals 35% of website traffic comes from mobile users, but mobile conversion rate is only 1.8% vs 3.2% on desktop. Mobile optimization opportunity identified.',
      impact: 'high',
      confidence: 90,
      category: 'Mobile',
      actionItems: [
        'Optimize mobile site performance and loading speed',
        'Improve mobile navigation and user experience',
        'Implement mobile-specific promotions',
        'Add mobile app development to roadmap'
      ],
      expectedOutcome: 'Increase mobile conversion rate to 2.5%+ and capture mobile market',
      timeframe: '4 months',
      priority: 1,
      tags: ['mobile', 'conversion', 'optimization', 'market'],
      createdAt: '2024-01-11',
      isFavorite: true,
    },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setInsights(mockInsights);
      setFilteredInsights(mockInsights);
      setIsLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    let filtered = insights;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(insight => insight.category === selectedCategory);
    }

    if (selectedImpact !== 'all') {
      filtered = filtered.filter(insight => insight.impact === selectedImpact);
    }

    if (searchQuery) {
      filtered = filtered.filter(insight =>
        insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        insight.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        insight.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredInsights(filtered);
  }, [insights, selectedCategory, selectedImpact, searchQuery]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp color="success" />;
      case 'warning': return <Warning color="warning" />;
      case 'trend': return <Timeline color="info" />;
      case 'recommendation': return <Lightbulb color="primary" />;
      default: return <Insights />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const toggleFavorite = (insightId: string) => {
    setInsights(prev => prev.map(insight =>
      insight.id === insightId
        ? { ...insight, isFavorite: !insight.isFavorite }
        : insight
    ));
  };

  const InsightCard = ({ insight }: { insight: AIInsight }) => (
    <Card sx={{ mb: 2, position: 'relative' }}>
      <CardHeader
        avatar={getInsightIcon(insight.type)}
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">{insight.title}</Typography>
            <IconButton
              size="small"
              onClick={() => toggleFavorite(insight.id)}
              color={insight.isFavorite ? 'warning' : 'default'}
            >
              {insight.isFavorite ? <Star /> : <StarBorder />}
            </IconButton>
          </Box>
        }
        subheader={
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Chip label={insight.category} size="small" variant="outlined" />
            <Chip 
              label={insight.impact} 
              size="small" 
              color={getImpactColor(insight.impact)}
            />
            <Chip 
              label={`${insight.confidence}% confidence`} 
              size="small" 
              color={insight.confidence > 80 ? 'success' : 'warning'}
            />
          </Box>
        }
        action={
          <Box>
            <IconButton onClick={() => setSelectedInsight(insight)}>
              <Assessment />
            </IconButton>
            <IconButton onClick={() => setChatDialogOpen(true)}>
              <Chat />
            </IconButton>
          </Box>
        }
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {insight.description}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Action Items:</Typography>
          <List dense>
            {insight.actionItems.slice(0, 2).map((item, index) => (
              <ListItem key={index} sx={{ py: 0 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircle fontSize="small" color="success" />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
            {insight.actionItems.length > 2 && (
              <ListItem sx={{ py: 0 }}>
                <ListItemText 
                  primary={`+${insight.actionItems.length - 2} more items`}
                  primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                />
              </ListItem>
            )}
          </List>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Expected: {insight.expectedOutcome}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Timeframe: {insight.timeframe}
          </Typography>
        </Box>

        <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {insight.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Loading AI Insights...</Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            AI Business Insights
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Intelligent recommendations powered by machine learning
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Refresh />}>
            Refresh
          </Button>
          <Button variant="outlined" startIcon={<Download />}>
            Export
          </Button>
          <Button variant="contained" startIcon={<AutoAwesome />}>
            Generate New Insights
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Psychology sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Customer">Customer</MenuItem>
                  <MenuItem value="Analytics">Analytics</MenuItem>
                  <MenuItem value="UX">UX</MenuItem>
                  <MenuItem value="Mobile">Mobile</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Impact</InputLabel>
                <Select
                  value={selectedImpact}
                  onChange={(e) => setSelectedImpact(e.target.value)}
                  label="Impact"
                >
                  <MenuItem value="all">All Impact Levels</MenuItem>
                  <MenuItem value="high">High Impact</MenuItem>
                  <MenuItem value="medium">Medium Impact</MenuItem>
                  <MenuItem value="low">Low Impact</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedImpact('all');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Insights Summary */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {filteredInsights.filter(i => i.type === 'opportunity').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Opportunities
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Warning sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {filteredInsights.filter(i => i.type === 'warning').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Warnings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Timeline sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {filteredInsights.filter(i => i.type === 'trend').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Trends
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Lightbulb sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {filteredInsights.filter(i => i.type === 'recommendation').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recommendations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Insights List */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          {filteredInsights.length === 0 ? (
            <Alert severity="info">
              No insights found matching your criteria. Try adjusting your filters.
            </Alert>
          ) : (
            filteredInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))
          )}
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Card>
            <CardHeader title="AI Insights Summary" />
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Based on your business data, AI has identified key opportunities and risks:
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>High Priority Actions:</Typography>
                <List dense>
                  <ListItem sx={{ py: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <AttachMoney color="success" />
                    </ListItemIcon>
                    <ListItemText primary="Optimize electronics category" />
                  </ListItem>
                  <ListItem sx={{ py: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <People color="warning" />
                    </ListItemIcon>
                    <ListItemText primary="Improve customer retention" />
                  </ListItem>
                  <ListItem sx={{ py: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <ShoppingCart color="info" />
                    </ListItemIcon>
                    <ListItemText primary="Reduce cart abandonment" />
                  </ListItem>
                </List>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="subtitle2" gutterBottom>AI Confidence Score:</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={85} 
                  color="success" 
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  85% confidence in current insights
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Insight Detail Dialog */}
      <Dialog 
        open={!!selectedInsight} 
        onClose={() => setSelectedInsight(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedInsight && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getInsightIcon(selectedInsight.type)}
                {selectedInsight.title}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {selectedInsight.description}
              </Typography>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">Action Items</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedInsight.actionItems.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircle color="success" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">Expected Outcome</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    {selectedInsight.expectedOutcome}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedInsight(null)}>Close</Button>
              <Button variant="contained" startIcon={<Share />}>
                Share Insight
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* AI Chat Dialog */}
      <Dialog 
        open={chatDialogOpen} 
        onClose={() => setChatDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Ask AI About This Insight</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Ask AI to explain this insight in more detail or suggest additional actions..."
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChatDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<Send />}>
            Ask AI
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AIBusinessInsights;
