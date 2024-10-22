/* ***
Save .jpg image input by users locally to Node.js server
saveBase64Image(imageRecord.metada, imageRecord.userId.toString());
console.log(`\nbase64Data:`, base64Data, `\n`);

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
*/

const fs = require('fs');
const path = require('path');
const saveBase64Image = async (base64Data, userId) => {
    if (!base64Data) {
      console.error(`\nNo base64Data provided for userId: `, userId, `\n`);
      return; // Exit the function if no data is provided
    }

    if (!userId) {
      console.error(`\nNo userId in saveBase64Image(): `, userId, `\n`);
      return;
    }

    const date = new Date().toISOString().replace(/:/g, '-');  // Format date for filename
    const filename = `user_id_${userId}-${date}.jpg`;
    const filepath = path.join(__dirname, '..', 'user_images', filename);
    
    // Check if base64Data is a valid base64 string
    if (typeof base64Data === 'string' && base64Data.indexOf(';base64,') !== -1 ) {
      // Convert base64 to raw binary data held in a string
      const base64Image = base64Data.split(';base64,').pop(); // Strip header if present
    
      return await fs.writeFile(filepath, base64Image, { encoding: 'base64' }, (err) => {
        if (err) {
          console.error('\nFailed to write image file:', err, `\n`);
        } else {
          console.log('\nImage file saved:', filepath, `\n`);
        }
      });
    } else {
      console.error(`\nInvalid base64Data or format for userId: `, userId, `\n`);
    }   
}

module.exports = saveBase64Image;