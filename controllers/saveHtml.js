const printDateTime = require('../util/printDateTime').printDateTime;
const fs = require('fs').promises;
const path = require('path');

// create / route as an Actuactor for health-checks
const saveHtml = async (req, res, puppeteer) => {
    printDateTime();
    const { htmlContent } = req.body;
    const callbackName = `saveHtml`;

    console.log(`\nJust received an HTTP request for:\n${callbackName}\n`);
    console.log(`\nreq.body.htmlContent:\n`, htmlContent, `\n`);

    try {
        const date = new Date().toISOString().replace(/:/g, '-');  // Format date for filename
        // Define path for saving PDF to Node server
        const pdfPath = path.join(__dirname, '..', 'user-pdf', `output_${date}.pdf`);

        // const browser = await puppeteer.launch();
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Ensure Puppeteer runs in a safe environment if using Docker or any Linux-based server.
        });      

        const page = await browser.newPage();

        await page.setContent(htmlContent);

        // await page.setContent(htmlContent);
        const pdfBuffer = await page.pdf({ 
            format: 'A4', 
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            },
            landscape: true, 
            printBackground: true 
        });       
        
        console.log(`\nSaving PDF to: ${pdfPath}\n`);
        console.log(`\nGenerated PDF size:\n${pdfBuffer.length/1024} kb\n`);
        
        // Write PDF to a .pdf file in Node server
        await fs.writeFile(pdfPath, pdfBuffer);
        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(pdfPath)}"`);

        // Send the file
        res.sendFile(pdfPath, (err) => {
            if (err) {
                console.error('File send failed:', err);
                res.status(500).send('Error sending file!');
            } else {
                console.log('File sent successfully.');
            }
        });

        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', `attachment; filename="color-details_${date}.pdf"`);
        // res.setHeader('Content-Length', pdfBuffer.length);
        // res.send(pdfBuffer);

    } catch (err) {
        console.error(`\nError generating PDF: `, err, `\n`);
        res.status(500).json({ status: { code: 500 }, error: `Error generating PDF: ${err}` });
    }
};

module.exports = {
    saveHtml: saveHtml
};