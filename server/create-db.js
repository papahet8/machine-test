const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
    const client = new Client({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: 'postgres', // Connect to default database
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
    });

    try {
        await client.connect();

        // Check if database exists
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = 'sales_db'`);

        if (res.rowCount === 0) {
            console.log("Creating database 'sales_db'...");
            await client.query('CREATE DATABASE sales_db');
            console.log("✅ Database 'sales_db' created successfully.");
        } else {
            console.log("ℹ️ Database 'sales_db' already exists.");
        }
    } catch (err) {
        console.error('❌ Error creating database:', err);
    } finally {
        await client.end();
    }
}

createDatabase();
