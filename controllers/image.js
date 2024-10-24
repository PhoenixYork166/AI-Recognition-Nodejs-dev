const rootDir = require('../util/path');
require('dotenv').config({ path: `${rootDir}/controllers/.env`});

const printDateTime = require('../util/printDateTime').printDateTime;

// PUT to update entries
/* Declaring a custom callback to accept passed-in param 'imageUrl' */
const returnClarifaiRequestOptions = (imageUrl) => {
    printDateTime();

    if (!imageUrl || typeof imageUrl !== 'string') {
      return res.status(500).json({
        success: false,
        status: { code: 500 },
        message: `Invalid inputs`
      });
    }
    
    const PAT = process.env.PAT;
    const USER_ID = process.env.USER_ID;
    const APP_ID = process.env.APP_ID;
    const IMAGE_URL = imageUrl;

    const callbackName = `returnClarifaiRequestOptions`;
    console.log(`\nJust received an HTTP request for:\n${callbackName}\n\nimageUrl:\n${imageUrl}\n`);
  
    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID
      },
      inputs: [
        {
          data: {
            image: {
              url: IMAGE_URL
            }
          }
        }
      ]
    });
  
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Key ' + PAT
      },
      body: raw
    };
    return requestOptions;
};

//   console.log(returnClarifaiRequestOptions("https://upload.wikimedia.org/wikipedia/commons/4/4d/Beautiful_landscape.JPG"));

const handleCelebrityApi = (req, res, fetch) => {
    const input = req.body.input;

    const requestHandlerName = `rootDir/controllers/image.js`;

    if (!input || typeof input !== 'string') {
      return res.status(500).json({
        success: false,
        status: { code: 500 },
        message: `${requestHandlerName}\nInvalid Input: ${input}`
      });
    }

    console.log(`req.body.input:\n${input}\ntypeof req.body.input:\n${typeof input}`);

    const API_BASE_URL = 'https://api.clarifai.com/v2/models/' +
          'celebrity-face-detection' +
          '/outputs';

    fetch(
        API_BASE_URL,
        returnClarifaiRequestOptions(input)
      )
      .then(response => {
        if (!response?.ok) {
          console.error(`\nFetched API\nYet failed to retrieve data...\n`);
          throw new Error(`Failed to fetch from API, status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data) {
          throw new Error(`\nNo data returned by fetching ${API_BASE_URL}\n`);
        }
        res.status(200).json(data);
      })
      .catch(err => {
        console.error(`\nError during fetch operation: ${err}\n`);
        res.status(502).json({ error: `Unable to fetch API...`, details: err.toString() });
      });
};

const handleColorApi = (req, res, fetch) => {
    const input = req.body.input;
    const requestHandlerName = `handleColorApi`;

    if (!input || typeof input !== 'string') {
      return res.status(400).json({
        success: false,
        status: { code: 400 },
        message: `${requestHandlerName} Invalid input: ${input}`
      });
    }

    console.log(`\nreq.body.input:\n${input}\ntypeof input:\n${typeof input}\n`);
    const API_BASE_URL = 'https://api.clarifai.com/v2/models/' +
          'color-recognition' +
          '/outputs';

    // fetch
    fetch(
        API_BASE_URL,
        returnClarifaiRequestOptions(input)
      )
      .then(response => {
        if (!response?.ok) {
          console.error(`\nFetched API\nYet failed to retrieve data...\n`);
          throw new Error(`Failed to fetch from API, status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data) {
          throw new Error(`\nNo data returned by fetching ${API_BASE_URL}\n`);
        }
        res.status(200).json(data);
      })
      .catch(err => {
        res.status(502).json({ error: `Unable to fetch API...`, details: err.toString() });
      });
};

const handleAgeApi = (req, res, fetch) => {
    const input = req.body.input;
    const requestHandlerName = `handleAgeApi`;

    if (!input || typeof input !== 'string') {
      return res.status(400).json({
        success: false,
        status: { code: 400 },
        message: `${requestHandlerName} Invalid input: ${input}`
      });
    }

    console.log(`req.body.input:\n${input}\ntypeof req.body.input:\n${typeof input}`);
    const API_BASE_URL = 'https://api.clarifai.com/v2/models/' +
          'age-demographics-recognition' +
          '/outputs';

    // fetch
    fetch(
        API_BASE_URL,
        returnClarifaiRequestOptions(input)
      )
      .then(response => {
        if (!response?.ok) {
          console.error(`\nFetched API\nYet failed to retrieve data...\n`);
          throw new Error(`Failed to fetch from API, status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data) {
          throw new Error(`\nNo data returned by fetching ${API_BASE_URL}\n`);
        }
        res.status(200).json(data);
      })
      .catch(err => {
        res.status(502).json({ error: `Unable to fetch API...`, details: err.toString() });
      });
};

const handleImage = (req, res, db) => {
  printDateTime();
  const requestHandlerName = `handleImage`;

  const { id } = req.body;

  if (!id || typeof id !== 'number') {
    return res.status(400).json({
      success: false,
      status: { code: 400 },
      message: `${requestHandlerName} Invalid id: ${id}`
    });
  }
  
  // To store entries increase to DB
  db('users')
  .where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
      console.log(`\nentries stored to DB: ${entries[0].entries}`);
      // return updated entries for frontend
      res.status(200).json(entries[0].entries);
  })
  .catch(err => res.status(400).json(`unable to get entries\n${err}`))
};

module.exports = {
    handleImage: handleImage,
    handleCelebrityApi: handleCelebrityApi,
    handleColorApi: handleColorApi,
    handleAgeApi: handleAgeApi
};

