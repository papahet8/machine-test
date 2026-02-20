const http = require('http');
const fs = require('fs');
const path = require('path');

const boundary = '--------------------------' + Date.now().toString(16);
const csvContent = `product_id,product_name,category,discounted_price,actual_price,discount_percentage,rating,rating_count,about_product,user_name,review_title,review_content
B001,Wireless Mouse,Electronics,499,999,50%,4.3,1200,Ergonomic wireless mouse with USB receiver,John Doe,Great Mouse,Very comfortable and responsive
B002,USB Cable,Electronics,149,299,50%,4.1,850,Fast charging USB-C cable 1 meter,Jane Smith,Good Quality,Works perfectly with my phone`;

const filePath = path.join(__dirname, 'test.csv');
fs.writeFileSync(filePath, csvContent);

const fileStats = fs.statSync(filePath);

const postDataStart = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="file"; filename="test.csv"',
    'Content-Type: text/csv',
    '',
    ''
].join('\r\n');

const postDataEnd = [
    '',
    `--${boundary}--`,
    ''
].join('\r\n');

const options = {
    hostname: 'localhost',
    port: 5003,
    path: '/api/upload',
    method: 'POST',
    headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(postDataStart) + fileStats.size + Buffer.byteLength(postDataEnd)
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
        fs.unlinkSync(filePath);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(postDataStart);
const fileStream = fs.createReadStream(filePath);
fileStream.pipe(req, { end: false });
fileStream.on('end', () => {
    req.write(postDataEnd);
    req.end();
});
