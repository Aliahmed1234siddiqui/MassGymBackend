const QRCode = require('qrcode');

// Generates card number like MASS-2025-0042
const generateCardNumber = (index) => {
  const year = new Date().getFullYear();
  const num  = String(index).padStart(4, '0');
  return `MASS-${year}-${num}`;
};

// Generates QR code as base64 string
const generateQR = async (cardNumber) => {
  return QRCode.toDataURL(cardNumber);
};

module.exports = { generateCardNumber, generateQR };