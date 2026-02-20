import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Async Thunks
export const fetchStats = createAsyncThunk('products/fetchStats', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/dashboard/stats');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch stats');
    }
});

export const fetchCategoryData = createAsyncThunk('products/fetchCategoryData', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/dashboard/category');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch category data');
    }
});

export const fetchTopReviewed = createAsyncThunk('products/fetchTopReviewed', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/dashboard/top-reviewed');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch top reviewed');
    }
});

export const fetchDiscountDistribution = createAsyncThunk('products/fetchDiscountDistribution', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/dashboard/discount-distribution');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch discount distribution');
    }
});

export const fetchCategoryAvgRating = createAsyncThunk('products/fetchCategoryAvgRating', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/dashboard/category-avg-rating');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch category avg rating');
    }
});

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (params, { rejectWithValue }) => {
    try {
        const res = await api.get('/products', { params });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch products');
    }
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/products/categories');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch categories');
    }
});

export const uploadFile = createAsyncThunk('products/uploadFile', async (file, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to upload file');
    }
});

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        // Stats
        stats: { totalProducts: 0, avgRating: 0, totalReviews: 0 },
        statsLoading: false,
        statsError: null,

        // Charts
        categoryData: [],
        topReviewed: [],
        discountDistribution: [],
        categoryAvgRating: [],
        chartsLoading: false,
        chartsError: null,

        // Products table
        productsList: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        productsLoading: false,
        productsError: null,

        // Categories filter
        categoryOptions: [],

        // Upload
        uploadLoading: false,
        uploadError: null,
        uploadMessage: null,
    },
    reducers: {
        clearUploadMessage: (state) => {
            state.uploadMessage = null;
            state.uploadError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Stats
            .addCase(fetchStats.pending, (state) => { state.statsLoading = true; state.statsError = null; })
            .addCase(fetchStats.fulfilled, (state, action) => { state.statsLoading = false; state.stats = action.payload; })
            .addCase(fetchStats.rejected, (state, action) => { state.statsLoading = false; state.statsError = action.payload; })

            // Category data
            .addCase(fetchCategoryData.pending, (state) => { state.chartsLoading = true; })
            .addCase(fetchCategoryData.fulfilled, (state, action) => { state.chartsLoading = false; state.categoryData = action.payload; })
            .addCase(fetchCategoryData.rejected, (state, action) => { state.chartsLoading = false; state.chartsError = action.payload; })

            // Top reviewed
            .addCase(fetchTopReviewed.fulfilled, (state, action) => { state.topReviewed = action.payload; })
            .addCase(fetchTopReviewed.rejected, (state, action) => { state.chartsError = action.payload; })

            // Discount distribution
            .addCase(fetchDiscountDistribution.fulfilled, (state, action) => { state.discountDistribution = action.payload; })
            .addCase(fetchDiscountDistribution.rejected, (state, action) => { state.chartsError = action.payload; })

            // Category avg rating
            .addCase(fetchCategoryAvgRating.fulfilled, (state, action) => { state.categoryAvgRating = action.payload; })
            .addCase(fetchCategoryAvgRating.rejected, (state, action) => { state.chartsError = action.payload; })

            // Products list
            .addCase(fetchProducts.pending, (state) => { state.productsLoading = true; state.productsError = null; })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.productsLoading = false;
                state.productsList = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchProducts.rejected, (state, action) => { state.productsLoading = false; state.productsError = action.payload; })

            // Categories filter
            .addCase(fetchCategories.fulfilled, (state, action) => { state.categoryOptions = action.payload; })

            // Upload
            .addCase(uploadFile.pending, (state) => { state.uploadLoading = true; state.uploadError = null; state.uploadMessage = null; })
            .addCase(uploadFile.fulfilled, (state, action) => { state.uploadLoading = false; state.uploadMessage = action.payload.message; })
            .addCase(uploadFile.rejected, (state, action) => { state.uploadLoading = false; state.uploadError = action.payload; });
    },
});

export const { clearUploadMessage } = productsSlice.actions;
export default productsSlice.reducer;
