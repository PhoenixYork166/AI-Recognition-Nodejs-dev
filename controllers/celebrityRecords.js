const rootDir = require('../util/path');

require('dotenv').config({ path: `${rootDir}/controllers/.env`});

const printDateTime = require('../util/printDateTime').printDateTime;
const { performance } = require('perf_hooks');
const image = require('./image');

const saveUserCelebrity = (req, res, db, saveBase64Image) => {
    printDateTime();
    const requestHandlerName = `saveUserCelebrity`;
    console.log(`\nJust received an HTTP request for:\n${requestHandlerName}\n`);
    
    const { userId, celebrityName, imageUrl, imageBlob, metadata, dateTime } = req.body;

    if (!userId || !celebrityName || !imageUrl || !imageBlob || !metadata || typeof userId !== 'number' || typeof celebrityName !== 'string' || typeof imageUrl !== 'string' || typeof imageBlob !== 'string' || typeof metadata !== 'string') {
        return res.status(400).json({
            success: false,
            status: { code: 400 },
            message: `Invalid inputs`,
            error: `One or more inputs are invalid or of incorrect dataType`
        });
    }

    let userIdInt = parseInt(userId, 10);
    if (isNaN(userIdInt)) {
      return res.status(400).json({ error: 'Invalid userId, must be a number' });
    }
  
    let base64Metadata = (typeof metadata === 'string') ? metadata : JSON.stringify(metadata);

    const start = performance.now();

    // const date_time = new Date().toISOString();
    console.log(`\nRequest Handler: `, requestHandlerName, `\n`, `userId: `, userId, `\ncelebrityName: `, celebrityName, `\nimageUrl: `, imageUrl, `\nimageBlob: `, imageBlob, `\nmetada: `, metadata, `\ndateTime: `, dateTime);
    
    return db('celebrity_record')
    .insert({
        user_id: userId,
        celebrity_name: celebrityName,
        image_url: imageUrl,
        image_blob: imageBlob,
        metadata: metadata,
        date_time: dateTime
    })
    // .returning('*')
    .then((result) => {
        if (!result) {
            res.status(500).json({
                success: false,
                status: { code: 500 },
                message: `Failed during savingUserCelebrity postgres op`
            });
        }

        console.log('\nProceeding to save base64 image to Node server.\n');
        // Allow Promise chaining by return
        return saveBase64Image(base64Metadata, userIdInt);
    })
    .then((saveBase64Results) => {
        const end = performance.now();
        const duration = end - start;
        console.log(`\nPerformance for saveBase64Image locally to Node.js server is: ${duration}ms\n`);
        
        res.status(200).json({
          success: true,
          status: { code: 200 },
          message: `saveUserCelebrity postgresql op completed successfully!`,
          performance: `Performance: ${duration}ms`
        });
    })
    .catch((err) => {
        console.error(`Error in saving image:\n`, err, `\n`);
        res.status(500).json({
          success: false,
          status: { code: 500 },
          message: `Failed during saving celebrity image to server`,
          error: err.toString()
        });
    });
};

/* PostgreSQL 
SELECT 
    u.id AS user_id,
    cr.id AS celebrity_record_id,
    cr.image_url,
    cr.image_blob,
    cr.date_time
FROM
    users u
JOIN
    celebrity_record cr ON u.id = cr.user_id
WHERE
    u.id = 1
    AND cr.id IN (
        SELECT cr.id
        FROM celebrity_record cr 
        WHERE cr.user_id = 1
        ORDER BY cr.date_time DESC
        LIMIT 10
    )
ORDER BY
    cr.date_time DESC;
*/
const getUserCelebrity = (req, res, db) => {
    printDateTime();
    const start = performance.now();

    const requestHandlerName = `rootDir/controllers/colorRecords.js\ngetUserCelebrity()`;
    
    const { userId } = req.body;

    if (!userId || typeof userId !== 'number') {
        return res.status(400).json({ 
          success: false, 
          status: { code: 400 }, 
          message: `Invalid inputs for userId: ${userId} undefined`, 
        });
    }

    const subquery = db('celebrity_record as cr')
    .select('cr.id')
    .where('cr.user_id', 1)
    .orderBy('cr.date_time', 'desc')
    .limit(10);

    const mainQuery = db('users as u')
        .join('celebrity_record as cr', 'u.id', 'cr.user_id')
        .select(
            'u.id as user_id',
            'cr.id as celebrity_record_id',
            'cr.celebrity_name',
            'cr.image_url',
            'cr.image_blob',
            'cr.date_time'
        )
        .where('u.id', 1)
        .whereIn('cr.id', subquery)
        .orderBy('cr.date_time', 'desc');

    // To see the generated SQL
    mainQuery.toSQL().toNative();

    // Execute the query
    mainQuery.then(rows => {
        const end = performance.now();
        const duration = end - start;

        // console.log(`\nRequest Handler: ${requestHandlerName}\nrows: \n`)
        // console.log(rows);
        console.log(`\nPerformance for Request Handler:\n${requestHandlerName}:\n${duration}ms\n`);

        return res.status(200).json({ 
            success: true, 
            status: { code: 200 }, 
            message: `Transaction for Express RequestHandler: ${requestHandlerName} completed!`, performance: `Performance for db.transaction(trx) => getUserCelebrity (records) is: ${duration}ms`,
            celebrityData: rows
        });
    }).catch(err => {
        console.error(`\nError in Request Handler:\n${requestHandlerName}\nError:\n${err}\n`);

        return res.status(500).json({ 
            success: false, 
            status: { code: 500 }, 
            message: `Failed Express RequestHandler ${requestHandlerName}Internal Server Error`, 
            error: err.toString()
          });
    });
}

module.exports = {
    saveUserCelebrity: saveUserCelebrity,
    getUserCelebrity: getUserCelebrity
};