import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Collapse,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

interface SearchFilter {
  field: string;
  operator: string;
  value: string | number | boolean;
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilter[]) => void;
  onClear: () => void;
  placeholder?: string;
  searchFields?: string[];
  categories?: string[];
  dateRange?: boolean;
  numericRange?: boolean;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  onClear,
  placeholder = 'Search...',
  searchFields = ['name', 'description', 'category'],
  categories = [],
  dateRange = true,
  numericRange = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [numericValue, setNumericValue] = useState<number[]>([0, 100]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'starts_with', label: 'Starts with' },
    { value: 'ends_with', label: 'Ends with' },
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'between', label: 'Between' },
  ];

  const handleSearch = () => {
    const allFilters = [...filters];
    
    if (selectedCategory) {
      allFilters.push({
        field: 'category',
        operator: 'equals',
        value: selectedCategory,
      });
    }
    
    if (dateFrom || dateTo) {
      if (dateFrom && dateTo) {
        allFilters.push({
          field: 'date',
          operator: 'between',
          value: `${dateFrom},${dateTo}`,
        });
      } else if (dateFrom) {
        allFilters.push({
          field: 'date',
          operator: 'greater_than',
          value: dateFrom,
        });
      } else if (dateTo) {
        allFilters.push({
          field: 'date',
          operator: 'less_than',
          value: dateTo,
        });
      }
    }
    
    if (numericValue[0] !== 0 || numericValue[1] !== 100) {
      allFilters.push({
        field: 'value',
        operator: 'between',
        value: `${numericValue[0]},${numericValue[1]}`,
      });
    }

    onSearch(searchQuery, allFilters);
  };

  const handleClear = () => {
    setSearchQuery('');
    setFilters([]);
    setSelectedCategory('');
    setDateFrom('');
    setDateTo('');
    setNumericValue([0, 100]);
    setSortBy('name');
    setSortOrder('asc');
    onClear();
  };

  const addFilter = () => {
    setFilters([...filters, { field: 'name', operator: 'contains', value: '' }]);
  };

  const updateFilter = (index: number, field: keyof SearchFilter, value: string | number | boolean) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box>
      {/* Main Search Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchQuery('')}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={() => setShowFilters(!showFilters)}
          sx={{ minWidth: 'auto' }}
        >
          Filters
        </Button>
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={!searchQuery && filters.length === 0}
        >
          Search
        </Button>
        <Button
          variant="outlined"
          onClick={handleClear}
        >
          Clear
        </Button>
      </Box>

      {/* Active Filters Display */}
      {(filters.length > 0 || selectedCategory || dateFrom || dateTo || numericValue[0] !== 0 || numericValue[1] !== 100) && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Active Filters:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {filters.map((filter, index) => (
              <Chip
                key={index}
                label={`${filter.field} ${filter.operator} ${filter.value}`}
                onDelete={() => removeFilter(index)}
                size="small"
              />
            ))}
            {selectedCategory && (
              <Chip
                label={`Category: ${selectedCategory}`}
                onDelete={() => setSelectedCategory('')}
                size="small"
              />
            )}
            {(dateFrom || dateTo) && (
              <Chip
                label={`Date: ${dateFrom || 'any'} - ${dateTo || 'any'}`}
                onDelete={() => { setDateFrom(''); setDateTo(''); }}
                size="small"
              />
            )}
            {(numericValue[0] !== 0 || numericValue[1] !== 100) && (
              <Chip
                label={`Value: ${numericValue[0]} - ${numericValue[1]}`}
                onDelete={() => setNumericValue([0, 100])}
                size="small"
              />
            )}
          </Box>
        </Box>
      )}

      {/* Advanced Filters */}
      <Collapse in={showFilters}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={3}>
              {/* Category Filter */}
              {categories.length > 0 && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      label="Category"
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {/* Date Range Filter */}
              {dateRange && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Date Range
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        type="date"
                        label="From"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        size="small"
                        fullWidth
                      />
                      <TextField
                        type="date"
                        label="To"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        size="small"
                        fullWidth
                      />
                    </Box>
                  </Box>
                </Grid>
              )}

              {/* Numeric Range Filter */}
              {numericRange && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Value Range: {numericValue[0]} - {numericValue[1]}
                    </Typography>
                    <Slider
                      value={numericValue}
                      onChange={(_, value) => setNumericValue(value as number[])}
                      valueLabelDisplay="auto"
                      min={0}
                      max={100}
                    />
                  </Box>
                </Grid>
              )}

              {/* Sort Options */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <FormControl fullWidth>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      label="Sort By"
                      onChange={(e) => setSortBy(e.target.value)}
                      size="small"
                    >
                      <MenuItem value="name">Name</MenuItem>
                      <MenuItem value="date">Date</MenuItem>
                      <MenuItem value="value">Value</MenuItem>
                      <MenuItem value="category">Category</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Order</InputLabel>
                    <Select
                      value={sortOrder}
                      label="Order"
                      onChange={(e) => setSortOrder(e.target.value)}
                      size="small"
                    >
                      <MenuItem value="asc">Ascending</MenuItem>
                      <MenuItem value="desc">Descending</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>

            {/* Custom Filters */}
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="h6" gutterBottom>
                Custom Filters
              </Typography>
              {filters.map((filter, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Field</InputLabel>
                    <Select
                      value={filter.field}
                      label="Field"
                      onChange={(e) => updateFilter(index, 'field', e.target.value)}
                    >
                      {searchFields.map((field) => (
                        <MenuItem key={field} value={field}>
                          {field}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Operator</InputLabel>
                    <Select
                      value={filter.operator}
                      label="Operator"
                      onChange={(e) => updateFilter(index, 'operator', e.target.value)}
                    >
                      {operators.map((op) => (
                        <MenuItem key={op.value} value={op.value}>
                          {op.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    size="small"
                    placeholder="Value"
                    value={filter.value}
                    onChange={(e) => updateFilter(index, 'value', e.target.value)}
                    sx={{ flexGrow: 1 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeFilter(index)}
                    color="error"
                  >
                    <ClearIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                size="small"
                onClick={addFilter}
                startIcon={<FilterIcon />}
              >
                Add Filter
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Collapse>
    </Box>
  );
};

export default AdvancedSearch; 