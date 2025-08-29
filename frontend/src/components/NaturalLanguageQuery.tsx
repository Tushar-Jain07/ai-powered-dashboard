import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Send as SendIcon,
  Clear as ClearIcon,
  History as HistoryIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { useNotifications } from '../contexts/NotificationContext';

// Type declarations for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface QueryHistory {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
  type: 'chart' | 'analysis' | 'data' | 'general';
}

interface NaturalLanguageQueryProps {
  onQuerySubmit?: (query: string) => void;
  onChartRequest?: (chartType: string, data: any) => void;
}

const NaturalLanguageQuery: React.FC<NaturalLanguageQueryProps> = ({
  onQuerySubmit,
  onChartRequest,
}) => {
  const theme = useTheme();
  const { addNotification } = useNotifications();
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>([]);
  const [suggestions] = useState([
    'Show me sales data for the last 30 days',
    'Create a bar chart of revenue by region',
    'What is the trend in user engagement?',
    'Generate a pie chart of product categories',
    'Analyze customer satisfaction scores',
    'Show me the top performing products',
  ]);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        addNotification('Voice input captured', 'success');
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        addNotification('Voice recognition failed', 'error');
      };
    }
  }, [addNotification]);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
      addNotification('Listening... Speak now', 'info');
    } else {
      addNotification('Speech recognition not supported', 'warning');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setIsProcessing(true);
    try {
      // Stream from backend SSE endpoint
      const controller = new AbortController();
      const signal = controller.signal;
      const url = `/api/chat/stream?prompt=${encodeURIComponent(query)}`;

      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'text/event-stream',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        signal,
      });
      if (!resp.ok || !resp.body) {
        throw new Error('Failed to start stream');
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulated = '';
      // Read the stream and build response
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // SSE frames split by double newlines
        const events = chunk.split('\n\n');
        for (const event of events) {
          if (!event) continue;
          if (event.startsWith('data:')) {
            const json = event.replace(/^data:\s*/, '');
            try {
              const { token } = JSON.parse(json);
              if (token) {
                accumulated += token;
              }
            } catch {
              // ignore
            }
          }
        }
      }

      const response = accumulated || `No output for "${query}"`;

      const newQuery: QueryHistory = {
        id: Date.now().toString(),
        query,
        response,
        timestamp: new Date(),
        type: query.toLowerCase().includes('chart') ? 'chart' : 
              query.toLowerCase().includes('trend') ? 'analysis' : 
              query.toLowerCase().includes('data') ? 'data' : 'general',
      };

      setQueryHistory(prev => [newQuery, ...prev.slice(0, 9)]);
      setQuery('');
      
      addNotification('Query processed successfully', 'success');
      
      // Trigger callbacks
      onQuerySubmit?.(query);
      
      // Auto-detect chart requests
      if (query.toLowerCase().includes('bar chart')) {
        onChartRequest?.('bar', { labels: ['Q1', 'Q2', 'Q3', 'Q4'], data: [65, 78, 90, 85] });
      } else if (query.toLowerCase().includes('pie chart')) {
        onChartRequest?.('pie', { labels: ['Product A', 'Product B', 'Product C'], data: [30, 45, 25] });
      }
      
    } catch (error) {
      addNotification('Failed to process query', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
  };

  const clearHistory = () => {
    setQueryHistory([]);
    addNotification('Query history cleared', 'info');
  };

  const getQueryTypeIcon = (type: QueryHistory['type']) => {
    switch (type) {
      case 'chart':
        return <BarChartIcon />;
      case 'analysis':
        return <TrendingUpIcon />;
      case 'data':
        return <TimelineIcon />;
      default:
        return <SearchIcon />;
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Natural Language Query
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Ask questions in natural language or use voice input to analyze your data
        </Typography>

        {/* Query Input */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Ask a question about your data..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            disabled={isProcessing}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          
          <IconButton
            onClick={isListening ? stopListening : startListening}
            color={isListening ? 'error' : 'primary'}
            disabled={isProcessing}
          >
            {isListening ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
          
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!query.trim() || isProcessing}
            startIcon={isProcessing ? undefined : <SendIcon />}
          >
            {isProcessing ? 'Processing...' : 'Ask'}
          </Button>
        </Box>

        {/* Suggestions */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Quick Suggestions:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                size="small"
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>

        {/* History Button */}
        {queryHistory.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              startIcon={<HistoryIcon />}
              onClick={() => setShowHistory(true)}
              size="small"
            >
              View History ({queryHistory.length})
            </Button>
            <Button
              onClick={clearHistory}
              size="small"
              color="error"
            >
              Clear History
            </Button>
          </Box>
        )}
      </Paper>

      {/* History Dialog */}
      <Dialog
        open={showHistory}
        onClose={() => setShowHistory(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Query History
        </DialogTitle>
        <DialogContent>
          <List>
            {queryHistory.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem>
                  <ListItemIcon>
                    {getQueryTypeIcon(item.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.query}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {item.response}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.timestamp.toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHistory(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NaturalLanguageQuery; 