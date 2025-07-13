import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as PreviewIcon,
  BarChart as ChartIcon,
  TableChart as TableIcon,
  TrendingUp as TrendIcon,
} from '@mui/icons-material';
import { useNotifications } from '../contexts/NotificationContext';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'dashboard' | 'analytics' | 'summary';
  sections: string[];
  schedule?: string;
  recipients: string[];
}

interface ReportGeneratorProps {
  onGenerateReport?: (template: ReportTemplate) => void;
  onScheduleReport?: (template: ReportTemplate, schedule: string) => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  onGenerateReport,
  onScheduleReport,
}) => {
  const theme = useTheme();
  const { addNotification } = useNotifications();
  const [templates, setTemplates] = useState<ReportTemplate[]>([
    {
      id: '1',
      name: 'Monthly Sales Report',
      description: 'Comprehensive monthly sales analysis with charts and KPIs',
      type: 'dashboard',
      sections: ['Sales Overview', 'Top Products', 'Regional Performance', 'Trends'],
      recipients: ['sales@company.com', 'management@company.com'],
    },
    {
      id: '2',
      name: 'Weekly Analytics Summary',
      description: 'Weekly performance metrics and key insights',
      type: 'analytics',
      sections: ['KPIs', 'User Engagement', 'Conversion Rates'],
      schedule: 'weekly',
      recipients: ['analytics@company.com'],
    },
    {
      id: '3',
      name: 'Executive Dashboard',
      description: 'High-level executive summary with key metrics',
      type: 'summary',
      sections: ['Executive Summary', 'Financial Overview', 'Strategic Metrics'],
      recipients: ['executives@company.com'],
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReportTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'dashboard' as ReportTemplate['type'],
    sections: [] as string[],
    recipients: [] as string[],
    schedule: '',
  });

  const availableSections = [
    'Sales Overview',
    'Top Products',
    'Regional Performance',
    'Trends',
    'KPIs',
    'User Engagement',
    'Conversion Rates',
    'Executive Summary',
    'Financial Overview',
    'Strategic Metrics',
    'Customer Analytics',
    'Marketing Performance',
  ];

  const handleOpenDialog = (template?: ReportTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        description: template.description,
        type: template.type,
        sections: template.sections,
        recipients: template.recipients,
        schedule: template.schedule || '',
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        name: '',
        description: '',
        type: 'dashboard',
        sections: [],
        recipients: [],
        schedule: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTemplate(null);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.description) {
      addNotification('Please fill in all required fields', 'error');
      return;
    }

    if (editingTemplate) {
      const updatedTemplate = { ...editingTemplate, ...formData };
      setTemplates(templates.map(t => t.id === editingTemplate.id ? updatedTemplate : t));
      addNotification('Report template updated successfully', 'success');
    } else {
      const newTemplate: ReportTemplate = {
        ...formData,
        id: Date.now().toString(),
      };
      setTemplates([...templates, newTemplate]);
      addNotification('Report template created successfully', 'success');
    }

    handleCloseDialog();
  };

  const handleGenerateReport = (template: ReportTemplate) => {
    onGenerateReport?.(template);
    addNotification(`Generating ${template.name}...`, 'info');
    
    // Simulate report generation
    setTimeout(() => {
      addNotification(`${template.name} generated successfully!`, 'success');
    }, 2000);
  };

  const handleScheduleReport = (template: ReportTemplate) => {
    const schedule = prompt('Enter schedule (e.g., "weekly", "monthly", "daily"):');
    if (schedule) {
      const updatedTemplate = { ...template, schedule };
      setTemplates(templates.map(t => t.id === template.id ? updatedTemplate : t));
      onScheduleReport?.(template, schedule);
      addNotification(`Report scheduled for ${schedule} delivery`, 'success');
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    addNotification('Report template deleted successfully', 'success');
  };

  const getTypeIcon = (type: ReportTemplate['type']) => {
    switch (type) {
      case 'dashboard':
        return <ChartIcon />;
      case 'analytics':
        return <TrendIcon />;
      case 'summary':
        return <TableIcon />;
      default:
        return <ChartIcon />;
    }
  };

  const getTypeColor = (type: ReportTemplate['type']) => {
    switch (type) {
      case 'dashboard':
        return 'primary';
      case 'analytics':
        return 'secondary';
      case 'summary':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Report Generator
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Template
        </Button>
      </Box>

      <Grid container spacing={2}>
        {templates.map((template) => (
          <Grid item xs={12} md={6} lg={4} key={template.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getTypeIcon(template.type)}
                    <Typography variant="h6" component="div">
                      {template.name}
                    </Typography>
                  </Box>
                  <Chip
                    label={template.type}
                    color={getTypeColor(template.type) as any}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {template.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Sections:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {template.sections.map((section) => (
                      <Chip
                        key={section}
                        label={section}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                {template.schedule && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Schedule:
                    </Typography>
                    <Chip
                      label={template.schedule}
                      icon={<ScheduleIcon />}
                      size="small"
                      color="info"
                    />
                  </Box>
                )}

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Recipients:
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {template.recipients.join(', ')}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions>
                <Button
                  size="small"
                  startIcon={<PdfIcon />}
                  onClick={() => handleGenerateReport(template)}
                >
                  Generate
                </Button>
                <Button
                  size="small"
                  startIcon={<EmailIcon />}
                  onClick={() => handleScheduleReport(template)}
                >
                  Schedule
                </Button>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(template)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteTemplate(template.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Template Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTemplate ? 'Edit Report Template' : 'New Report Template'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Template Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ReportTemplate['type'] })}
                label="Report Type"
              >
                <MenuItem value="dashboard">Dashboard</MenuItem>
                <MenuItem value="analytics">Analytics</MenuItem>
                <MenuItem value="summary">Summary</MenuItem>
              </Select>
            </FormControl>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Sections to Include
              </Typography>
              <Grid container spacing={1}>
                {availableSections.map((section) => (
                  <Grid item xs={6} sm={4} key={section}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.sections.includes(section)}
                          onChange={(e) => {
                            const newSections = e.target.checked
                              ? [...formData.sections, section]
                              : formData.sections.filter(s => s !== section);
                            setFormData({ ...formData, sections: newSections });
                          }}
                          size="small"
                        />
                      }
                      label={section}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            <TextField
              label="Recipients (comma-separated emails)"
              value={formData.recipients.join(', ')}
              onChange={(e) => setFormData({ 
                ...formData, 
                recipients: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
              })}
              fullWidth
              placeholder="email1@company.com, email2@company.com"
            />

            <TextField
              label="Schedule (optional)"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              fullWidth
              placeholder="weekly, monthly, daily"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTemplate ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ReportGenerator; 