const rootDir = require('../util/path');
require('dotenv').config({ path: `${rootDir}/controllers/.env`});

const printDateTime = require('../util/printDateTime').printDateTime;

// create /signin route
const handleSignin = (req, res, db, bcrypt) => {
    printDateTime();

    // bcrypt.compare("apples", '$2a$10$2J9/8JWebKrnUW8CCntOzurNR1646g/1erL4QsEMuETelwdHhs6jG', function(err, res) {
    //     console.log('first guess', res)
    // });
    // bcrypt.compare("veggies", '$2a$10$2J9/8JWebKrnUW8CCntOzurNR1646g/1erL4QsEMuETelwdHhs6jG', function(err, res) {
    //     console.log('second guess', res)
    // });
    // console.log('req.body: \n', req.body);
    const { email, password } = req.body;

    const callbackName = `handleSignin`;
    console.log(`\nJust received an HTTP request for:\n${callbackName}\n`);

    // Server-side validations
    // If there're no req.body.email OR req.body.password
    if (!email || !password) {
        return res.status(403).json({
            status: { code: 403 },
            error: 'invalid inputs for signin form submission'
        });
    }

    db('users')
    .select('email', 'hash')
    .where('email', '=', email)
    .from('login')
    .then(response => {
        // console.log(`/signin\nresponse[0].email: ${response[0].email} \nresponse[0].hash: ${response[0].hash}`)

        // Comparing users' password input from req.body.password
        // to server-side fetched json
        const isValid = bcrypt.compareSync(password, response[0].hash);

        // If they match up
        if (isValid) {
            // return SELECT * FROM users WHERE email = req.body.email;
            // Will give a user json object
            db.select('*')
            .from('users')
            .where('email', '=', email)
            .then(user => {
                if (user) {
                    return res.status(200).json(user[0]);
                } else {
                    return res.status(404).json({ 
                        status: { code: 400 }, 
                        error: 'user not found' 
                    });
                }
            })
            .catch(err => {
                console.log(`\nError loging in: ${err}\n`);
                res.status(400).json({ 
                    status: { code: 400 }, 
                    error: 'login failed' 
                })
            })
        } else {
            res.status(400).json({ 
                status: { code: 400 },
                error: 'login failed, incorrect credentials' 
            });
        }
    })
    .catch(err => {
        console.log(`\nError loging in: ${err}\n`);
        res.status(400).json({ 
            status: { code: 400 }, 
            error: 'login failed' 
        });
    })
};

module.exports = {
    handleSignin: handleSignin
};