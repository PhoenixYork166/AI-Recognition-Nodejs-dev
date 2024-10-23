const rootDir = require('./path');
require('dotenv').config({ path: `${rootDir}/.env`});

const knex = require('knex');

/* Local dev */
const db = knex({
    client: 'pg',
    connection: {
        // host: process.env.POSTGRES_SERVICENAME,
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        port: process.env.POSTGRES_PORT
    }
});

/* Cloud SaaS Render deployment */
// const db = knex({
//     client: 'pg',
//     connection: process.env.PG_CONNECTION_STRING,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });

module.exports = db;
