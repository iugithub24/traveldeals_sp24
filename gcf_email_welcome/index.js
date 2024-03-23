// Imports
require('dotenv').config()
const sgMail = require('@sendgrid/mail');

// Entry functions
exports.sendWelcome = (message, context) => {

  // Log the message
  console.log(`Encoded message: ${message.data}`);

  // Add a buffer to the message
  const incomingMessage = Buffer.from(message.data, 'base64').toString('utf-8');

  // Parse the incoming JSON data
  const parsedMessage = JSON.parse(incomingMessage);

  // Log the message and email
  console.log(`Decoded message: ${JSON.stringify(parsedMessage)}`);
  console.log(`Email address: ${parsedMessage.email_address}`);

  // Get the API key
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Create an email message
  const msg = {
    to: parsedMessage.email_address,
    from: process.env.SENDGRID_SENDER,
    subject: "Thanks for signing up for TravelDeals!",
    text: "Thanks for signing up. We can't wait to share deals with you.",
    html: "Thanks for signing up. We can't wait to share <strong>awesome</strong> deals with you."
  };

  // Send the message through sendgrid
  sgMail
  .send(msg)
  .then(() => {}, error => {
    console.error(error);
  });

}