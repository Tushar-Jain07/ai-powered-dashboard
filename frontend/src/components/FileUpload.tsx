import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  useTheme,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { formatBytes } from '../utils/formatters';

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  onUpload: (files: File[]) => Promise<void>;
  onDelete?: (file: File) => void;
  title?: string;
  description?: string;
  buttonText?: string;
}

interface FileWithStatus {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  multiple = false,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB default
  onUpload,
  onDelete,
  title = 'Upload Files',
  description = 'Drag and drop files here or click to browse',
  buttonText = 'Browse Files',
}) => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    addFiles(Array.from(selectedFiles));
    
    // Reset the input value so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addFiles = (newFiles: File[]) => {
    // Check if we're exceeding max files
    if (files.length + newFiles.length > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }

    // Filter out files that are too large
    const validFiles: FileWithStatus[] = [];
    const invalidFiles: File[] = [];

    newFiles.forEach(file => {
      if (file.size > maxSize) {
        invalidFiles.push(file);
      } else {
        validFiles.push({
          file,
          status: 'pending',
          progress: 0,
        });
      }
    });

    if (invalidFiles.length > 0) {
      alert(`The following files exceed the maximum size of ${formatBytes(maxSize)}:\n${invalidFiles.map(f => f.name).join('\n')}`);
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      addFiles(Array.from(event.dataTransfer.files));
    }
  };

  const handleDelete = (index: number) => {
    const fileToDelete = files[index];
    
    if (onDelete && fileToDelete) {
      onDelete(fileToDelete.file);
    }
    
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0 || uploading) return;
    
    setUploading(true);
    
    // Update all files to uploading status
    setFiles(prev => 
      prev.map(file => ({
        ...file,
        status: 'uploading',
      }))
    );

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setFiles(prev => 
          prev.map(file => ({
            ...file,
            progress: file.status === 'uploading' ? Math.min(file.progress + 10, 90) : file.progress,
          }))
        );
      }, 300);

      // Call the actual upload function
      await onUpload(files.map(f => f.file));
      
      clearInterval(progressInterval);
      
      // Update all files to success status
      setFiles(prev => 
        prev.map(file => ({
          ...file,
          status: 'success',
          progress: 100,
        }))
      );
    } catch (error: any) {
      // Update all files to error status
      setFiles(prev => 
        prev.map(file => ({
          ...file,
          status: 'error',
          error: error.message || 'Upload failed',
        }))
      );
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    // You can add more file type icons based on extensions
    switch (extension) {
      case 'pdf':
        return <InsertDriveFileIcon sx={{ color: '#f44336' }} />;
      case 'doc':
      case 'docx':
        return <InsertDriveFileIcon sx={{ color: '#2196f3' }} />;
      case 'xls':
      case 'xlsx':
        return <InsertDriveFileIcon sx={{ color: '#4caf50' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <InsertDriveFileIcon sx={{ color: '#ff9800' }} />;
      default:
        return <InsertDriveFileIcon />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Paper
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: isDragging ? 'primary.main' : 'divider',
          backgroundColor: isDragging ? 'action.hover' : 'background.paper',
          transition: 'all 0.3s',
          textAlign: 'center',
          mb: 2,
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {description}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          Max file size: {formatBytes(maxSize)}
        </Typography>
        {accept && (
          <Typography variant="caption" display="block" gutterBottom>
            Accepted formats: {accept}
          </Typography>
        )}
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
          sx={{ mt: 2 }}
          disabled={uploading}
        >
          {buttonText}
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
          />
        </Button>
      </Paper>

      {files.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Selected Files ({files.length}/{maxFiles})
          </Typography>
          <List>
            {files.map((fileObj, index) => (
              <ListItem
                key={`${fileObj.file.name}-${index}`}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemIcon>
                  {getFileIcon(fileObj.file)}
                </ListItemIcon>
                <ListItemText
                  primary={fileObj.file.name}
                  secondary={
                    <>
                      {formatBytes(fileObj.file.size)}
                      {fileObj.status === 'error' && (
                        <Typography variant="caption" color="error" component="span" sx={{ ml: 1 }}>
                          - {fileObj.error}
                        </Typography>
                      )}
                    </>
                  }
                />
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  {fileObj.status !== 'pending' && getStatusIcon(fileObj.status)}
                  {fileObj.status === 'uploading' && (
                    <Chip 
                      label={`${fileObj.progress}%`}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={() => handleDelete(index)}
                    disabled={uploading && fileObj.status === 'uploading'}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          
          {uploading && (
            <LinearProgress sx={{ mt: 2, mb: 2 }} />
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={files.length === 0 || uploading || files.every(f => f.status === 'success')}
            >
              {uploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload; 