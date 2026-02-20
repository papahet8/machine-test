import React, { useEffect, useState, useCallback } from 'react';
import {
    Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, TextField, Box, MenuItem, Select, FormControl, InputLabel,
    CircularProgress, Alert, InputAdornment, Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories } from '../features/productsSlice';

const ProductsTable = () => {
    const dispatch = useDispatch();
    const { productsList, pagination, productsLoading, productsError, categoryOptions } = useSelector(
        (state) => state.products
    );

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [review, setReview] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Debounced fetch
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [debouncedReview, setDebouncedReview] = useState('');

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Debounce search and review inputs
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedReview(review);
            setPage(0);
        }, 400);
        return () => clearTimeout(timer);
    }, [review]);

    useEffect(() => {
        dispatch(fetchProducts({
            page: page + 1,
            limit: rowsPerPage,
            search: debouncedSearch,
            category,
            review: debouncedReview,
        }));
    }, [dispatch, page, rowsPerPage, debouncedSearch, category, debouncedReview]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setPage(0);
    };

    const renderRating = (rating) => {
        if (!rating) return '-';
        const num = parseFloat(rating);
        if (isNaN(num)) return rating;
        return `⭐ ${num.toFixed(1)}`;
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>Product Data</Typography>

            {/* Filters Row */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    label="Search Product Name"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ minWidth: 250 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Filter by Category</InputLabel>
                    <Select
                        value={category}
                        label="Filter by Category"
                        onChange={handleCategoryChange}
                    >
                        <MenuItem value="">
                            <em>All Categories</em>
                        </MenuItem>
                        {categoryOptions.map((cat, idx) => (
                            <MenuItem key={idx} value={cat}>{cat}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Search Reviews"
                    variant="outlined"
                    size="small"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    sx={{ minWidth: 200 }}
                />

                {(search || category || review) && (
                    <Chip
                        label="Clear Filters"
                        onDelete={() => {
                            setSearch('');
                            setCategory('');
                            setReview('');
                        }}
                        color="primary"
                        variant="outlined"
                    />
                )}
            </Box>

            {productsError && <Alert severity="error" sx={{ mb: 2 }}>{productsError}</Alert>}

            {/* Table */}
            <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Product ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Product Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }} align="right">Actual Price</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }} align="right">Discounted Price</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }} align="center">Discount %</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }} align="center">Rating</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }} align="center">Rating Count</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Review Title</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Reviewer</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productsLoading ? (
                            <TableRow>
                                <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
                                    <CircularProgress />
                                    <Typography variant="body2" sx={{ mt: 1 }}>Loading products...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : productsList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        No products found. Upload a CSV/Excel file to get started.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            productsList.map((row, idx) => (
                                <TableRow key={row.id || idx} hover>
                                    <TableCell>{row.product_id || '-'}</TableCell>
                                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {row.product_name || '-'}
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {row.category || '-'}
                                    </TableCell>
                                    <TableCell align="right">{row.actual_price || '-'}</TableCell>
                                    <TableCell align="right">{row.discounted_price || '-'}</TableCell>
                                    <TableCell align="center">{row.discount_percentage || '-'}</TableCell>
                                    <TableCell align="center">{renderRating(row.rating)}</TableCell>
                                    <TableCell align="center">{row.rating_count || '-'}</TableCell>
                                    <TableCell sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {row.review_title || '-'}
                                    </TableCell>
                                    <TableCell>{row.user_name || '-'}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={pagination.total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />
        </Paper>
    );
};

export default ProductsTable;
