const rootDir = require('../util/path');

require('dotenv').config({ path: `${rootDir}/controllers/.env`});

const printDateTime = require('../util/printDateTime').printDateTime;
const { performance } = require('perf_hooks');

const fs = require('fs');
const path = require('path');

// Express Request Handler POST route http://localhost:3000/save-user-color
const saveUserColor = (req, res, db) => {
    printDateTime();

    const start = performance.now();
    const requestHandlerName = `rootDir/controllers/image.js\nsaveColor()`;
  
    // From Frontend React
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
  
    const { userId, imageRecord, imageDetails } = req.body;
  
    // console.log(`\nExpress RequestHandler:\n${requestHandlerName}\nreq.body.imageRecord:\n`, imageRecord, `\n\nreq.body.imageDetails:\n`, imageDetails, `\n`);
    // console.log(`\nreq.body.imageRecord.metadata:\n`, imageRecord.metadata, `\n`);
    console.log(`\ntypeof req.body.imageRecord.metadata:\n`, typeof imageRecord.metadata, `\n`);
    console.log(`\nreq.body.imageRecord.userId:\n`, imageRecord.userId, `\n`);
    console.log(`\ntypeof req.body.imageRecord.userId:\n`, typeof imageRecord.userId, `\n`);
    console.log(`\nreq.body.imageRecord.imageUrl:\n`, imageRecord.imageUrl, `\n`);
    console.log(`\ntypeof req.body.imageRecord.imageUrl:\n`, typeof imageRecord.imageUrl, `\n`);

    // console.log(`\nreq.body.imageRecord.metadata.length:\n`, imageRecord.metadata.length, `\n`);
  
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
    
    // SELECT * FROM `image_record`
    /*
    db
    .select('*')
    .from('image_record')
    .then((result) => {
      console.log(`\nData retrieved: `, result, `\n`);
    })
    .catch((err) => {
      console.error(`\nError fetching data: `, err, `\n`);
    })
    */
  
    /* Knex.js PostgreSQL INSERT */
    /*
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
    
    /* Knex.js PostgreSQL transaction */
    db.transaction((trx) => {
      const date_time = new Date().toISOString();
  
      trx.insert({
        user_id: parseInt(userId, 10),
        image_url: imageRecord.imageUrl,
        metadata: JSON.stringify(imageRecord.metadata),
        date_time: new Date().toISOString()
      })
      .into('image_record')
      .returning('id') // To store `image_record`.`id` into `image_details`.`image_id` too
      .then((image_ids) => {
        const image_id = image_ids[0].id; // Assuming 1st image_id is needed
        console.log(`\nAfter db.transaction((trx) => {\n\ttrx.insert({\n\t\tuser_id: ${imageRecord.userId},\n\t\timage_url: '${imageRecord.imageUrl}',\n\t\tmetadata: 'someMetadata'\n\t\tdate_time: '${date_time}'\n\t})\n\t.into('image_record')\n\t.returning('id')\n\n`, image_id, `\n`);
  
        // Mapping out each imageDetails
        const detailInserts = imageDetails.map((eachImageDetail) => {
          return {
            image_id: image_id,
            raw_hex: eachImageDetail.raw_hex,
            hex_value: eachImageDetail.value,
            w3c_hex: eachImageDetail.w3c_hex,
            w3c_name: eachImageDetail.w3c_name
          };
        });
  
        // Insert all mapped records to table `image_details`
        return trx('image_details').insert(detailInserts);
      })
      .then(trx.commit) // no error => commit transaction
      // in case registration failed => rollback both 'login' && 'users' SQL transactions
      .catch(trx.rollback); // Rollback transaction in case of any error during the transaction
    })
    .then(() => {
      console.log(`\nTransaction for Express RequestHandler:\n${requestHandlerName}completed!\n`);
      console.log(`\nProceed to store imageRecord.metadata 'base64' to Node server locally for imageRecord.metadata\n\n`);
      
      // Save .jpg image input by users locally to Node.js server
      // saveBase64Image(imageRecord.metada, imageRecord.userId.toString());

      const date = new Date().toISOString().replace(/:/g, '-');  // Format date for filename
      const base64Data = imageRecord.metadata;

      const filename = `user_id_${userId}-${date}.jpg`;
      // const filepath = path.join(__dirname, 'user_images', filename);
      const filepath = path.join(rootDir, 'user_images', filename);
    
      // Convert base64 to raw binary data held in a string
      const base64Image = base64Data.split(';base64,').pop(); // Strip header if present
  
      fs.writeFile(filepath, base64Image, { encoding: 'base64' }, (err) => {
        if (err) {
            console.error('Failed to write image file:', err);
        } else {
            console.log('Image file saved:', filepath);
        }
      });

      const end = performance.now();
      const duration = end - start;

      res.status(200).json({ success: true, status: { code: 200 }, message: `Transaction for Express RequestHandler: ${requestHandlerName} completed!`, performance: `Performance for db.transaction(trx) => saveBase64Image locally to Node.js server is: ${duration}ms` });
    })
    .catch((err) => {
      console.error(`\nError for Express RequestHandler:\n${requestHandlerName}\nfailed...\n`, `Error:\n`, err, `\n`);
  
      res.status(500).json({ success: false, status: { code: 500 }, message: `Internal Server Error`, error: err.toString()});
    });
}
  
const getUserColor = (req, res, db) => {
    printDateTime();
    const requestHandlerName = `rootDir/controllers/image.js\ngetUserColor()`;
  
    // From PostgreSQL 
    // SELECT 
    //   u.id AS user_id, 
    //   ir.id AS image_record_id, 
    //   ir.image_url, 
    //   ir.metadata, 
    //   ir.date_time, 
    //   id.raw_hex, 
    //   id.hex_value, 
    //   id.w3c_hex, 
    //   id.w3c_name
    // FROM 
    //   users u
    // JOIN 
    //   image_record ir ON u.id = ir.user_id
    // JOIN 
    //   image_details id ON ir.id = id.image_id
    // WHERE 
    //   u.id = 1
    //   AND ir.id IN (
    //       SELECT ir.id
    //       FROM image_record ir
    //       WHERE ir.user_id = 1
    //       ORDER BY ir.date_time DESC
    //       LIMIT 10
    //   )
    // ORDER BY 
    //   ir.date_time DESC;
  
    const { userId } = req.body;
  
    console.log(`\nreq.body.userId:\n`, userId, `\n`);
  
    
    /* Knex.js PostgreSQL transaction */
    // db
    // .then(() => {
    //   console.log(`\nTransaction for Express RequestHandler:\n${requestHandlerName}completed!\n`);
    //   res.status(200).json({ success: true, status: { code: 200 }, message: `Transaction for Express RequestHandler: ${requestHandlerName} completed!` });
    // })
    // .catch((err) => {
    //   console.error(`\nError Transaction for Express RequestHandler:\n${requestHandlerName}\nfailed...\n`, `Error:\n`, err, `\n`);
  
    //   res.status(500).json({ success: false, status: { code: 500 }, message: `Internal Server Error`, error: err.toString()});
    // });
};


module.exports = {
    saveUserColor: saveUserColor,
    getUserColor: getUserColor
};