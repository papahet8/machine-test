const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const createTableQuery = `
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(255),
    product_name TEXT,
    category VARCHAR(255),
    discounted_price VARCHAR(50),
    actual_price VARCHAR(50),
    discount_percentage VARCHAR(50),
    rating VARCHAR(10),
    rating_count VARCHAR(50),
    about_product TEXT,
    user_name VARCHAR(255),
    review_title TEXT,
    review_content TEXT
);
`;

const initDb = async () => {
    try {
        await pool.query(createTableQuery);
        console.log('Products table created or already exists.');
    } catch (err) {
        console.error('Error creating table:', err);
    }
};

initDb();

module.exports = { pool };
