// Requests Logging
const rootDir = require('../util/path');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

// ** Express Middleware for Logging HTTP Requests **
// Reading ./logs/access.log w/ File System module
const logDirectory = path.join(rootDir, 'logs');

// Ensure log directory exists
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

const accessLogStream = fs.createWriteStream(
    path.join(rootDir, 'logs', 'access.log'),
    { flags: 'a' }
);

// Export this configured morgan middleware
module.exports = morgan('combined', { stream: accessLogStream });