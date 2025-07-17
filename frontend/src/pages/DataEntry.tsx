import React, { useState, useEffect, useRef, Suspense } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  IconButton,
} from '@mui/material';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import jsPDF from 'jspdf';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, isAfter, isBefore } from 'date-fns';

interface Entry {
  _id?: string;
  id?: string;
  date: string;
  sales: number;
  profit: number;
  category: string;
  [key: string]: any;
}

const categories = ['Electronics', 'Apparel', 'Home', 'Toys', 'Other'];
const API_URL = '/api/user-data';

const DataEntry: React.FC = () => {
  const [form, setForm] = useState<Entry>({
    date: '',
    sales: 0,
    profit: 0,
    category: '',
  });
  const [data, setData] = useState<Entry[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState<Date | null>(null);
  const [filterDateTo, setFilterDateTo] = useState<Date | null>(null);
  const [filterSalesMin, setFilterSalesMin] = useState('');
  const [filterSalesMax, setFilterSalesMax] = useState('');
  const [filterProfitMin, setFilterProfitMin] = useState('');
  const [filterProfitMax, setFilterProfitMax] = useState('');

  // Filtering logic
  const filteredData = data.filter((row) => {
    // Free text search
    const matchesSearch = search
      ? Object.values(row).some((v) => String(v).toLowerCase().includes(search.toLowerCase()))
      : true;
    // Category
    const matchesCategory = filterCategory ? row.category === filterCategory : true;
    // Date range
    const matchesDateFrom = filterDateFrom ? isAfter(new Date(row.date), filterDateFrom) || format(new Date(row.date), 'yyyy-MM-dd') === format(filterDateFrom, 'yyyy-MM-dd') : true;
    const matchesDateTo = filterDateTo ? isBefore(new Date(row.date), filterDateTo) || format(new Date(row.date), 'yyyy-MM-dd') === format(filterDateTo, 'yyyy-MM-dd') : true;
    // Sales
    const matchesSalesMin = filterSalesMin ? row.sales >= Number(filterSalesMin) : true;
    const matchesSalesMax = filterSalesMax ? row.sales <= Number(filterSalesMax) : true;
    // Profit
    const matchesProfitMin = filterProfitMin ? row.profit >= Number(filterProfitMin) : true;
    const matchesProfitMax = filterProfitMax ? row.profit <= Number(filterProfitMax) : true;
    return (
      matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo &&
      matchesSalesMin && matchesSalesMax && matchesProfitMin && matchesProfitMax
    );
  });

  // Fetch data from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
        setShowAnalytics(true);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add entry (POST)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(API_URL, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData([...data, res.data]);
      setForm({ date: '', sales: 0, profit: 0, category: '' });
      setShowAnalytics(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add entry');
    } finally {
      setLoading(false);
    }
  };

  // CSV upload handler (bulk POST)
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const rows = text.split(/\r?\n/).filter(Boolean);
      const [header, ...lines] = rows;
      const headers = header.split(',').map(h => h.trim().toLowerCase());
      const newEntries: Entry[] = lines.map(line => {
        const values = line.split(',');
        const entry: any = {};
        headers.forEach((h, i) => {
          entry[h] = values[i];
        });
        return {
          date: entry.date || '',
          sales: Number(entry.sales) || 0,
          profit: Number(entry.profit) || 0,
          category: entry.category || '',
        };
      });
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await Promise.all(newEntries.map(entry =>
          axios.post(API_URL, entry, { headers: { Authorization: `Bearer ${token}` } })
        ));
        setData(prev => [...prev, ...res.map(r => r.data)]);
        setShowAnalytics(true);
      } catch (err: any) {
        setError('Failed to upload CSV entries');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Table columns
  const columns: GridColDef[] = [
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'sales', headerName: 'Sales', width: 100, type: 'number' },
    { field: 'profit', headerName: 'Profit', width: 100, type: 'number' },
    { field: 'category', headerName: 'Category', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => (
        <>
          <IconButton size="small" onClick={() => handleEdit(params.row.id)}><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" onClick={() => handleDelete(params.row.id)}><DeleteIcon fontSize="small" /></IconButton>
        </>
      ),
    },
  ];

  // Fix DataGrid row id and types
  const rows = filteredData.map((d) => ({ ...d, id: (d as any)._id || (d as any).id }));

  // Edit entry
  const handleEdit = (id: number) => {
    setEditIndex(id);
    setForm(data[id]);
  };
  // Delete entry (DELETE)
  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const entryId = data[id]._id || data[id].id;
      await axios.delete(`${API_URL}/${entryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(data.filter((_, i) => i !== id));
      if (editIndex === id) setEditIndex(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete entry');
    } finally {
      setLoading(false);
    }
  };

  // Edit entry (PUT)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editIndex !== null) {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const entryId = data[editIndex]._id || data[editIndex].id;
        const res = await axios.put(`${API_URL}/${entryId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updated = [...data];
        updated[editIndex] = res.data;
        setData(updated);
        setEditIndex(null);
        setForm({ date: '', sales: 0, profit: 0, category: '' });
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to update entry');
      } finally {
        setLoading(false);
      }
    }
  };

  // Analytics
  const totalSales = filteredData.reduce((sum, d) => sum + d.sales, 0);
  const totalProfit = filteredData.reduce((sum, d) => sum + d.profit, 0);
  const salesByDate = filteredData.reduce((acc, d) => {
    acc[d.date] = (acc[d.date] || 0) + d.sales;
    return acc;
  }, {} as Record<string, number>);
  const profitByCategory = filteredData.reduce((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + d.profit;
    return acc;
  }, {} as Record<string, number>);

  // Fix PieChart data mapping
  const pieChartData = Object.entries(profitByCategory).map(([category, profit]) => ({ name: category, value: profit }));

  // Inject excel-utils.js script on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.exportToExcel) {
      const script = document.createElement('script');
      script.src = '/excel-utils.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleExportTSV = () => {
    if (!data.length) return;
    const header = Object.keys(data[0]).filter(k => k !== '_id' && k !== 'id');
    const rows = data.map(row => header.map(h => row[h]).join('\t'));
    const tsv = [header.join('\t'), ...rows].join('\n');
    const blob = new Blob([tsv], { type: 'text/tab-separated-values' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-entries.tsv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    const doc = new jsPDF();
    const autoTable = (await import('jspdf-autotable')).default;
    const header = Object.keys(data[0]).filter(k => k !== '_id' && k !== 'id');
    const rows = data.map(row => header.map(h => row[h]));
    autoTable(doc, { head: [header], body: rows });
    doc.save('data-entries.pdf');
  };

  // Excel export handler (calls window.exportToExcel)
  const handleExportExcel = () => {
    if (typeof window !== 'undefined' && window.exportToExcel) {
      window.exportToExcel(data, 'data-entries.xlsx');
    }
  };

  // Excel import handler (calls window.importFromExcel)
  const excelFileInputRef = useRef<HTMLInputElement>(null);
  const handleExcelImportClick = () => {
    excelFileInputRef.current?.click();
  };
  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || typeof window === 'undefined' || !window.importFromExcel) return;
    window.importFromExcel(file, async (entries: any[]) => {
      const newEntries = entries.map((entry: any) => ({
        date: entry.date || '',
        sales: Number(entry.sales) || 0,
        profit: Number(entry.profit) || 0,
        category: entry.category || '',
      }));
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await Promise.all(newEntries.map(entry =>
          axios.post(API_URL, entry, { headers: { Authorization: `Bearer ${token}` } })
        ));
        setData(prev => [...prev, ...res.map(r => r.data)]);
        setShowAnalytics(true);
      } catch (err) {
        setError('Failed to upload Excel entries');
      } finally {
        setLoading(false);
      }
    });
    e.target.value = '';
  };

  // CSV export handler
  const handleExportCSV = () => {
    if (!data.length) return;
    const header = Object.keys(data[0]).filter(k => k !== '_id' && k !== 'id');
    const rows = data.map(row => header.map(h => row[h]).join(','));
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-entries.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- AI Insights logic ---
  let insights: string[] = [];
  // Trend analysis (sales over time)
  const salesDates = Object.entries(salesByDate).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime());
  if (salesDates.length > 1) {
    const first = salesDates[0][1];
    const last = salesDates[salesDates.length - 1][1];
    if (last > first) insights.push(`Sales are trending up (${first} → ${last}) over the selected period.`);
    else if (last < first) insights.push(`Sales are trending down (${first} → ${last}) over the selected period.`);
    else insights.push(`Sales are stable over the selected period.`);
  }
  // Best/worst category
  const sortedCategories = Object.entries(profitByCategory).sort((a, b) => b[1] - a[1]);
  if (sortedCategories.length > 0) {
    insights.push(`Most profitable category: ${sortedCategories[0][0]} (${sortedCategories[0][1]})`);
    if (sortedCategories.length > 1) insights.push(`Least profitable category: ${sortedCategories[sortedCategories.length-1][0]} (${sortedCategories[sortedCategories.length-1][1]})`);
  }
  // Spike/drop detection (simple)
  if (salesDates.length > 2) {
    let maxDelta = 0, spikeDate = '';
    for (let i = 1; i < salesDates.length; ++i) {
      const delta = Math.abs(salesDates[i][1] - salesDates[i-1][1]);
      if (delta > maxDelta) { maxDelta = delta; spikeDate = salesDates[i][0]; }
    }
    if (maxDelta > 0) insights.push(`Largest sales change (${maxDelta}) occurred on ${spikeDate}.`);
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Data Entry</Typography>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {loading && <Typography color="primary" sx={{ mb: 2 }}>Loading...</Typography>}
      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={editIndex === null ? handleSubmit : handleUpdate}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Sales Amount"
                name="sales"
                type="number"
                value={form.sales}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Profit"
                name="profit"
                type="number"
                value={form.profit}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Category"
                name="category"
                select
                value={form.category}
                onChange={handleChange}
                fullWidth
                required
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained">{editIndex === null ? 'Add Entry' : 'Update Entry'}</Button>
              <Button
                variant="outlined"
                sx={{ ml: 2 }}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload CSV
              </Button>
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleCSVUpload}
              />
              <Button
                variant="outlined"
                sx={{ ml: 2 }}
                onClick={handleExcelImportClick}
              >
                Import Excel
              </Button>
              <input
                type="file"
                accept=".xlsx"
                ref={excelFileInputRef}
                style={{ display: 'none' }}
                onChange={handleExcelImport}
              />
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Filter/Search UI */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                label="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                label="Category"
                select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                fullWidth
              >
                <MenuItem value="">All</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={2}>
              <DatePicker
                label="From"
                value={filterDateFrom}
                onChange={setFilterDateFrom}
                renderInput={(params: any) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <DatePicker
                label="To"
                value={filterDateTo}
                onChange={setFilterDateTo}
                renderInput={(params: any) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <TextField
                label="Sales Min"
                type="number"
                value={filterSalesMin}
                onChange={e => setFilterSalesMin(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <TextField
                label="Sales Max"
                type="number"
                value={filterSalesMax}
                onChange={e => setFilterSalesMax(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <TextField
                label="Profit Min"
                type="number"
                value={filterProfitMin}
                onChange={e => setFilterProfitMin(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <TextField
                label="Profit Max"
                type="number"
                value={filterProfitMax}
                onChange={e => setFilterProfitMax(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <Button variant="outlined" onClick={() => {
                setSearch(''); setFilterCategory(''); setFilterDateFrom(null); setFilterDateTo(null);
                setFilterSalesMin(''); setFilterSalesMax(''); setFilterProfitMin(''); setFilterProfitMax('');
              }}>Clear</Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Paper>

      {data.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={handleExportExcel}>Export Excel</Button>
          <Button variant="outlined" onClick={handleExportCSV}>Export CSV</Button>
          <Button variant="outlined" onClick={handleExportPDF}>Export PDF</Button>
          <Button variant="outlined" onClick={handleExportTSV}>Export TSV</Button>
        </Box>
      )}

      {data.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>All Entries</Typography>
          <div style={{ height: 350, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10]} />
          </div>
        </Box>
      )}

      {showAnalytics && data.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>Analytics</Typography>
          <Typography>Total Sales: <b>{totalSales}</b></Typography>
          <Typography>Total Profit: <b>{totalProfit}</b></Typography>
          <Box sx={{ mt: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <BarChart
                data={Object.entries(salesByDate).map(([date, sales]) => ({ date, sales }))}
                xKey="date"
                yKeys={[{ key: 'sales', name: 'Sales', color: '#1976d2' }]}
                title="Sales Over Time"
                height={300}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <PieChart
                data={pieChartData}
                title="Profit by Category"
                height={300}
              />
            </Box>
          </Box>
        </Box>
      )}

      {/* AI Insights Panel */}
      {insights.length > 0 && (
        <Paper sx={{ p: 2, mb: 2, background: '#f5f5fa' }}>
          <Typography variant="h6" gutterBottom>AI Insights</Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {insights.map((msg, i) => <li key={i}>{msg}</li>)}
          </ul>
        </Paper>
      )}
    </Box>
  );
};

export default DataEntry; 