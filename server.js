const cookieParser = require('cookie-parser');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const knex = require('knex');
const db = require('./util/database');

const root = require('./controllers/root');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const colorRecords = require('./controllers/colorRecords');
const fetch = require('node-fetch');

const rootDir = require('./util/path');
require('dotenv').config({ path: `${rootDir}/.env`});

const printDateTime = require('./util/printDateTime').printDateTime;
const saveBase64Image = require('./util/saveBase64Image');

const transformColorData = require('./util/records-data-transformations/transformColorData');

// Middleware 
// Requests Logging
const logger = require('./middleware/requestLogger');

// Test PostgreSQL connection
const { testDbConnection } = require('./middleware/testDbConnection');
testDbConnection(db);

console.log(`\n\nprocess.env.POSTGRES_HOST:\n${process.env.POSTGRES_HOST}\n\nprocess.env.POSTGRES_USER:\n${process.env.POSTGRES_USERNAME}\n\nprocess.env.POSTGRES_PASSWORD:\n${process.env.POSTGRES_PASSWORD}\n\n\nprocess.env.POSTGRES_DB:\n${process.env.POSTGRES_DB}\n\n\nprocess.env.POSTGRES_PORT:\n${process.env.POSTGRES_PORT}\n\nprocess.env.NODE_ENV:\n${process.env.NODE_ENV}\n`);



// Using Express middleware
const app = express(); 

// Middleware for cookie-parser and pass the secret for signing the cookies
app.use(cookieParser(process.env.MY_SECRET));

// Will need either app.use(express.json()) || app.use(bodyParser.json())
// to parse json 
app.use(express.json()); 

// Middleware for CORS (Cross-Origin-Resource-Sharing)
app.use(cors({ origin: 'http://localhost:3000' }));

// ** Express Middleware for Logging HTTP Requests **
app.use(logger);

// Express routes
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

// User's color records
app.post('/save-user-color', (req, res) => {colorRecords.saveUserColor(req, res, db, saveBase64Image) } )
app.post('/get-user-color', (req, res) => { colorRecords.getUserColor(req, res, db, transformColorData) })

// app.listen(port, fn)
// fn will run right after listening to a port
const port = process.env.PORT || 3001;

// const DATABASE_URL = process.env.DATABASE_URL
app.listen(port, () => {
    printDateTime();

    console.log(`\nNode app is up & running on port: ${port}\n`);
})
