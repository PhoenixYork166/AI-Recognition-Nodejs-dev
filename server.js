const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const root = require('./controllers/root');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const fetch = require('node-fetch');

/* Connecting to PostgreSQL DB hosted on Render.com */
// const db = knex({
//     client: 'pg',
//     connection: {
//         host: 'dpg-cisb4sp8g3n42om1jhl0-a',
//         user: 'phoenix',
//         password: 'qoU5tWEwVwULETFa6JZOkSZXCwzCrBsO',
//         database: 'smartbrain_wgbb'
//     }
// });

// Connecting to local dev server & dev db postgreSQL 
const db = knex({
 client: 'pg',
 connection: {
     host: '127.0.0.1',
     user: 'postgres',
     password: 'test',
     database: 'smart-brain'
}
})

// Describing table named 'users' on our local dev server
db.select('*').from('pg_stat_activity')
.then((dbConnection) => {
    // console.log(`PostgreSQL dbConnection:\n`);
    // console.log(dbConnection);
    // console.log(`\n`);

    // Mapping connection json to display connected database name
    const databaseName = dbConnection.filter(item => item.datname === 'smart-brain');
    
    console.log(`\nConnected Database Information:\n`);
    // console.log(databaseName);
})
.catch(err => {
    console.log(`\nError verifying PostgreSQL connection:\n${err}\n`);
})

// Logging whether connection to PostgreSQL on Render.com is successful
db.raw("SELECT 1")
.then(() => {
    console.log(`\nPostgreSQL connected!!\n`);
})
.catch(err => {
    console.log(`\nPostgreSQL not connected\nErrors: ${err}\n`);
});

// Using Express middleware
const app = express(); 
// app.use(bodyParser.json());

// Will need either app.use(express.json()) || app.use(bodyParser.json())
// to parse json 
app.use(express.json()); 

// Using CORS modules
app.use(cors());

// create a basic route for root
app.get('/', (req, res) => { root.handleRoot(req, res, db) } )

// create /signin route
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) } )

// create /register route
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) } )

// create /profile/:id route
// grab via req..params props
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) } )

// create /image
// increase entries
app.put('/image', (req, res) => { image.handleImage(req, res, db) } )
app.post('/celebrityimage', (req, res) => { image.handleCelebrityApi(req, res, fetch) } )
app.post('/colorimage', (req, res) => { image.handleColorApi(req, res, fetch) } )
app.post('/ageimage', (req, res) => { image.handleAgeApi(req, res, fetch) } )

// app.listen(port, fn)
// fn will run right after listening to a port
const port = process.env.PORT || 3000;
// const DATABASE_URL = process.env.DATABASE_URL
app.listen(port, () => {
    console.log(`\nNode app is up & running on port: ${port}\n`);
})
