const printDateTime = require('../util/printDateTime').printDateTime;
const { performance } = require('perf_hooks');
const image = require('./image');

const saveUserAgeRecords = (req, res, db, saveBase64Image) => {
    printDateTime();

    const requestHandlerName = `rootDir/controllers/ageRecord\nsaveUserAgeRecords`;
    console.log(`\nJust received an HTTP request for:\n${requestHandlerName}\n`);
    
    const { userId, age, imageUrl, imageBlob, metadata, dateTime } = req.body;

    if (!userId || !age || !imageUrl || !imageBlob || !metadata || typeof userId !== 'number' || typeof age !== 'string' || typeof imageUrl !== 'string' || typeof imageBlob !== 'string' || typeof metadata !== 'string') {
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
    console.log(`\nRequest Handler: `, requestHandlerName, `\n`, `userId: `, userId, `\nage: `, age, `\nimageUrl: `, imageUrl, `\nimageBlob: `, imageBlob, `\nmetada: `, metadata, `\ndateTime: `, dateTime);
    
    return db('age_record')
    .insert({
        user_id: userId,
        age: age,
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
                message: `Failed during ${requestHandlerName} postgres op`
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
          message: `saveUserAgeRecord postgresql op completed successfully!`,
          performance: `Performance: ${duration}ms`
        });
    })
    .catch((err) => {
        console.error(`Error in saving age detection image:\n`, err, `\n`);
        res.status(500).json({
          success: false,
          status: { code: 500 },
          message: `Failed during saving age detection image to server`,
          error: err.toString()
        });
    });
};

/* PostgreSQL 
SELECT 
    u.id AS user_id,
    ar.id AS age_record_id,
    ar.image_url,
    ar.image_blob,
    ar.image_metadata,
    ar.date_time
FROM
    users u
JOIN
    age_record ar ON u.id = ar.user_id
WHERE
    u.id = 1
    AND ar.id IN (
        SELECT ar.id
        FROM age_record ar 
        WHERE ar.user_id = 1
        ORDER BY ar.date_time DESC
        LIMIT 10
    )
ORDER BY
    ar.date_time DESC;
*/
const getUserAgeRecords = (req, res, db) => {
    printDateTime();
    const start = performance.now();

    const requestHandlerName = `rootDir/controllers/ageRecords.js\ngetUserAgeRecords()`;
    
    const { userId } = req.body;

    if (!userId || typeof userId !== 'number') {
        return res.status(400).json({ 
          success: false, 
          status: { code: 400 }, 
          message: `Invalid inputs for userId: ${userId} undefined`, 
        });
    }

    const subquery = db('age_record as ar')
    .select('ar.id')
    .where('ar.user_id', 1)
    .orderBy('ar.date_time', 'desc')
    .limit(10);

    const mainQuery = db('users as u')
        .join('age_record as ar', 'u.id', 'ar.user_id')
        .select(
            'u.id as user_id',
            'ar.id as age_record_id',
            'ar.age',
            'ar.image_url',
            'ar.image_blob',
            'ar.date_time'
        )
        .where('u.id', 1)
        .whereIn('ar.id', subquery)
        .orderBy('ar.date_time', 'desc');

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
            message: `Transaction for Express RequestHandler: ${requestHandlerName} completed!`, performance: `Performance for db.transaction(trx) => getUserAgeRecords is: ${duration}ms`,
            ageData: rows
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
    saveUserAgeRecords: saveUserAgeRecords,
    getUserAgeRecords: getUserAgeRecords
};