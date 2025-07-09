import React, { useState, useCallback, useMemo } from 'react';
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
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Save as SaveIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from '@mui/icons-material';

interface SearchFilter {
  field: string;
  operator: string;
  value: string | number | boolean | string[];
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilter[]) => void;
  onClear: () => void;
  placeholder?: string;
  searchFields?: string[];
  categories?: string[];
  dateRange?: boolean;
  numericRange?: boolean;
  saveFilters?: boolean;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  onClear,
  placeholder = 'Search...',
  searchFields = ['name', 'description', 'category'],
  categories = [],
  dateRange = true,
  numericRange = true,
  saveFilters = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | string[]>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [numericValue, setNumericValue] = useState<number[]>([0, 100]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [multiSelect, setMultiSelect] = useState(false);
  const [savedFilters, setSavedFilters] = useState<{name: string, query: string, filters: SearchFilter[]}[]>([]);

  const operators = useMemo(() => [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'starts_with', label: 'Starts with' },
    { value: 'ends_with', label: 'Ends with' },
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'between', label: 'Between' },
  ], []);

  const handleSearch = useCallback(() => {
    const allFilters = [...filters];
    
    if (selectedCategory) {
      if (Array.isArray(selectedCategory)) {
        if (selectedCategory.length > 0) {
          allFilters.push({
            field: 'category',
            operator: 'in',
            value: selectedCategory,
          });
        }
      } else if (selectedCategory) {
        allFilters.push({
          field: 'category',
          operator: 'equals',
          value: selectedCategory,
        });
      }
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
  }, [searchQuery, filters, selectedCategory, dateFrom, dateTo, numericValue, onSearch]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setFilters([]);
    setSelectedCategory('');
    setDateFrom('');
    setDateTo('');
    setNumericValue([0, 100]);
    setSortBy('name');
    setSortOrder('asc');
    onClear();
  }, [onClear]);

  const addFilter = useCallback(() => {
    setFilters([...filters, { field: searchFields[0], operator: 'contains', value: '' }]);
  }, [filters, searchFields]);

  const updateFilter = useCallback((index: number, field: keyof SearchFilter, value: string | number | boolean | string[]) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  }, [filters]);

  const removeFilter = useCallback((index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  }, [filters]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);
  
  const saveCurrentFilters = useCallback(() => {
    const name = window.prompt("Name for this filter set:");
    if (name) {
      setSavedFilters([
        ...savedFilters,
        {
          name,
          query: searchQuery,
          filters: [
            ...filters,
            ...(selectedCategory ? [{ field: 'category', operator: 'equals', value: selectedCategory }] : []),
            ...(dateFrom || dateTo ? [{ field: 'date', operator: 'between', value: `${dateFrom || ''},${dateTo || ''}` }] : []),
            ...(numericValue[0] !== 0 || numericValue[1] !== 100 ? [{ field: 'value', operator: 'between', value: `${numericValue[0]},${numericValue[1]}` }] : []),
          ]
        }
      ]);
    }
  }, [savedFilters, searchQuery, filters, selectedCategory, dateFrom, dateTo, numericValue]);
  
  const loadSavedFilter = useCallback((index: number) => {
    const saved = savedFilters[index];
    setSearchQuery(saved.query);
    setFilters(saved.filters.filter(f => 
      f.field !== 'category' && 
      f.field !== 'date' && 
      f.field !== 'value'
    ));
    
    // Extract special filters
    const categoryFilter = saved.filters.find(f => f.field === 'category');
    const dateFilter = saved.filters.find(f => f.field === 'date');
    const valueFilter = saved.filters.find(f => f.field === 'value');
    
    if (categoryFilter) setSelectedCategory(categoryFilter.value);
    
    if (dateFilter && typeof dateFilter.value === 'string') {
      const [from, to] = dateFilter.value.split(',');
      setDateFrom(from);
      setDateTo(to);
    }
    
    if (valueFilter && typeof valueFilter.value === 'string') {
      const [min, max] = valueFilter.value.split(',').map(Number);
      setNumericValue([min, max]);
    }
    
    handleSearch();
  }, [savedFilters, handleSearch]);

  const hasActiveFilters = useMemo(() => filters.length > 0 || 
    selectedCategory || 
    dateFrom || 
    dateTo || 
    numericValue[0] !== 0 || 
    numericValue[1] !== 100, [filters, selectedCategory, dateFrom, dateTo, numericValue]);

  return (
    <Box>
      {/* Main Search Bar */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        gap: { xs: 1, sm: 2 },
        mb: 2
      }}>
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
                  aria-label="Clear search"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          aria-label="Search"
        />
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'row', sm: 'row' },
          gap: { xs: 1, sm: 1 },
          width: { xs: '100%', sm: 'auto' } 
        }}>
          <Tooltip title="Toggle filter panel">
            <Button
              variant={showFilters ? "contained" : "outlined"}
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-controls="filter-panel"
              aria-label="Toggle filters"
              sx={{ 
                minWidth: 'auto',
                flexGrow: { xs: 1, sm: 0 }
              }}
            >
              Filters
            </Button>
          </Tooltip>
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={!searchQuery && !hasActiveFilters}
            sx={{ flexGrow: { xs: 1, sm: 0 } }}
            aria-label="Apply search"
          >
            Search
          </Button>
          <Button
            variant="outlined"
            onClick={handleClear}
            sx={{ flexGrow: { xs: 1, sm: 0 } }}
            aria-label="Clear search"
          >
            Clear
          </Button>
        </Box>
      </Box>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Active Filters:
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 0.75,
            flexWrap: 'wrap',
            maxHeight: '80px',
            overflowY: 'auto'
          }}>
            {filters.map((filter, index) => (
              <Chip
                key={`filter-${index}`}
                label={`${filter.field} ${filter.operator} ${filter.value}`}
                onDelete={() => removeFilter(index)}
                size="small"
                sx={{ m: 0.25 }}
              />
            ))}
            {Array.isArray(selectedCategory) ? (
              selectedCategory.length > 0 && (
                <Chip
                  label={`Categories: ${selectedCategory.length} selected`}
                  onDelete={() => setSelectedCategory([])}
                  size="small"
                  sx={{ m: 0.25 }}
                />
              )
            ) : (
              selectedCategory && (
                <Chip
                  label={`Category: ${selectedCategory}`}
                  onDelete={() => setSelectedCategory('')}
                  size="small"
                  sx={{ m: 0.25 }}
                />
              )
            )}
            {(dateFrom || dateTo) && (
              <Chip
                label={`Date: ${dateFrom || 'any'} - ${dateTo || 'any'}`}
                onDelete={() => { setDateFrom(''); setDateTo(''); }}
                size="small"
                sx={{ m: 0.25 }}
              />
            )}
            {(numericValue[0] !== 0 || numericValue[1] !== 100) && (
              <Chip
                label={`Value: ${numericValue[0]} - ${numericValue[1]}`}
                onDelete={() => setNumericValue([0, 100])}
                size="small"
                sx={{ m: 0.25 }}
              />
            )}
          </Box>
        </Box>
      )}

      {/* Advanced Filters */}
      <Collapse in={showFilters} id="filter-panel">
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Grid container spacing={3}>
              {/* Category Filter */}
              {categories.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>Categories</Typography>
                    <Tooltip title={multiSelect ? "Switch to single select" : "Switch to multi-select"}>
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          setSelectedCategory('');
                          setMultiSelect(!multiSelect);
                        }}
                      >
                        <ArrowDropDownIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <FormControl fullWidth size="small">
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as string | string[])}
                      label="Category"
                      multiple={multiSelect}
                      renderValue={multiSelect 
                        ? (selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {(selected as string[]).map((value) => (
                                <Chip key={value} label={value} size="small" />
                              ))}
                            </Box>
                          )
                        : undefined
                      }
                    >
                      {multiSelect && (
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                      )}
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
                  <Typography variant="body2" sx={{ mb: 1 }}>Date Range</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="From"
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="To"
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {/* Numeric Range Filter */}
              {numericRange && (
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" gutterBottom>Value Range: {numericValue[0]} - {numericValue[1]}</Typography>
                  <Slider
                    value={numericValue}
                    onChange={(e, newValue) => setNumericValue(newValue as number[])}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    min={0}
                    max={1000}
                    step={10}
                  />
                </Grid>
              )}

              {/* Sort Options */}
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 1 }}>Sort By</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="sort-field-label">Field</InputLabel>
                      <Select
                        labelId="sort-field-label"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        label="Field"
                      >
                        {searchFields.map((field) => (
                          <MenuItem key={field} value={field}>
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="sort-order-label">Order</InputLabel>
                      <Select
                        labelId="sort-order-label"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        label="Order"
                      >
                        <MenuItem value="asc">Ascending</MenuItem>
                        <MenuItem value="desc">Descending</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Custom Filters */}
            <Box>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Custom Filters</Typography>
                <Button 
                  size="small" 
                  startIcon={<FilterIcon />} 
                  onClick={addFilter}
                >
                  Add Filter
                </Button>
              </Box>
              
              {filters.map((filter, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Field</InputLabel>
                      <Select
                        value={filter.field}
                        onChange={(e) => updateFilter(index, 'field', e.target.value)}
                        label="Field"
                      >
                        {searchFields.map((field) => (
                          <MenuItem key={field} value={field}>
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Operator</InputLabel>
                      <Select
                        value={filter.operator}
                        onChange={(e) => updateFilter(index, 'operator', e.target.value)}
                        label="Operator"
                      >
                        {operators.map((op) => (
                          <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="Value"
                      value={filter.value}
                      onChange={(e) => updateFilter(index, 'value', e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={1} sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => removeFilter(index)} size="small" aria-label={`Remove filter ${index + 1}`}>
                      <ClearIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Box>
            
            {saveFilters && savedFilters.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>Saved Filters</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {savedFilters.map((savedFilter, index) => (
                      <Chip 
                        key={index}
                        label={savedFilter.name}
                        onClick={() => loadSavedFilter(index)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              </>
            )}
            
            {saveFilters && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  size="small" 
                  startIcon={<SaveIcon />} 
                  onClick={saveCurrentFilters}
                  disabled={!hasActiveFilters && !searchQuery}
                >
                  Save Current Filters
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Collapse>
    </Box>
  );
};

export default React.memo(AdvancedSearch); 