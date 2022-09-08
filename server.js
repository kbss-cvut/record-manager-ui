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
// app that use dynamic route
app.use(express.static(`${__dirname}/build`));

app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, '/build/index.html'));
});

app.listen(port, host, error => {
    if (error) {
        console.log(error);
    }

    console.info('Listening on port %s!', port);
});
