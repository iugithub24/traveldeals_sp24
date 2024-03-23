// Imports
const {Firestore} = require('@google-cloud/firestore');

exports.writeSub = async (message, context) => {
    // Log the message
    console.log(`Encoded message: ${message.data}`);

    // Add a buffer to the message
    const incomingMessage = Buffer.from(message.data, 'base64').toString('utf-8');

    // Parse the incoming JSON data
    const parsedMessage = JSON.parse(incomingMessage);

    // Log the message and email
    console.log(`Decoded message: ${JSON.stringify(parsedMessage)}`);
    console.log(`Email address: ${parsedMessage.email_address}`);

    // Log the watch regions
    parsedMessage.watch_regions.forEach((region, index) => {
        console.log(`${index}: ${region}`);
    });

    // Establish a reference to firestore
    const firestore = new Firestore({
        projectId: "travel-deals24"
    });
       
    // Create a data object to store image info
    let dataObject = {};

    dataObject.email = parsedMessage.email_address;
    dataObject.watch_regions = parsedMessage.watch_regions;

    // Create a new collection within the database and add the object
    let collectionRef = firestore.collection('subscribers');
    let documentRef = await collectionRef.add(dataObject);
    console.log(`Document Created: ${documentRef.id}`);

};