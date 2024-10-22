const printDateTime = require('../util/printDateTime').printDateTime;

const handleProfileGet = (req, res, db) => {
    printDateTime();

    const { id } = req.params;
    
    const callbackName = `handleProfileGet`;
    console.log(`\nJust received an HTTP request for:\n${callbackName}\n`);

    db.select('*').from('users').where({
        id: id
    })
    .then(user => {
        if (user.length) {
            res.json(user[0]);
        } else {
            res.status(400).json({ 
                status: { code: 400 }, 
                error: 'user NOT found'
            });
        }
    })
    .catch(err => res.status(400).json({ 
        status: { code: 400 }, 
        error: `error getting user: ${err}`}
    ));
};

module.exports = {
    handleProfileGet: handleProfileGet
};