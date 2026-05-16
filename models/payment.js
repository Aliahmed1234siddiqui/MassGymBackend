const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },          // INV-2025-0001
  member:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan:          { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  amount:        { type: Number, required: true },
  method:        { type: String, enum: ['Cash', 'Card', 'Bank Transfer'], required: true },
  status:        { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
  paidAt:        { type: Date },
  dueDate:       { type: Date },
  note:          { type: String },
  recordedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // admin
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);