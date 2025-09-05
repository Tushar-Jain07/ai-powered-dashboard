import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Calculate,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  People,
  ShoppingCart,
  Assessment,
  Timeline,
  PieChart,
  BarChart,
  Save,
  Share,
  Download,
  Info,
  Lightbulb,
  Warning,
  CheckCircle,
  Business,
  Analytics,
  Psychology,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart as RechartsBarChart, Bar } from 'recharts';

interface CalculatorResult {
  value: number;
  breakdown: { label: string; value: number; color: string }[];
  insights: string[];
  recommendations: string[];
}

const BusinessTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [results, setResults] = useState<{ [key: string]: CalculatorResult }>({});
  const [savedCalculations, setSavedCalculations] = useState<any[]>([]);

  // ROI Calculator State
  const [roiInputs, setRoiInputs] = useState({
    initialInvestment: 10000,
    monthlyRevenue: 5000,
    monthlyExpenses: 2000,
    timePeriod: 12,
  });

  // Break-even Calculator State
  const [breakEvenInputs, setBreakEvenInputs] = useState({
    fixedCosts: 5000,
    variableCosts: 25,
    sellingPrice: 50,
    targetProfit: 2000,
  });

  // Customer Lifetime Value Calculator State
  const [clvInputs, setClvInputs] = useState({
    averageOrderValue: 100,
    purchaseFrequency: 4,
    customerLifespan: 3,
    grossMargin: 0.6,
    retentionRate: 0.8,
  });

  // Pricing Calculator State
  const [pricingInputs, setPricingInputs] = useState({
    costOfGoods: 30,
    desiredMargin: 0.4,
    competitorPrice: 50,
    marketPosition: 'premium',
  });

  const calculateROI = () => {
    const { initialInvestment, monthlyRevenue, monthlyExpenses, timePeriod } = roiInputs;
    const monthlyProfit = monthlyRevenue - monthlyExpenses;
    const totalProfit = monthlyProfit * timePeriod;
    const roi = ((totalProfit - initialInvestment) / initialInvestment) * 100;
    const paybackPeriod = initialInvestment / monthlyProfit;

    const breakdown = [
      { label: 'Initial Investment', value: initialInvestment, color: '#8884d8' },
      { label: 'Total Revenue', value: monthlyRevenue * timePeriod, color: '#82ca9d' },
      { label: 'Total Expenses', value: monthlyExpenses * timePeriod, color: '#ffc658' },
      { label: 'Net Profit', value: totalProfit, color: '#ff7300' },
    ];

    const insights = [
      `ROI: ${roi.toFixed(1)}% over ${timePeriod} months`,
      `Payback period: ${paybackPeriod.toFixed(1)} months`,
      `Monthly profit margin: ${((monthlyProfit / monthlyRevenue) * 100).toFixed(1)}%`,
    ];

    const recommendations = [];
    if (roi < 0) {
      recommendations.push('Consider reducing costs or increasing revenue');
      recommendations.push('Review pricing strategy');
    } else if (roi < 20) {
      recommendations.push('Good ROI, consider scaling up');
      recommendations.push('Look for cost optimization opportunities');
    } else {
      recommendations.push('Excellent ROI! Consider expanding');
      recommendations.push('Invest in growth initiatives');
    }

    return { value: roi, breakdown, insights, recommendations };
  };

  const calculateBreakEven = () => {
    const { fixedCosts, variableCosts, sellingPrice, targetProfit } = breakEvenInputs;
    const contributionMargin = sellingPrice - variableCosts;
    const breakEvenUnits = Math.ceil((fixedCosts + targetProfit) / contributionMargin);
    const breakEvenRevenue = breakEvenUnits * sellingPrice;

    const breakdown = [
      { label: 'Fixed Costs', value: fixedCosts, color: '#8884d8' },
      { label: 'Variable Costs', value: variableCosts * breakEvenUnits, color: '#82ca9d' },
      { label: 'Target Profit', value: targetProfit, color: '#ffc658' },
      { label: 'Total Revenue Needed', value: breakEvenRevenue, color: '#ff7300' },
    ];

    const insights = [
      `Break-even point: ${breakEvenUnits} units`,
      `Break-even revenue: $${breakEvenRevenue.toLocaleString()}`,
      `Contribution margin: $${contributionMargin} per unit`,
    ];

    const recommendations = [];
    if (contributionMargin < 0) {
      recommendations.push('Increase selling price or reduce variable costs');
      recommendations.push('Product is not profitable at current pricing');
    } else if (contributionMargin < sellingPrice * 0.3) {
      recommendations.push('Consider improving contribution margin');
      recommendations.push('Look for cost reduction opportunities');
    } else {
      recommendations.push('Good contribution margin');
      recommendations.push('Consider volume strategies to reduce fixed costs per unit');
    }

    return { value: breakEvenUnits, breakdown, insights, recommendations };
  };

  const calculateCLV = () => {
    const { averageOrderValue, purchaseFrequency, customerLifespan, grossMargin, retentionRate } = clvInputs;
    const annualValue = averageOrderValue * purchaseFrequency * grossMargin;
    const clv = annualValue * (customerLifespan * retentionRate);

    const breakdown = [
      { label: 'Average Order Value', value: averageOrderValue, color: '#8884d8' },
      { label: 'Annual Purchase Value', value: averageOrderValue * purchaseFrequency, color: '#82ca9d' },
      { label: 'Gross Margin Value', value: annualValue, color: '#ffc658' },
      { label: 'Customer Lifetime Value', value: clv, color: '#ff7300' },
    ];

    const insights = [
      `Customer Lifetime Value: $${clv.toFixed(2)}`,
      `Annual customer value: $${annualValue.toFixed(2)}`,
      `Retention impact: ${(retentionRate * 100).toFixed(1)}%`,
    ];

    const recommendations = [];
    if (clv < 100) {
      recommendations.push('Focus on increasing order value or frequency');
      recommendations.push('Improve customer retention strategies');
    } else if (clv < 500) {
      recommendations.push('Good CLV, focus on customer acquisition');
      recommendations.push('Consider loyalty programs');
    } else {
      recommendations.push('Excellent CLV! Invest in customer experience');
      recommendations.push('Consider premium service offerings');
    }

    return { value: clv, breakdown, insights, recommendations };
  };

  const calculatePricing = () => {
    const { costOfGoods, desiredMargin, competitorPrice, marketPosition } = pricingInputs;
    const costBasedPrice = costOfGoods / (1 - desiredMargin);
    const competitorBasedPrice = competitorPrice * (marketPosition === 'premium' ? 1.2 : marketPosition === 'budget' ? 0.8 : 1);
    const recommendedPrice = (costBasedPrice + competitorBasedPrice) / 2;

    const breakdown = [
      { label: 'Cost of Goods', value: costOfGoods, color: '#8884d8' },
      { label: 'Cost-Based Price', value: costBasedPrice, color: '#82ca9d' },
      { label: 'Competitor-Based Price', value: competitorBasedPrice, color: '#ffc658' },
      { label: 'Recommended Price', value: recommendedPrice, color: '#ff7300' },
    ];

    const insights = [
      `Recommended price: $${recommendedPrice.toFixed(2)}`,
      `Profit margin: ${(desiredMargin * 100).toFixed(1)}%`,
      `Market position: ${marketPosition}`,
    ];

    const recommendations = [];
    if (recommendedPrice < costOfGoods * 1.5) {
      recommendations.push('Consider increasing desired margin');
      recommendations.push('Review cost structure');
    } else if (recommendedPrice > competitorPrice * 1.5) {
      recommendations.push('Price may be too high for market');
      recommendations.push('Consider value proposition improvements');
    } else {
      recommendations.push('Price is well-positioned');
      recommendations.push('Monitor competitor pricing regularly');
    }

    return { value: recommendedPrice, breakdown, insights, recommendations };
  };

  const handleCalculate = (calculator: string) => {
    let result: CalculatorResult;
    
    switch (calculator) {
      case 'roi':
        result = calculateROI();
        break;
      case 'breakEven':
        result = calculateBreakEven();
        break;
      case 'clv':
        result = calculateCLV();
        break;
      case 'pricing':
        result = calculatePricing();
        break;
      default:
        return;
    }

    setResults(prev => ({ ...prev, [calculator]: result }));
  };

  const saveCalculation = (calculator: string, inputs: any, result: CalculatorResult) => {
    const savedCalc = {
      id: Date.now(),
      calculator,
      inputs,
      result,
      timestamp: new Date().toISOString(),
    };
    setSavedCalculations(prev => [savedCalc, ...prev]);
  };

  const ROI Calculator = () => (
    <Card>
      <CardHeader title="ROI Calculator" avatar={<TrendingUp />} />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Initial Investment ($)"
              type="number"
              value={roiInputs.initialInvestment}
              onChange={(e) => setRoiInputs(prev => ({ ...prev, initialInvestment: Number(e.target.value) }))}
            />
            <TextField
              fullWidth
              label="Monthly Revenue ($)"
              type="number"
              value={roiInputs.monthlyRevenue}
              onChange={(e) => setRoiInputs(prev => ({ ...prev, monthlyRevenue: Number(e.target.value) }))}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Monthly Expenses ($)"
              type="number"
              value={roiInputs.monthlyExpenses}
              onChange={(e) => setRoiInputs(prev => ({ ...prev, monthlyExpenses: Number(e.target.value) }))}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Time Period (months)"
              type="number"
              value={roiInputs.timePeriod}
              onChange={(e) => setRoiInputs(prev => ({ ...prev, timePeriod: Number(e.target.value) }))}
              sx={{ mt: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={<Calculate />}
              onClick={() => handleCalculate('roi')}
              sx={{ mt: 3 }}
            >
              Calculate ROI
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            {results.roi && (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="h6">
                    ROI: {results.roi.value.toFixed(1)}%
                  </Typography>
                </Alert>
                <Typography variant="subtitle1" gutterBottom>Insights:</Typography>
                {results.roi.insights.map((insight, index) => (
                  <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                    • {insight}
                  </Typography>
                ))}
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Recommendations:</Typography>
                {results.roi.recommendations.map((rec, index) => (
                  <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                    • {rec}
                  </Typography>
                ))}
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<Save />}
                    onClick={() => saveCalculation('roi', roiInputs, results.roi)}
                  >
                    Save
                  </Button>
                  <Button size="small" startIcon={<Share />}>Share</Button>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const BreakEvenCalculator = () => (
    <Card>
      <CardHeader title="Break-Even Calculator" avatar={<Assessment />} />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fixed Costs ($)"
              type="number"
              value={breakEvenInputs.fixedCosts}
              onChange={(e) => setBreakEvenInputs(prev => ({ ...prev, fixedCosts: Number(e.target.value) }))}
            />
            <TextField
              fullWidth
              label="Variable Costs per Unit ($)"
              type="number"
              value={breakEvenInputs.variableCosts}
              onChange={(e) => setBreakEvenInputs(prev => ({ ...prev, variableCosts: Number(e.target.value) }))}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Selling Price per Unit ($)"
              type="number"
              value={breakEvenInputs.sellingPrice}
              onChange={(e) => setBreakEvenInputs(prev => ({ ...prev, sellingPrice: Number(e.target.value) }))}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Target Profit ($)"
              type="number"
              value={breakEvenInputs.targetProfit}
              onChange={(e) => setBreakEvenInputs(prev => ({ ...prev, targetProfit: Number(e.target.value) }))}
              sx={{ mt: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={<Calculate />}
              onClick={() => handleCalculate('breakEven')}
              sx={{ mt: 3 }}
            >
              Calculate Break-Even
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            {results.breakEven && (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="h6">
                    Break-Even: {results.breakEven.value} units
                  </Typography>
                </Alert>
                <Typography variant="subtitle1" gutterBottom>Insights:</Typography>
                {results.breakEven.insights.map((insight, index) => (
                  <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                    • {insight}
                  </Typography>
                ))}
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Recommendations:</Typography>
                {results.breakEven.recommendations.map((rec, index) => (
                  <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                    • {rec}
                  </Typography>
                ))}
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<Save />}
                    onClick={() => saveCalculation('breakEven', breakEvenInputs, results.breakEven)}
                  >
                    Save
                  </Button>
                  <Button size="small" startIcon={<Share />}>Share</Button>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const CLVCalculator = () => (
    <Card>
      <CardHeader title="Customer Lifetime Value Calculator" avatar={<People />} />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Average Order Value ($)"
              type="number"
              value={clvInputs.averageOrderValue}
              onChange={(e) => setClvInputs(prev => ({ ...prev, averageOrderValue: Number(e.target.value) }))}
            />
            <TextField
              fullWidth
              label="Purchase Frequency (per year)"
              type="number"
              value={clvInputs.purchaseFrequency}
              onChange={(e) => setClvInputs(prev => ({ ...prev, purchaseFrequency: Number(e.target.value) }))}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Customer Lifespan (years)"
              type="number"
              value={clvInputs.customerLifespan}
              onChange={(e) => setClvInputs(prev => ({ ...prev, customerLifespan: Number(e.target.value) }))}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Gross Margin (%)"
              type="number"
              value={clvInputs.grossMargin * 100}
              onChange={(e) => setClvInputs(prev => ({ ...prev, grossMargin: Number(e.target.value) / 100 }))}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Retention Rate (%)"
              type="number"
              value={clvInputs.retentionRate * 100}
              onChange={(e) => setClvInputs(prev => ({ ...prev, retentionRate: Number(e.target.value) / 100 }))}
              sx={{ mt: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={<Calculate />}
              onClick={() => handleCalculate('clv')}
              sx={{ mt: 3 }}
            >
              Calculate CLV
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            {results.clv && (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="h6">
                    CLV: ${results.clv.value.toFixed(2)}
                  </Typography>
                </Alert>
                <Typography variant="subtitle1" gutterBottom>Insights:</Typography>
                {results.clv.insights.map((insight, index) => (
                  <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                    • {insight}
                  </Typography>
                ))}
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Recommendations:</Typography>
                {results.clv.recommendations.map((rec, index) => (
                  <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                    • {rec}
                  </Typography>
                ))}
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<Save />}
                    onClick={() => saveCalculation('clv', clvInputs, results.clv)}
                  >
                    Save
                  </Button>
                  <Button size="small" startIcon={<Share />}>Share</Button>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const PricingCalculator = () => (
    <Card>
      <CardHeader title="Pricing Strategy Calculator" avatar={<AttachMoney />} />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Cost of Goods ($)"
              type="number"
              value={pricingInputs.costOfGoods}
              onChange={(e) => setPricingInputs(prev => ({ ...prev, costOfGoods: Number(e.target.value) }))}
            />
            <TextField
              fullWidth
              label="Desired Margin (%)"
              type="number"
              value={pricingInputs.desiredMargin * 100}
              onChange={(e) => setPricingInputs(prev => ({ ...prev, desiredMargin: Number(e.target.value) / 100 }))}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Competitor Price ($)"
              type="number"
              value={pricingInputs.competitorPrice}
              onChange={(e) => setPricingInputs(prev => ({ ...prev, competitorPrice: Number(e.target.value) }))}
              sx={{ mt: 2 }}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Market Position</InputLabel>
              <Select
                value={pricingInputs.marketPosition}
                onChange={(e) => setPricingInputs(prev => ({ ...prev, marketPosition: e.target.value }))}
                label="Market Position"
              >
                <MenuItem value="budget">Budget</MenuItem>
                <MenuItem value="standard">Standard</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
              </Select>
            </FormControl>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Calculate />}
              onClick={() => handleCalculate('pricing')}
              sx={{ mt: 3 }}
            >
              Calculate Pricing
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            {results.pricing && (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="h6">
                    Recommended Price: ${results.pricing.value.toFixed(2)}
                  </Typography>
                </Alert>
                <Typography variant="subtitle1" gutterBottom>Insights:</Typography>
                {results.pricing.insights.map((insight, index) => (
                  <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                    • {insight}
                  </Typography>
                ))}
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Recommendations:</Typography>
                {results.pricing.recommendations.map((rec, index) => (
                  <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                    • {rec}
                  </Typography>
                ))}
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<Save />}
                    onClick={() => saveCalculation('pricing', pricingInputs, results.pricing)}
                  >
                    Save
                  </Button>
                  <Button size="small" startIcon={<Share />}>Share</Button>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Business Tools & Calculators
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Essential calculators for data-driven business decisions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Download />}>
            Export All
          </Button>
          <Button variant="contained" startIcon={<Save />}>
            Save Session
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab icon={<TrendingUp />} label="ROI Calculator" />
          <Tab icon={<Assessment />} label="Break-Even" />
          <Tab icon={<People />} label="Customer CLV" />
          <Tab icon={<AttachMoney />} label="Pricing Strategy" />
          <Tab icon={<Save />} label="Saved Calculations" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && <ROI Calculator />}
      {activeTab === 1 && <BreakEvenCalculator />}
      {activeTab === 2 && <CLVCalculator />}
      {activeTab === 3 && <PricingCalculator />}
      {activeTab === 4 && (
        <Card>
          <CardHeader title="Saved Calculations" />
          <CardContent>
            {savedCalculations.length === 0 ? (
              <Alert severity="info">
                No saved calculations yet. Use the calculators above and save your results.
              </Alert>
            ) : (
              <List>
                {savedCalculations.map((calc) => (
                  <ListItem key={calc.id} divider>
                    <ListItemIcon>
                      <Calculate />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${calc.calculator} - ${new Date(calc.timestamp).toLocaleDateString()}`}
                      secondary={`Result: ${calc.result.value.toFixed(2)}`}
                    />
                    <Button size="small" startIcon={<Share />}>Share</Button>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Tips */}
      <Card sx={{ mt: 3 }}>
        <CardHeader title="Quick Business Tips" avatar={<Lightbulb />} />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Alert severity="info" icon={<TrendingUp />}>
                <Typography variant="subtitle2">ROI Optimization</Typography>
                <Typography variant="body2">
                  Aim for ROI above 20% for sustainable growth. Consider both short-term and long-term returns.
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={4}>
              <Alert severity="warning" icon={<Assessment />}>
                <Typography variant="subtitle2">Break-Even Strategy</Typography>
                <Typography variant="body2">
                  Lower your break-even point by reducing fixed costs or increasing contribution margin.
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={4}>
              <Alert severity="success" icon={<People />}>
                <Typography variant="subtitle2">Customer Value</Typography>
                <Typography variant="body2">
                  Focus on increasing CLV through better retention, higher order values, and more frequent purchases.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BusinessTools;
