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
            res.status(400).json('user NOT found')
        }
    })
    .catch(err => res.status(400).json(`error getting user:\n${err}`));
};

module.exports = {
    handleProfileGet: handleProfileGet
};