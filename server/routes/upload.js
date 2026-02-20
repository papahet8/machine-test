const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const { pool } = require('../db');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const results = [];
    const filePath = req.file.path;

    try {
        if (req.file.mimetype === 'text/csv' || req.file.originalname.endsWith('.csv')) {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', async () => {
                    await insertData(results, res);
                    fs.unlinkSync(filePath); // Cleanup
                });
        } else if (
            req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            req.file.originalname.endsWith('.xlsx')
        ) {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet);
            await insertData(data, res);
            fs.unlinkSync(filePath); // Cleanup
        } else {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: 'Invalid file format. Please upload CSV or Excel.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing file' });
    }
});

async function insertData(data, res) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        if (data.length > 0) {
            fs.appendFileSync('debug.log', `First row raw: ${JSON.stringify(data[0])}\n`);
            fs.appendFileSync('debug.log', `First row keys: ${JSON.stringify(Object.keys(data[0]))}\n`);
        }

        let insertedCount = 0;

        for (const row of data) {
            // Normalize keys (lowercase, remove spaces, remove special chars)
            const cleanRow = {};
            Object.keys(row).forEach(key => {
                const cleanKey = key.trim().toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '');
                cleanRow[cleanKey] = row[key];
            });

            // Log first row for debugging
            if (data.indexOf(row) === 0) {
                fs.appendFileSync('debug.log', `Clean row keys: ${JSON.stringify(Object.keys(cleanRow))}\n`);
                fs.appendFileSync('debug.log', `Clean row data: ${JSON.stringify(cleanRow)}\n`);
            }

            const {
                product_id,
                product_name,
                category,
                discounted_price,
                actual_price,
                discount_percentage,
                rating,
                rating_count,
                about_product,
                user_name,
                review_title,
                review_content
            } = cleanRow;

            // Validate required fields
            if (!product_id && !product_name) {
                console.warn('Skipping invalid row (no product_id or product_name):', row);
                continue;
            }

            await client.query(
                `INSERT INTO products (product_id, product_name, category, discounted_price, actual_price, discount_percentage, rating, rating_count, about_product, user_name, review_title, review_content)
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                [product_id, product_name, category, discounted_price, actual_price, discount_percentage, rating, rating_count, about_product, user_name, review_title, review_content]
            );
            insertedCount++;
        }

        await client.query('COMMIT');
        res.json({ message: 'File processed and data inserted successfully', count: insertedCount });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Database insertion error:', error);
        res.status(500).json({ error: 'Database error during insertion' });
    } finally {
        client.release();
    }
}

module.exports = router;
