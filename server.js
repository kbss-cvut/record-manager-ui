require('dotenv').config();
const path = require('path');
const express = require('express');
const compression = require('compression');
const fs = require('fs');

const port = process.env.RECORD_MANAGER_PROD_SERVER_PORT || 8080;
const host = '0.0.0.0';
const app = express();

if (!fs.existsSync(path.join(__dirname, '/build/index.html'))) {
    throw 'Index file is missing!';
}

// Compress served content (e.g. favicon.ico)
app.use(compression());

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle all other routes by serving the index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(port, host, (error) => {
    if (error) {
        console.error(error);
    } else {
        console.info(`Server is running at http://${host}:${port}`);
    }
});
