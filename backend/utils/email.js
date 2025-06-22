const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendConfirmationEmail = (name, userEmail, itemName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "📩 Enquiry Received!",
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <h2 style="color: #007BFF;">Hi ${name},</h2>
            <p>Thanks for showing interest in <strong>${itemName}</strong>!</p>
            <p>We've received your enquiry and the seller will reach out to you shortly with more details.</p>
            <p>If you have any additional questions, feel free to reply to this email.</p>
            <a href="https://your-marketplace.com/items" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px;">Explore More Items</a>
            <p style="margin-top: 30px; font-size: 14px; color: #777;">If this enquiry was not made by you, please ignore this email.</p>
            <p style="font-size: 12px; color: #aaa;">&copy; ${new Date().getFullYear()} Marketplace Community</p>
            </div>
        </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });
};

module.exports = {sendConfirmationEmail};