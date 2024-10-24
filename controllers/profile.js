const printDateTime = require('../util/printDateTime').printDateTime;

const handleProfileGet = (req, res, db) => {
    printDateTime();

    const { id } = req.params;

    if (!id || typeof id !== 'number') {
        return res.status(400).json({
          success: false,
          status: { code: 400 },
          message: `${requestHandlerName} Invalid id: ${id}`
        });
    }
    
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
        error: `Error getting user: ${err}`}
    ));
};

module.exports = {
    handleProfileGet: handleProfileGet
};