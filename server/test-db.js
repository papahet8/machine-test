const { Pool } = require('pg');

const passwords = [
    'password',
    'postgres',
    'admin',
    'root',
    '1234',
    '12345',
    '123456',
    'welcome',
    'sales_db'
];

async function test() {
    console.log('--- Starting Connection Tests ---');

    // Test 1: Trust Auth (No Password)
    console.log(`\n[Test 0] Trying WITHOUT password...`);
    const pool0 = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'sales_db',
        port: 5432,
        connectionTimeoutMillis: 2000,
    });
    try {
        const client = await pool0.connect();
        console.log('✅ SUCCESS! Connected without password (Trust Auth).');
        client.release();
        process.exit(0);
    } catch (err) {
        console.log(`❌ Failed: ${err.message}`);
    } finally {
        await pool0.end();
    }

    // Test 2: Common Passwords
    for (let i = 0; i < passwords.length; i++) {
        const pwd = passwords[i];
        console.log(`\n[Test ${i + 1}] Trying password: '${pwd}'...`);

        const pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'sales_db',
            password: pwd,
            port: 5432,
            connectionTimeoutMillis: 2000,
        });

        try {
            const client = await pool.connect();
            console.log(`✅ SUCCESS! Connected with password: '${pwd}'`);
            console.log('Please update your .env file with this password.');
            client.release();
            process.exit(0);
        } catch (err) {
            console.log(`❌ Failed: ${err.message}`);
        } finally {
            await pool.end();
        }
    }
    console.log('\n--- All tests failed ---');
}

test();
