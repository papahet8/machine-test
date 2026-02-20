const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Helper: safely extract first numeric value from a string
const safeNumericCast = (column) => {
    return `CAST(NULLIF(SUBSTRING(${column} FROM '([0-9]+\\.?[0-9]*)'), '') AS DECIMAL)`;
};

// GET /api/products — Paginated product list with search & filters
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';
        const category = req.query.category || '';
        const review = req.query.review || '';

        let whereConditions = [];
        let params = [];
        let paramIndex = 1;

        if (search) {
            whereConditions.push(`product_name ILIKE $${paramIndex}`);
            params.push(`%${search}%`);
            paramIndex++;
        }

        if (category) {
            whereConditions.push(`category = $${paramIndex}`);
            params.push(category);
            paramIndex++;
        }

        if (review) {
            whereConditions.push(`(review_content ILIKE $${paramIndex} OR review_title ILIKE $${paramIndex})`);
            params.push(`%${review}%`);
            paramIndex++;
        }

        const whereClause = whereConditions.length > 0
            ? 'WHERE ' + whereConditions.join(' AND ')
            : '';

        // Get total count
        const countResult = await pool.query(
            `SELECT COUNT(*) as total FROM products ${whereClause}`,
            params
        );
        const total = parseInt(countResult.rows[0].total);

        // Get paginated data
        const dataResult = await pool.query(
            `SELECT id, product_id, product_name, category, discounted_price, actual_price,
                    discount_percentage, rating, rating_count, about_product,
                    user_name, review_title, review_content
             FROM products ${whereClause}
             ORDER BY id ASC
             LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
            [...params, limit, offset]
        );

        res.json({
            data: dataResult.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error('Products list error:', err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET /api/products/categories — Distinct category list for filter dropdown
router.get('/categories', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT category
            FROM products
            WHERE category IS NOT NULL AND category != ''
            ORDER BY category ASC
        `);
        res.json(result.rows.map(r => r.category));
    } catch (err) {
        console.error('Categories list error:', err);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

module.exports = router;
