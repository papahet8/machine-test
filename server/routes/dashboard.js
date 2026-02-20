const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Helper: safely extract first numeric value from a string
const safeNumericCast = (column) => {
    return `CAST(NULLIF(SUBSTRING(${column} FROM '([0-9]+\\.?[0-9]*)'), '') AS DECIMAL)`;
};

// KPI Stats
router.get('/stats', async (req, res) => {
    try {
        const totalProductsResult = await pool.query(
            'SELECT COUNT(DISTINCT product_id) as total_products FROM products'
        );
        const avgRatingResult = await pool.query(
            `SELECT ROUND(AVG(${safeNumericCast('rating')}), 1) as avg_rating
             FROM products WHERE rating IS NOT NULL AND rating != ''`
        );
        const totalReviewsResult = await pool.query(
            'SELECT COUNT(*) as total_reviews FROM products'
        );

        res.json({
            totalProducts: totalProductsResult.rows[0].total_products || 0,
            avgRating: avgRatingResult.rows[0].avg_rating || 0,
            totalReviews: totalReviewsResult.rows[0].total_reviews || 0
        });
    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// Rating Distribution
router.get('/trends', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                CASE 
                    WHEN num_rating >= 4.5 THEN '5 Stars'
                    WHEN num_rating >= 3.5 THEN '4 Stars'
                    WHEN num_rating >= 2.5 THEN '3 Stars'
                    WHEN num_rating >= 1.5 THEN '2 Stars'
                    ELSE '1 Star'
                END as rating_group,
                COUNT(*) as count
            FROM (
                SELECT ${safeNumericCast('rating')} as num_rating
                FROM products
                WHERE rating IS NOT NULL AND rating != ''
            ) AS parsed
            WHERE num_rating IS NOT NULL
            GROUP BY rating_group
            ORDER BY rating_group DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Trends error:', err);
        res.status(500).json({ error: 'Failed to fetch trends' });
    }
});

// Products by Category
router.get('/category', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT category, COUNT(*) as count
            FROM products
            WHERE category IS NOT NULL AND category != ''
            GROUP BY category
            ORDER BY count DESC
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Category error:', err);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Top Reviewed Products (by rating_count)
router.get('/top-reviewed', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT product_name,
                   ${safeNumericCast('rating')} as rating,
                   ${safeNumericCast('rating_count')} as review_count
            FROM products
            WHERE rating_count IS NOT NULL AND rating_count != ''
            ORDER BY ${safeNumericCast('rating_count')} DESC NULLS LAST
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Top reviewed error:', err);
        res.status(500).json({ error: 'Failed to fetch top reviewed products' });
    }
});

// Discount Distribution (Histogram)
router.get('/discount-distribution', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                CASE 
                    WHEN num_discount * 100 >= 70 THEN '70-100%'
                    WHEN num_discount * 100 >= 60 THEN '60-70%'
                    WHEN num_discount * 100 >= 50 THEN '50-60%'
                    WHEN num_discount * 100 >= 40 THEN '40-50%'
                    WHEN num_discount * 100 >= 30 THEN '30-40%'
                    WHEN num_discount * 100 >= 20 THEN '20-30%'
                    WHEN num_discount * 100 >= 10 THEN '10-20%'
                    ELSE '0-10%'
                END as discount_range,
                COUNT(*) as count
            FROM (
                SELECT ${safeNumericCast('discount_percentage')} as num_discount
                FROM products
                WHERE discount_percentage IS NOT NULL AND discount_percentage != ''
            ) AS parsed
            WHERE num_discount IS NOT NULL
            GROUP BY discount_range
            ORDER BY discount_range ASC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Discount distribution error:', err);
        res.status(500).json({ error: 'Failed to fetch discount distribution' });
    }
});

// Category-wise Average Rating
router.get('/category-avg-rating', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT category,
                   ROUND(AVG(${safeNumericCast('rating')}), 1) as avg_rating,
                   COUNT(*) as product_count
            FROM products
            WHERE category IS NOT NULL AND category != ''
              AND rating IS NOT NULL AND rating != ''
            GROUP BY category
            ORDER BY avg_rating DESC
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Category avg rating error:', err);
        res.status(500).json({ error: 'Failed to fetch category avg rating' });
    }
});

module.exports = router;
