const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool } = require('./db');
const uploadRoutes = require('./routes/upload');
const dashboardRoutes = require('./routes/dashboard');
const productsRoutes = require('./routes/products');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productsRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('Product Analytics API is running');
});

// Database Connection Test
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ message: 'Database Connected', time: result.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
