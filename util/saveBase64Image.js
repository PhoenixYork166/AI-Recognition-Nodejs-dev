const fs = require('fs');
const path = require('path');

const saveBase64Image = (base64Data, userId) => {
    const date = new Date().toISOString().replace(/:/g, '-');  // Format date for filename
    const filename = `user_id_${userId}-${date}.jpg`;
    const filepath = path.join(__dirname, 'user_images', filename);
    
    // Convert base64 to raw binary data held in a string
    const base64Image = base64Data.split(';base64,').pop(); // Strip header if present
  
    fs.writeFile(filepath, base64Image, { encoding: 'base64' }, (err) => {
      if (err) {
        console.error('Failed to write image file:', err);
      } else {
        console.log('Image file saved:', filepath);
      }
    });
}

module.exports = {
    saveBase64Image: saveBase64Image
};
// exports.saveBase64Image = saveBase64Image;