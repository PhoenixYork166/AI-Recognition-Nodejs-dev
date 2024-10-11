
// Format & print current dateTime
const printDateTime = () => {
    const now = new Date();

    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

    const formattedTime = now.toLocaleTimeString();

    console.log(`\n============   HTTP Request   ============\n`);
    console.log(`\ndateTime:`);
    console.log(formattedDate);
    console.log(formattedTime);
}

exports.printDateTime = printDateTime;