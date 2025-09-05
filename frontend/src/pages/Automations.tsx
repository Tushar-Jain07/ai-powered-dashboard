import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardHeader, CardContent, Button, Chip, TextField, Switch, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, InputLabel, FormControl, LinearProgress } from '@mui/material';
import { AutoAwesome, Schedule, NotificationsActive, Mail, Download, Insights } from '@mui/icons-material';

interface Rule {
  id: string;
  name: string;
  type: 'report' | 'alert' | 'insight';
  schedule?: string;
  active: boolean;
}

const Automations: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([
    { id: 'r1', name: 'Weekly Performance Report', type: 'report', schedule: '0 9 * * 1', active: true },
    { id: 'r2', name: 'High Cart Abandonment Alert', type: 'alert', active: true },
    { id: 'r3', name: 'Monthly AI Insights Digest', type: 'insight', schedule: '0 10 1 * *', active: false },
  ]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Rule>>({ type: 'report', active: true });
  const [isSaving, setIsSaving] = useState(false);

  const saveRule = () => {
    setIsSaving(true);
    setTimeout(() => {
      setRules(prev => [{ id: `r${Date.now()}`, name: form.name || 'New Rule', type: (form.type as any) || 'report', schedule: form.schedule, active: !!form.active }, ...prev]);
      setOpen(false);
      setIsSaving(false);
      setForm({ type: 'report', active: true });
    }, 800);
  };

  const toggleActive = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Automations</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Automate reports, alerts, and AI insights to boost productivity.
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button variant="contained" startIcon={<AutoAwesome />} onClick={() => setOpen(true)}>
          New Automation
        </Button>
        <Button variant="outlined" startIcon={<Download />}>Export Rules</Button>
      </Box>

      <Grid container spacing={3}>
        {rules.map((r) => (
          <Grid item xs={12} md={4} key={r.id}>
            <Card>
              <CardHeader
                title={r.name}
                subheader={r.type === 'report' ? 'Scheduled report' : r.type === 'alert' ? 'Real-time alert' : 'AI insights summary'}
              />
              <CardContent>
                {r.schedule && (
                  <Chip label={`Schedule: ${r.schedule}`} size="small" sx={{ mr: 1, mb: 1 }} />
                )}
                <FormControlLabel
                  control={<Switch checked={r.active} onChange={() => toggleActive(r.id)} />}
                  label={r.active ? 'Active' : 'Inactive'}
                />
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  {r.type === 'report' && <Button size="small" variant="outlined" startIcon={<Mail />}>Send Now</Button>}
                  {r.type === 'alert' && <Button size="small" variant="outlined" startIcon={<NotificationsActive />}>Test Alert</Button>}
                  {r.type === 'insight' && <Button size="small" variant="outlined" startIcon={<Insights />}>Generate</Button>}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Automation</DialogTitle>
        <DialogContent>
          {isSaving && <LinearProgress sx={{ mb: 2 }} />}
          <TextField fullWidth label="Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} sx={{ mb: 2 }} />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select value={form.type as any} label="Type" onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
              <MenuItem value="report">Report</MenuItem>
              <MenuItem value="alert">Alert</MenuItem>
              <MenuItem value="insight">AI Insight</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth label="Schedule (cron)" placeholder="0 9 * * 1" value={form.schedule || ''} onChange={(e) => setForm({ ...form, schedule: e.target.value })} helperText="Use cron format for scheduling (optional)" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveRule} disabled={isSaving}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Automations;


