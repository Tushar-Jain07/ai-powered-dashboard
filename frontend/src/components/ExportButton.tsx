import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Box,
  Typography,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  FileDownload as FileDownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Description as CsvIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNotifications } from '../contexts/NotificationContext';

interface ExportButtonProps {
  data: any[];
  filename?: string;
  title?: string;
  onExport?: (format: string, options: ExportOptions) => void;
}

interface ExportOptions {
  format: string;
  includeHeaders: boolean;
  dateFormat: string;
  timezone: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename = 'export',
  title = 'Export Data',
  onExport,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includeHeaders: true,
    dateFormat: 'YYYY-MM-DD',
    timezone: 'UTC',
  });

  const { addNotification } = useNotifications();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format: string) => {
    setExportOptions(prev => ({ ...prev, format }));
    setDialogOpen(true);
    handleClose();
  };

  const handleConfirmExport = async () => {
    setExporting(true);
    
    try {
      if (onExport) {
        await onExport(exportOptions.format, exportOptions);
      } else {
        // Default export functionality
        await performExport();
      }
      
      addNotification('Export completed successfully!', 'success');
    } catch (error) {
      addNotification('Export failed. Please try again.', 'error');
    } finally {
      setExporting(false);
      setDialogOpen(false);
    }
  };

  const performExport = async () => {
    const { format, includeHeaders } = exportOptions;
    
    let content = '';
    let mimeType = '';
    let fileExtension = '';

    switch (format) {
      case 'csv':
        content = convertToCSV(data, includeHeaders);
        mimeType = 'text/csv';
        fileExtension = 'csv';
        break;
      case 'excel':
        content = convertToExcel(data, includeHeaders);
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        fileExtension = 'xlsx';
        break;
      case 'pdf':
        content = convertToPDF(data, includeHeaders);
        mimeType = 'application/pdf';
        fileExtension = 'pdf';
        break;
      default:
        content = convertToCSV(data, includeHeaders);
        mimeType = 'text/csv';
        fileExtension = 'csv';
    }

    downloadFile(content, `${filename}.${fileExtension}`, mimeType);
  };

  const convertToCSV = (data: any[], includeHeaders: boolean): string => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    let csv = '';
    
    if (includeHeaders) {
      csv += headers.join(',') + '\n';
    }
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      });
      csv += values.join(',') + '\n';
    });
    
    return csv;
  };

  const convertToExcel = (data: any[], includeHeaders: boolean): string => {
    // Simplified Excel export - in a real app, you'd use a library like xlsx
    return convertToCSV(data, includeHeaders);
  };

  const convertToPDF = (data: any[], includeHeaders: boolean): string => {
    // Simplified PDF export - in a real app, you'd use a library like jsPDF
    return convertToCSV(data, includeHeaders);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportFormats = [
    { key: 'csv', label: 'CSV', icon: <CsvIcon /> },
    { key: 'excel', label: 'Excel', icon: <ExcelIcon /> },
    { key: 'pdf', label: 'PDF', icon: <PdfIcon /> },
  ];

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FileDownloadIcon />}
        onClick={handleClick}
        disabled={!data.length}
      >
        Export
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {exportFormats.map((format) => (
          <MenuItem
            key={format.key}
            onClick={() => handleExport(format.key)}
          >
            <ListItemIcon>{format.icon}</ListItemIcon>
            <ListItemText>{format.label}</ListItemText>
          </MenuItem>
        ))}
        <MenuItem onClick={() => handleExport('custom')}>
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText>Custom Export</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {title}
            <Button
              onClick={() => setDialogOpen(false)}
              disabled={exporting}
              startIcon={<CloseIcon />}
            >
              Close
            </Button>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Export {data.length} records
            </Typography>
            <Chip label={`${data.length} items`} size="small" />
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Format</InputLabel>
            <Select
              value={exportOptions.format}
              label="Format"
              onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value }))}
            >
              {exportFormats.map((format) => (
                <MenuItem key={format.key} value={format.key}>
                  {format.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Filename"
            value={filename}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: <Typography variant="caption">.{exportOptions.format}</Typography>,
            }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Date Format</InputLabel>
            <Select
              value={exportOptions.dateFormat}
              label="Date Format"
              onChange={(e) => setExportOptions(prev => ({ ...prev, dateFormat: e.target.value }))}
            >
              <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
              <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
              <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
              <MenuItem value="YYYY-MM-DD HH:mm:ss">YYYY-MM-DD HH:mm:ss</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Timezone</InputLabel>
            <Select
              value={exportOptions.timezone}
              label="Timezone"
              onChange={(e) => setExportOptions(prev => ({ ...prev, timezone: e.target.value }))}
            >
              <MenuItem value="UTC">UTC</MenuItem>
              <MenuItem value="America/New_York">Eastern Time</MenuItem>
              <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
              <MenuItem value="Europe/London">London</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={exporting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmExport}
            variant="contained"
            disabled={exporting}
            startIcon={exporting ? <CircularProgress size={16} /> : <FileDownloadIcon />}
          >
            {exporting ? 'Exporting...' : 'Export'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExportButton; 