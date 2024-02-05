const express = require('express');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');
const axios = require('axios');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'reba.kihn@ethereal.email',
    pass: 'hS6qXGCkW2E1UygjDN'
  }
});

let contractAddress = '';
let eventName = '';
let recipientEmail = '';

const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/3topTnnh-PPSDB8zI4MCLJbCfG2Wkpx1');

const polygonScanApiKey = 'XB61QPDHJQA19IXP8TEEUJ83YTS4NY5BRH';

async function getContractABI(contractAddress) {
    try {
      const polygonScanApiUrl = `https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${contractAddress}&apikey=${polygonScanApiKey}`;
      const response = await axios.get(polygonScanApiUrl);
  
      if (response.data.status === '1') {
        return JSON.parse(response.data.result);
      } else {
        throw new Error('Failed to fetch contract ABI from PolygonScan');
      }
    } catch (error) {
      throw new Error(`Error getting contract ABI: ${error.message}`);
    }
  }

async function setupEventListener() {
  const contractABI = await getContractABI(contractAddress);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  const eventFilter = contract.filters[eventName]();

  contract.on(eventFilter, (event) => {
    const message = `Event "${eventName}" occurred: ${JSON.stringify(event)}`;
    console.log(message);

    sendEmail('New Event Notification', message)
      .then(() => console.log('Email sent successfully.'))
      .catch((error) => console.error('Error sending email:', error));
  });

  console.log('Listening for events. Press Ctrl+C to exit.');
}

async function sendEmail(subject, text) {
  const mailOptions = {
    from: 'Your App Name',
    to: recipientEmail,
    subject: subject,
    text: text,
  };

  return transporter.sendMail(mailOptions);
}

app.post('/configure', async (req, res) => {
  try {
    // Get contract address, event name, and recipient email from the request body
    const { contract, event, email } = req.body;

    // Set the values globally
    contractAddress = contract;
    eventName = event;
    recipientEmail = email;

    // Start setting up the event listener
    await setupEventListener();

    res.status(200).json({ success: true, message: 'Configuration successful' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
