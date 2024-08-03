const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://web.whatsapp.com');

  console.log('Please scan the QR code within the next 30 seconds.');
  await new Promise(resolve => setTimeout(resolve, 30000)); // Wait for user to scan QR code

  const sendMessage = async (phoneNumber, filePath) => {
    const chatId = `${phoneNumber}@c.us`;
    const pdfData = fs.readFileSync(filePath);

    // Find the chat
    await page.goto(`https://web.whatsapp.com/send?phone=${phoneNumber}`);
    await page.waitForSelector('div._1awRl.copyable-text.selectable-text', { visible: true });

    // Add a small delay to ensure the chat is loaded
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Attach the PDF
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click('span[data-icon="clip"]') // Click the attachment button
    ]);

    await fileChooser.accept([filePath]);
    await page.waitForSelector('span[data-icon="send"]', { visible: true });
    await page.click('span[data-icon="send"]');

    console.log(`PDF sent to ${phoneNumber}`);
  };

  const phoneNumber = '1234567890'; // Replace with the recipient's phone number
  const filePath = path.resolve(__dirname, 'invoice.pdf'); // Path to the PDF file

  await sendMessage(phoneNumber, filePath);

  await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for the message to be sent
  await browser.close();
})();
