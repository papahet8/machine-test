const { pool } = require('./db');

async function test() {
    try {
        const r = await pool.query('SELECT COUNT(*) as c FROM products');
        console.log('Products count:', r.rows[0].c);

        const r2 = await pool.query('SELECT rating, discount_percentage, rating_count FROM products LIMIT 3');
        console.log('Sample data:', JSON.stringify(r2.rows, null, 2));

        // Test the safe numeric cast
        const r3 = await pool.query(`
            SELECT CAST(NULLIF(SUBSTRING(rating FROM '([0-9]+\\.?[0-9]*)'), '') AS DECIMAL) as parsed_rating
            FROM products
            WHERE rating IS NOT NULL AND rating != ''
            LIMIT 5
        `);
        console.log('Parsed ratings:', JSON.stringify(r3.rows));

        process.exit(0);
    } catch (e) {
        console.error('ERROR:', e.message);
        process.exit(1);
    }
}

test();
