const rootDir = require('../util/path');

require('dotenv').config({ path: `${rootDir}/controllers/.env`});

const printDateTime = require('../util/printDateTime').printDateTime;
const { performance } = require('perf_hooks');

// Express Request Handler POST route http://localhost:3000/save-user-color
/* From Frontend React
    // table `image_record`
    // const imageRecord = {
    //   userId: user.id,
    //   imageUrl: input,
    //   metadata: resData,
    //   dateTime: new Date().toISOString()
    // };
    // table `image_details`
    // const imageDetails = color_props_array.map((eachColor) => {
    //   return {
    //     raw_hex: eachColor.colors.raw_hex,
    //     value: eachColor.colors.value,
    //     w3c_hex: eachColor.colors.w3c.hex,
    //     w3c_name: eachColor.colors.w3c.name
    //   }
    // });
  
    // From PostgreSQL 
    // table `image_record`
    // id serial PRIMARY KEY,
    // user_id integer NOT NULL,
    // input TEXT NOT NULL,
    // metadata JSONB NOT NULL,
    // date_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    // FOREIGN KEY (user_id) REFERENCES users(id)
  
    // From PostgreSQL
    // table `image_details`
    // id serial PRIMARY KEY
    // image_id INT NOT NULL, --Assuming `image_record`.`id` INT
    // raw_hex VARCHAR(7) NOT NULL, --hex #ffffff
    // value INT NOT NULL, --hex #ffffff
    // w3c_hex VARCHAR(7) NOT NULL,
    // w3c_name VARCHAR(50) NOT NULL,
    // FOREIGN KEY (image_id) REFERENCES image_record(id)
    
    console.log(`\nExpress RequestHandler:\n${requestHandlerName}\n`);
    console.log(`\nreq.body.imageRecord.metadata:\n`, imageRecord.metadata, `\n`);
    console.log(`\ntypeof req.body.imageRecord.metadata:\n`, typeof imageRecord.metadata, `\n`);
    console.log(`\nreq.body.userId:\n`, userId, `\n`);
    console.log(`\ntypeof req.body.userId:\n`, typeof userId, `\n`);
    console.log(`\nreq.body.imageRecord.imageUrl:\n`, imageRecord.imageUrl, `\n`);
    console.log(`\ntypeof req.body.imageRecord.imageUrl:\n`, typeof imageRecord.imageUrl, `\n`);

    // console.log(`\nreq.body.imageRecord.metadata.length:\n`, imageRecord.metadata.length, `\n`);
*/

/* Create a PostgreSQL transaction to perform:
1. INSERT imageRecord received from Frontend React to table `imageRecord`
    {
       userId: 1,
       imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Brad_Pitt_2019_by_Glenn_Francis.jpg/399px-Brad_Pitt_2019_by_Glenn_Francis.jpg',
       metadata: {},
       dateTime: '2024-10-14T11:10:31.234Z'
    }
2. INSERT imageDetails received from Frontend React to table `imageDetails`
    [
    {
      raw_hex: '#bcbbb2',
      value: 0.29,
      w3c_hex: '#c0c0c0',
      w3c_name: 'Silver'
    },
    {
      raw_hex: '#0d1016',
      value: 0.2295,
      w3c_hex: '#000000',
      w3c_name: 'Black'
    }
    ] 
*/
    
/* Knex.js PostgreSQL transaction INSERT
Batch1
    db
    .select('*')
    .from('image_record')
    .then((result) => {
      console.log(`\nData retrieved: `, result, `\n`);
    })
    .catch((err) => {
      console.error(`\nError fetching data: `, err, `\n`);
    })
Batch2
    db.insert({
      user_id: parseInt(imageRecord.userId, 10),
      image_url: imageRecord.imageUrl,
      metadata: JSON.stringify(imageRecord.metadata),
      date_time: new Date().toISOString()
    })
    .into('image_record')
    .returning('id')
    .then((image_ids) => {
      const image_id = image_ids[0].id;
  
      console.log(`\nAfter db.transaction((trx) => {\n\ttrx.insert({\n\t\tuser_id: ${imageRecord.userId},\n\t\timage_url: '${imageRecord.imageUrl}',\n\t\tmetadata: 'someMetadata'\n\t\tdate_time: '${date_time}'\n\t})\n\t.into('image_record')\n\t.returning('id')\n\n`, image_id, `\n`);
    })
    .catch((err) => {
      console.error(`\nError Transaction for Express RequestHandler:\n${requestHandlerName}\nfailed...\n`, `Error:\n`, err, `\n`);
  
      res.status(500).json({ status: { code: 500 }, success: false, message: `Internal Server Error`, error: err.toString()});
    })
*/
const saveUserColor = (req, res, db, saveBase64Image) => {
  printDateTime();
  
  const { userId, imageRecord, imageDetails } = req.body;
  // Type safety without using TypeScript
  const date_time = new Date().toISOString();
  const userIdInt = parseInt(userId, 10);
  const base64Metadata = JSON.stringify(imageRecord.metadata);

  const start = performance.now();
  const requestHandlerName = `rootDir/controllers/colorRecords.js\nsaveColor()`;
  console.log(`\nStart processing ${requestHandlerName}\n`);
  console.log(`\nreq.body.userId: `, userId, `\n`);

  db.transaction((trx) => {
    trx.insert({
      user_id: userIdInt,
      image_url: imageRecord.imageUrl,
      metadata: base64Metadata,
      date_time: date_time
    })
    .into('image_record')
    .returning('id')
    .then((image_ids) => {
      const image_id = image_ids[0].id;
      console.log(`\nAfter db.transaction insert image_id: ${image_id}\n`);

      const detailInserts = imageDetails.map((eachImageDetail) => ({
        image_id: image_id,
        raw_hex: eachImageDetail.raw_hex,
        hex_value: eachImageDetail.value,
        w3c_hex: eachImageDetail.w3c_hex,
        w3c_name: eachImageDetail.w3c_name
      }));

      return trx('image_details').insert(detailInserts);
      })
      .then(() => {
        // Committing the transaction only when all inserts are successful
        console.log('Transaction commit');
        trx.commit();
      })
      .then(() => {
        console.log('Proceeding to save base64 image.');
        // Allow Promise chaining by return
        return saveBase64Image(base64Metadata, userIdInt);
      })
      .then((saveBase64Results) => {
        const end = performance.now();
        const duration = end - start;
        console.log(`Performance for saveBase64Image locally to Node.js server is: ${duration}ms\n`);
        
        res.status(200).json({
          success: true,
          status: { code: 200 },
          message: `Transaction completed successfully!`,
          performance: `Duration: ${duration}ms`
        });
      })
      .catch((err) => {
        console.error(`Error in transaction or saving image:\n`, err);
        trx.rollback();
        res.status(500).json({
          success: false,
          status: { code: 500 },
          message: `Failed during transaction or image saving`,
          error: err.toString()
        });
      });
  })
  .catch((err) => {
    console.error(`Transaction failed to begin:\n`, err);
    res.status(500).json({
      success: false,
      status: { code: 500 },
      message: `Transaction failed to start`,
      error: err.toString()
    });
  });
};


/* From PostgreSQL => Replace all 1 to userId */
/* 
SELECT 
  u.id AS user_id, 
  ir.id AS image_record_id, 
  ir.image_url, 
  ir.metadata, 
  ir.date_time, 
  id.raw_hex, 
  id.hex_value, 
  id.w3c_hex, 
  id.w3c_name
FROM 
  users u
JOIN 
  image_record ir ON u.id = ir.user_id
JOIN 
  image_details id ON ir.id = id.image_id
WHERE 
  u.id = 1
  AND ir.id IN (
    SELECT ir.id
    FROM image_record ir
    WHERE ir.user_id = 1
    ORDER BY ir.date_time DESC
    LIMIT 10
  )
ORDER BY 
  ir.date_time DESC;
*/
const getUserColor = (req, res, db, transformColorData) => {
    printDateTime();
    const start = performance.now();

    const requestHandlerName = `rootDir/controllers/colorRecords.js\ngetUserColor()`;
    
    const { userId } = req.body;
    // console.log(`\ntypeof userId:\n`, typeof userId, `\n`);

    // if (typeof userId !== String) {
    //   console.error(`\n${requestHandlerName} typeof userId!== String`);
    //   console.log(`\n${requestHandlerName} typeof userId: `, typeof userId, `\n`);
    //   return;
    // }

    console.log(`\nExpress RequestHandlerName: \n${requestHandlerName}\n`);
    console.log(`\nreq.body.userId:\n`, userId, `\n`);
  
    /* Knex.js PostgreSQL */
    db.select(
      'u.id as user_id',
      'ir.id as image_record_id',
      'ir.image_url',
      'ir.metadata',
      'ir.date_time',
      'id.raw_hex',
      'id.hex_value',
      'id.w3c_hex',
      'id.w3c_name'
    )
    .from('users as u')
    .join('image_record as ir', 'u.id', 'ir.user_id')
    .join('image_details as id', 'ir.id', 'id.image_id')
    .whereIn('ir.id', db('image_record as ir')
    .select('ir.id')
    .where('ir.user_id', userId)
    .orderBy('ir.date_time', 'desc')
    .limit(10)
    )
    .where('u.id', userId)
    .orderBy('ir.date_time', 'desc')
    .then((sqlResults) => {
      const end = performance.now();
      const duration = end - start;

      console.log(`\n\nExpress RequestHandler:\n${requestHandlerName}\n`);
      console.log(`\nSucceeded in retrieving\nuser: ${userId}\nColor Records from PostgreSQL\n`);
      console.log(`\nPerformance for PostgreSQL operation is:\n${duration}ms\n`);

      if (!sqlResults || sqlResults.length === 0) {
        throw new Error(`\nNo userColorRecords found\n`);
      }

      return { sqlResults, transformColorData };
    })
    .then(async ({ sqlResults, transformColorData }) => {
      console.log(`\n\nLast Promise for ${requestHandlerName}\nsqlResults:\n`, sqlResults, `\n\ntpyeof transformColorData`, typeof transformColorData, `\n`);

      console.log(`\n\nProceed to re-arrange rawData retrieved from PostgreSQL:\n`);       
      
      try {
        // Detailed implementation => see backend/util/records-data-transformations/transformColorData.js
        const transformedData = await transformColorData(sqlResults);

        const end = performance.now();
        const duration = end - start;

        console.log(`\n\nSucceeded in transforming userColorRecords retrieved from PostgreSQL\n`);
        console.log(`\n\nPerformance for transforming Data Structure for\nExpress RequestHandler:\n${requestHandlerName}\nis:\n${duration}ms\n`);

        return res.status(200).json({ 
          success: true, 
          status: { code: 200 }, 
          message: `Transaction for Express RequestHandler: ${requestHandlerName} completed!`, performance: `Performance for db.transaction(trx) => transformColorData is: ${duration}ms`,
          colorData: transformedData
        });
      } catch (err) {
        throw new Error (`\nError transforming userColorRecords: ${err}\n`);
      }
    })
    .catch((err) => {
      console.error(`\nError in Express RequestHandler:\n${requestHandlerName}\n\nError: ${err}\n`);

      return res.status(501).json({ 
        success: false, 
        status: { code: 501 }, 
        message: `Failed Express RequestHandler ${requestHandlerName}Internal Server Error`, 
        error: err.toString()
      });
    });
};


module.exports = {
    saveUserColor: saveUserColor,
    getUserColor: getUserColor
};