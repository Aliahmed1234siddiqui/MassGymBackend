const nodemailer = require('nodemailer');

// When using service:'gmail', nodemailer handles host/port automatically
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // your Gmail address
    pass: process.env.EMAIL_PASS,  // Gmail App Password (NOT your login password!)
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to} | MessageId: ${info.messageId}`);
  } catch (err) {
    console.log(`❌ Email FAILED to ${to}:`, err.message);
    throw err;
  }
};

module.exports = sendEmail;