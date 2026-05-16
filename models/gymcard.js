const mongoose = require('mongoose');

const gymCardSchema = new mongoose.Schema({
  member:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  cardNumber:    { type: String, required: true, unique: true },   // MASS-2025-0001
  qrCode:        { type: String },                                  // base64 QR string
  issuedDate:    { type: Date, default: Date.now },
  expiryDate:    { type: Date, required: true },
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('GymCard', gymCardSchema);