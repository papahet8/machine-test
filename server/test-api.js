const http = require('http');

function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5003,
            path: path,
            method: 'GET',
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    console.log(`\nResponse for ${path}:`);
                    console.log('Status:', res.statusCode);
                    // console.log('Data:', data);
                    const parsed = JSON.parse(data);
                    console.log('Parsed Data:', JSON.stringify(parsed, null, 2));
                    resolve();
                } catch (e) {
                    console.error('Error parsing JSON:', e.message);
                    console.log('Raw Data:', data);
                    resolve();
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with request to ${path}: ${e.message}`);
            resolve();
        });

        req.end();
    });
}

async function checkEndpoints() {
    await makeRequest('/api/dashboard/stats');
    await makeRequest('/api/dashboard/trends');
    await makeRequest('/api/dashboard/category');
    await makeRequest('/api/dashboard/products');
}

checkEndpoints();
