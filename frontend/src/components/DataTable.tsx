import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Fade,
  Zoom,
  TextField,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as RemoveIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

export interface DataTableProps {
  data: any[];
  columns: {
    id: string;
    label: string;
    minWidth?: number;
    format?: (value: any) => React.ReactNode;
  }[];
  loading?: boolean;
  onExport?: (format: string, options: any) => Promise<void>;
  pagination?: boolean;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  searchable?: boolean;
  onRowClick?: (row: any) => void;
  exportable?: boolean;
  density?: string;
}

type Order = 'asc' | 'desc';

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  loading = false,
  onExport,
  pagination = true,
  rowsPerPageOptions = [10, 25, 50],
  defaultRowsPerPage = 10,
  searchable = false,
  onRowClick,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [orderBy, setOrderBy] = useState<string>('');
  const [order, setOrder] = useState<Order>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleRowClick = (row: any) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, orderBy, order]);

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage, pagination]);

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUpIcon sx={{ color: 'success.main' }} />;
    if (change < 0) return <TrendingDownIcon sx={{ color: 'error.main' }} />;
    return <RemoveIcon sx={{ color: 'text.secondary' }} />;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'pending':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Fade in={true} timeout={600}>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {/* Header with actions */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
        }}>
          <Typography variant="h6" component="h3">
            Data Table
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {onExport && (
              <Tooltip title="Export data">
                <IconButton
                  size="small"
                  onClick={() => onExport('csv', {})}
                  sx={{
                    transition: 'all 0.2s ease',
                    '&:hover': { transform: 'scale(1.1)' },
                  }}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Search field */}
        {searchable && (
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <TextField
              fullWidth
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              size="small"
            />
          </Box>
        )}

        {/* Loading indicator */}
        {loading && (
          <LinearProgress 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0,
              zIndex: 1,
            }} 
          />
        )}

        {/* Table */}
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="data table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.id === 'actions' ? 'center' : 'left'}
                    style={{ minWidth: column.minWidth }}
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSort(column.id)}
                      sx={{
                        '&.MuiTableSortLabel-active': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, index) => (
                <Zoom in={true} timeout={100 * index} key={row.id || index}>
                  <TableRow
                    hover
                    onClick={() => handleRowClick(row)}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      transition: 'all 0.2s ease',
                      cursor: onRowClick ? 'pointer' : 'default',
                      '&:hover': {
                        backgroundColor: theme => theme.palette.action.hover,
                        transform: 'scale(1.01)',
                      },
                    }}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      
                      return (
                        <TableCell key={column.id} align={column.id === 'actions' ? 'center' : 'left'}>
                          {column.format ? (
                            column.format(value)
                          ) : column.id === 'change' ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getTrendIcon(value)}
                              <Typography
                                variant="body2"
                                color={value > 0 ? 'success.main' : value < 0 ? 'error.main' : 'text.secondary'}
                                fontWeight={500}
                              >
                                {value > 0 ? '+' : ''}{value}%
                              </Typography>
                            </Box>
                          ) : column.id === 'status' ? (
                            <Chip
                              label={value}
                              size="small"
                              color={getStatusColor(value) as any}
                            />
                          ) : column.id === 'value' ? (
                            <Typography variant="body2" fontWeight={500}>
                              {typeof value === 'number' ? value.toLocaleString() : value}
                            </Typography>
                          ) : (
                            <Typography variant="body2">
                              {value}
                            </Typography>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </Zoom>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {pagination && (
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: 1,
              borderColor: 'divider',
            }}
          />
        )}
      </Paper>
    </Fade>
  );
};

export default DataTable; 

export const DataTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 8 }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
        <Skeleton variant="rectangular" height={36} width={180} />
        <Skeleton variant="rectangular" height={36} width={120} />
      </Box>
      <Box>
        {Array.from({ length: rows }).map((_, idx) => (
          <Skeleton key={idx} variant="rectangular" height={48} sx={{ mb: 1 }} />
        ))}
      </Box>
    </Box>
  );
};