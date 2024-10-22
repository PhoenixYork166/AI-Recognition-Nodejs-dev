const rootDir = require('./path');
require('dotenv').config({ path: `${rootDir}/.env`});

const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        // host: process.env.POSTGRES_SERVICENAME,
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        // port: process.env.POSTGRES_PORT
    }
});

module.exports = db;
