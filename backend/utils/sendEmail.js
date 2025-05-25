const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail", // or "Outlook", "Yahoo", or use SMTP
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"CocoSmart" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
    });
};

module.exports = sendEmail;
