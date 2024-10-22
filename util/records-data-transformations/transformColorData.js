/* *** raw Data Structure => rawArray[51]
        rawArray[
          {
          user_id: Number,
          image_record_id: 1,
          image_url: VARCHAR(255),
          metadata: JSON,
          date_time: timestamp with time zone, // Unique field 2024-10-17 16:34:16.635 +0800
          raw_hex: VARCHAR(7), // image_record_id: 1
          hex_value: VARCHAR(20), // image_record_id: 1
          w3c_name: VARCHAR(50), // image_record_id: 1
          w3c_hex: VARCHAR(7) // image_record_id: 1
          },
          {
          user_id: Number,
          image_record_id: 1,
          image_url: VARCHAR(255),
          metadata: JSON,
          date_time: timestamp with time zone, // Unique field 2024-10-17 16:34:16.635 +0800
          raw_hex: VARCHAR(7), // image_record_id: 1
          hex_value: VARCHAR(20), // image_record_id: 1
          w3c_name: VARCHAR(50), // image_record_id: 1
          w3c_hex: VARCHAR(7) // image_record_id: 1
          },
          {
          user_id: Number,
          image_record_id: 2,
          image_url: VARCHAR(255),
          metadata: JSON{""},
          date_time: timestamp with time zone, // Unique field 2024-10-17 16:34:16.635 +0800
          raw_hex: VARCHAR(7), // image_record_id: 2
          hex_value: VARCHAR(20), // image_record_id: 2
          w3c_name: VARCHAR(50), // image_record_id: 2
          w3c_hex: VARCHAR(7) // image_record_id: 2
          },
          {
          user_id: Number,
          image_record_id: 2,
          image_url: VARCHAR(255),
          metadata: JSON{""},
          date_time: timestamp with time zone, // Unique field 2024-10-17 16:34:16.635 +0800
          raw_hex: VARCHAR(7), // image_record_id: 2
          hex_value: VARCHAR(20), // image_record_id: 2
          w3c_name: VARCHAR(50), // image_record_id: 2
          w3c_hex: VARCHAR(7) // image_record_id: 2
          },
        ]
        
        *** desiredDataStructure =>
          colorRecordsPage[10] => 10 elements per page
          Splitting each colorRecordsPage data based on UNIQUE date_time
        colorRecordsPage[
          {
          // Only need 1 metadata => Based on UNIQUE date_time
          metadata: JSON{"fileMetaDataHash"}, 
          image_record_id: 1,
          //Unqiue entry based on TIME 2024-10-17 16:34:16.635
          date_time: timestamp with time zone, 
          // => rax_hex[] based on image_record_id: 1
          raw_hex: ["VARCHAR(7)", "VARCHAR(7)"], 
          // => rax_hex[] based on image_record_id: 1
          hex_value: ["VARCHAR(20)", "VARCHAR(20)"], 
          // => rax_hex[] based on image_record_id: 1
          w3c_name: ["VARCHAR(50)", "VARCHAR(50)"], 
          // => rax_hex[] based on image_record_id: 1
          w3c_hex: ["VARCHAR(7)", "VARCHAR(7"] 
          },
          {
          // Only need 1 metadata => Based on UNIQUE date_time
          metadata: JSON{"fileMetaDataHash"},
          //Unqiue entry based on TIME 2024-10-17 16:34:16.635
          date_time: timestamp with time zone, 
          image_record_id: 2,
          // => rax_hex[] based on image_record_id: 2
          raw_hex: ["VARCHAR(7)", "VARCHAR(7)"], 
          // => rax_hex[] based on image_record_id: 2
          hex_value: ["VARCHAR(20)", "VARCHAR(20)"],
          // => rax_hex[] based on image_record_id: 2 
          w3c_name: ["VARCHAR(50)", "VARCHAR(50)"], 
          // => rax_hex[] based on image_record_id: 2
          w3c_hex: ["VARCHAR(7)", "VARCHAR(7"] 
          },
        ]
      */
const transformColorData = (rawData) => {
  // Step 1: Group by 'date_time' and 'image_record_id'
  const groupedByDateTime = rawData.reduce((acc, cur) => {
  const dateTime = cur.date_time;
  const recordId = cur.image_record_id;

  if (!acc[dateTime]) {
    acc[dateTime] = {};
  }

  if (!acc[dateTime][recordId]) {
    acc[dateTime][recordId] = {
    metadata: cur.metadata, // Assuming the first metadata encountered is used
    date_time: dateTime,
    image_record_id: recordId,
    raw_hex: [],
    hex_value: [],
    w3c_name: [],
    w3c_hex: []
    };
  } 

  // Append color data
  acc[dateTime][recordId].raw_hex.push(cur.raw_hex);
  acc[dateTime][recordId].hex_value.push(cur.hex_value);
  acc[dateTime][recordId].w3c_name.push(cur.w3c_name);
  acc[dateTime][recordId].w3c_hex.push(cur.w3c_hex);

  return acc;
  }, {});

  // Step 2: Flatten the structure into an array
  let result = [];

  Object.keys(groupedByDateTime).forEach(dateTime => {
  Object.values(groupedByDateTime[dateTime]).forEach(record => {
  result.push(record);
  });
  });

  // Step 3: Implement pagination (10 records per page)
  const pages = [];
  // let pages;

  for (let i = 0; i < result.length; i += 10) {
  pages.push(result.slice(i, i + 10));
  }

  return pages;
}

//module.exports = transformColorData;
// exports.transformColorData = transformColorData;
module.exports = transformColorData;