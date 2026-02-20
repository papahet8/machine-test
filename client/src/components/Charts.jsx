import React from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { useSelector } from 'react-redux';

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#e0e7ff', '#818cf8', '#4f46e5', '#4338ca', '#3730a3'];

const Charts = () => {
    const {
        categoryData,
        topReviewed,
        discountDistribution,
        categoryAvgRating,
        chartsLoading,
        chartsError
    } = useSelector((state) => state.products);

    if (chartsError) {
        return <Alert severity="error" sx={{ mb: 2 }}>Error loading charts: {chartsError}</Alert>;
    }

    const truncateLabel = (label, maxLen = 20) => {
        if (!label) return '';
        return label.length > maxLen ? label.substring(0, maxLen) + '...' : label;
    };

    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Bar Chart: Products per Category */}
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: 400 }}>
                    <Typography variant="h6" gutterBottom>Products per Category</Typography>
                    {chartsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="category" type="category" width={120} tick={{ fontSize: 11 }}
                                    tickFormatter={(val) => truncateLabel(val, 18)} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" name="Products" radius={[0, 4, 4, 0]}>
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cat-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </Paper>
            </Grid>

            {/* Bar Chart: Top Reviewed Products */}
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: 400 }}>
                    <Typography variant="h6" gutterBottom>Top Reviewed Products</Typography>
                    {chartsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={topReviewed.map(item => ({
                                ...item,
                                name: truncateLabel(item.product_name, 15)
                            }))} margin={{ bottom: 60 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
                                <YAxis />
                                <Tooltip labelFormatter={(label) => {
                                    const item = topReviewed.find(p => truncateLabel(p.product_name, 15) === label);
                                    return item?.product_name || label;
                                }} />
                                <Legend />
                                <Bar dataKey="review_count" name="Review Count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </Paper>
            </Grid>

            {/* Histogram: Discount Distribution */}
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: 400 }}>
                    <Typography variant="h6" gutterBottom>Discount Distribution</Typography>
                    {chartsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={discountDistribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="discount_range" tick={{ fontSize: 11 }} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" name="Number of Products" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                                    {discountDistribution.map((_, index) => (
                                        <Cell key={`disc-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </Paper>
            </Grid>

            {/* Bar Chart: Category-wise Average Rating */}
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: 400 }}>
                    <Typography variant="h6" gutterBottom>Category-wise Average Rating</Typography>
                    {chartsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={categoryAvgRating} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, 5]} />
                                <YAxis dataKey="category" type="category" width={120} tick={{ fontSize: 11 }}
                                    tickFormatter={(val) => truncateLabel(val, 18)} />
                                <Tooltip formatter={(value) => [`${value} ⭐`, 'Avg Rating']} />
                                <Legend />
                                <Bar dataKey="avg_rating" name="Avg Rating" fill="#10b981" radius={[0, 4, 4, 0]}>
                                    {categoryAvgRating.map((_, index) => (
                                        <Cell key={`avgr-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Charts;
