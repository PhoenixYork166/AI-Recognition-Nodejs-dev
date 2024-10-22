const printDateTime = require('../util/printDateTime').printDateTime;

// create / route as an Actuactor for health-checks
const handleRoot = (req, res, db) => {
    printDateTime();

    const callbackName = `handleRoot`;
    console.log(`\nJust received an HTTP request for:\n${callbackName}\n`);

    db.raw("SELECT 1")
    .then((result) => {
        console.log(`\nPostgreSQL connected!!\n`);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(`\nPostgreSQL not connected\nErrors: ${err}\n`);
        res.status(404).json({ status: { code: 400 }, error: err })
    });

    // db
    // .select('*')
    // .from('users')
    // .join('login', function() {
    //     this
    //         .on('users.email', '=', 'login.email')
    //         .orOn('users.id', '=', 'login.id')
    // })
    // .then(response => {
    //     if (response) {
    //         res.status(200).json(response)
    //     } else {
    //         res.status(400).json({status: { code: 400 }, error: 'Cannot fetch PostgreSQL db' })
    //     }
    // })
    // .catch(err => {
    //     console.log(err);
    //     res.status(400).json({ 
    //         status: { code: 400 }, 
    //         error: err 
    //     });
    // })
};

module.exports = {
    handleRoot: handleRoot
};
