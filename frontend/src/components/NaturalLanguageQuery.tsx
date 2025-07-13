import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Send as SendIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Clear as ClearIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  Heatmap as HeatmapIcon,
} from '@mui/icons-material';
import { useNotifications } from '../contexts/NotificationContext';

interface QuerySuggestion {
  text: string;
  type: 'chart' | 'analysis' | 'filter';
  icon: React.ReactNode;
}

interface NaturalLanguageQueryProps {
  onQuerySubmit: (query: string) => void;
  onVoiceInput?: (transcript: string) => void;
  suggestions?: QuerySuggestion[];
}

const NaturalLanguageQuery: React.FC<NaturalLanguageQueryProps> = ({
  onQuerySubmit,
  onVoiceInput,
  suggestions = [],
}) => {
  const theme = useTheme();
  const { addNotification } = useNotifications();
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        addNotification('Listening... Speak now', 'info');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        if (onVoiceInput) {
          onVoiceInput(transcript);
        }
        setIsListening(false);
        addNotification('Voice input received', 'success');
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        addNotification('Voice recognition error', 'error');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, [addNotification, onVoiceInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onQuerySubmit(query.trim());
      setQuery('');
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
  };

  const handleSuggestionClick = (suggestion: QuerySuggestion) => {
    setQuery(suggestion.text);
    onQuerySubmit(suggestion.text);
  };

  const defaultSuggestions: QuerySuggestion[] = [
    {
      text: 'Show me a bar chart of sales by month',
      type: 'chart',
      icon: <BarChartIcon />,
    },
    {
      text: 'Create a pie chart of revenue by category',
      type: 'chart',
      icon: <PieChartIcon />,
    },
    {
      text: 'Display a timeline of user growth',
      type: 'chart',
      icon: <TimelineIcon />,
    },
    {
      text: 'Show heatmap of website traffic by hour and day',
      type: 'chart',
      icon: <HeatmapIcon />,
    },
    {
      text: 'What are the top performing products?',
      type: 'analysis',
      icon: <TrendingUpIcon />,
    },
    {
      text: 'Filter data for the last 30 days',
      type: 'filter',
      icon: <TrendingUpIcon />,
    },
  ];

  const allSuggestions = [...defaultSuggestions, ...suggestions];

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Ask Your Data
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Use natural language to query your data and create visualizations
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            ref={inputRef}
            fullWidth
            variant="outlined"
            placeholder="e.g., 'Show me a bar chart of sales by month'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          
          <Tooltip title="Voice input">
            <IconButton
              onClick={handleVoiceToggle}
              color={isListening ? 'error' : 'primary'}
              disabled={!recognition}
            >
              {isListening ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
          </Tooltip>
          
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            disabled={!query.trim()}
          >
            Ask
          </Button>
        </Box>
      </Box>

      {/* Quick Suggestions */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2">
            Quick Suggestions
          </Typography>
          <IconButton
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ClearIcon />
          </IconButton>
        </Box>
        
        <Collapse in={isExpanded}>
          <List dense>
            {allSuggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {suggestion.icon}
                </ListItemIcon>
                <ListItemText
                  primary={suggestion.text}
                  secondary={
                    <Chip
                      label={suggestion.type}
                      size="small"
                      variant="outlined"
                      sx={{ mt: 0.5 }}
                    />
                  }
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Box>

      {/* Voice Status */}
      {isListening && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'error.main',
              animation: 'pulse 1s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.5 },
                '100%': { opacity: 1 },
              },
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Listening... Speak now
          </Typography>
        </Box>
      )}

      {/* Help Text */}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        Try phrases like: "create a chart", "show me data", "filter by date", "what are the trends"
      </Typography>
    </Paper>
  );
};

export default NaturalLanguageQuery; 