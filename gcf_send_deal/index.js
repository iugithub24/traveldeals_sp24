// Imports
const {Firestore} = require('@google-cloud/firestore');
require('dotenv').config()
const sgMail = require('@sendgrid/mail');

// Entry function
exports.sendDeals = async (event, context) => {
    const triggerResource = context.resource;

    // Print info on the trigger resource
    console.log(`Function triggered by event on: ${triggerResource}`);
    console.log(`Event type: ${context.eventType}`);

    // Print the entire document object as a JSON string
    console.log("Event value as a JSON string:");
    console.log(JSON.stringify(event.value));

    // Print the locations in the specific deal
    console.log(`All locations in this document:`);
    event.value.fields.location.arrayValue.values.forEach( (c) => {
        console.log(c.stringValue);
    })


    // Connect to the database
    const db = new Firestore({
        projectId: "travel-deals24"
    });

    try {
        // Query Firestore to find deals related to regions watched by subscribers
        const subscribersSnapshot = await db.collection('subscribers').get();

        // Iterate over subscribers
        subscribersSnapshot.forEach(subscriberDoc => {
            const subscriberData = subscriberDoc.data();
            const subscriberEmail = subscriberData.email;
            const watchedRegions = subscriberData.watch_regions;

            // Log the subscriber data
            console.log(`Subscriber Regions ${watchedRegions}`);
            console.log(`Subscriber Email: ${subscriberEmail}`);

            // Query deals for each watched region
            watchedRegions.forEach(async region => {
                const dealsQuerySnapshot = await db.collection('deals').where('location', 'array-contains', region).get();

                // Iterate over deals for the watched region
                dealsQuerySnapshot.forEach(dealDoc => {
                    const dealData = dealDoc.data();
                    const dealHeadline = dealData.headline;

                    // Send email to subscriber about the deal
                    sendEmail(subscriberEmail, dealHeadline);
                });
            });
        });
    } catch (error) {
        console.error('Error querying Firestore:', error);
    }
};


// Helper function to send email
function sendEmail(email, dealHeadline) {

    // Get the API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Create an email message
    const msg = {
    to: email,
    from: process.env.SENDGRID_SENDER,
    subject: `(Areeb) ${dealHeadline}`,
    text: "Check out this new travel deal!",
    html: "Check out this new travel deal!"
    };

    // Send the message through sendgrid
    sgMail
    .send(msg)
    .then(() => {}, error => {
    console.error(error);
    });

    // Log a sent message
    console.log(`Sent email to ${email}`);
};
