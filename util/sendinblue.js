// util/sendinblue.js
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

const sendResetEmail = async (to, resetUrl) => {
    const apiKey = process.env.SENDINBLUE_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL;

    const emailData = {
        sender: { email: senderEmail },
        to: [{ email: to }],
        subject: 'Reset Your Password',
        htmlContent: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
    };

    try {
        await axios.post('https://api.sendinblue.com/v3/smtp/email', emailData, {
            headers: { 'api-key': apiKey, 'Content-Type': 'application/json' }
        });
        console.log('Reset password email sent to : ',to);
    } catch (err) {
        console.error('Error sending email:', err);
        throw err;
    }
};

module.exports = sendResetEmail;

