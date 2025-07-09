import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Drawer,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useNotifications } from '../contexts/NotificationContext';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const ChatAssistant: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotifications();

  const toggleDrawer = () => setOpen(!open);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg.content }),
      });
      if (!res.ok) throw new Error('Failed to fetch response');
      const data = await res.json();
      const assistantMsg: ChatMessage = { role: 'assistant', content: data.message };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      addNotification('AI assistant error. Check console or API key.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="AI Assistant">
        <IconButton
          onClick={toggleDrawer}
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: theme => theme.zIndex.tooltip + 1,
            bgcolor: 'background.paper',
            boxShadow: theme => theme.shadows[4],
            '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' },
          }}
        >
          <ChatIcon />
        </IconButton>
      </Tooltip>

      <Drawer anchor="right" open={open} onClose={toggleDrawer} sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 360 } } }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">AI Assistant</Typography>
          <IconButton onClick={toggleDrawer} aria-label="Close chat">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ px: 2, pb: 2, flexGrow: 1, overflowY: 'auto' }}>
          <List>
            {messages.map((m, idx) => (
              <ListItem key={idx} sx={{ alignItems: 'flex-start' }}>
                <ListItemText
                  primary={m.role === 'user' ? 'You' : 'Assistant'}
                  secondary={<Typography component="span" variant="body2" color="text.primary">{m.content}</Typography>}
                />
              </ListItem>
            ))}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </List>
        </Box>
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Ask something…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button variant="contained" endIcon={<SendIcon />} onClick={handleSend} disabled={loading}>
            Send
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default ChatAssistant; 