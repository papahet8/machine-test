import React, { useEffect } from 'react';
import { Grid, Typography, Box, Card, CardContent, CircularProgress, Alert, Skeleton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchStats, fetchCategoryData, fetchTopReviewed,
    fetchDiscountDistribution, fetchCategoryAvgRating
} from '../features/productsSlice';
import FileUpload from './FileUpload';
import Charts from './Charts';
import ProductsTable from './ProductsTable';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { stats, statsLoading, statsError } = useSelector((state) => state.products);

    const loadAllData = () => {
        dispatch(fetchStats());
        dispatch(fetchCategoryData());
        dispatch(fetchTopReviewed());
        dispatch(fetchDiscountDistribution());
        dispatch(fetchCategoryAvgRating());
    };

    useEffect(() => {
        loadAllData();
    }, [dispatch]);

    const handleUploadSuccess = () => {
        loadAllData();
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            {/* File Upload */}
            <FileUpload onUploadSuccess={handleUploadSuccess} />

            {/* KPI Cards */}
            {statsError && <Alert severity="error" sx={{ mb: 2 }}>Error loading stats: {statsError}</Alert>}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
                        <CardContent>
                            <Typography sx={{ opacity: 0.9 }} gutterBottom>Total Products</Typography>
                            {statsLoading ? (
                                <Skeleton variant="text" width={80} height={45} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
                            ) : (
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {Number(stats.totalProducts).toLocaleString()}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#fff' }}>
                        <CardContent>
                            <Typography sx={{ opacity: 0.9 }} gutterBottom>Average Rating</Typography>
                            {statsLoading ? (
                                <Skeleton variant="text" width={80} height={45} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
                            ) : (
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    ⭐ {Number(stats.avgRating).toFixed(1)}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#fff' }}>
                        <CardContent>
                            <Typography sx={{ opacity: 0.9 }} gutterBottom>Total Reviews</Typography>
                            {statsLoading ? (
                                <Skeleton variant="text" width={80} height={45} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
                            ) : (
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {Number(stats.totalReviews).toLocaleString()}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts */}
            <Charts />

            {/* Products Table */}
            <ProductsTable />
        </Box>
    );
};

export default Dashboard;
