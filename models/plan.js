const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name:        { type: String, required: true },          // Silver, Gold, Platinum
  price:       { type: Number, required: true },          // 3500, 6500, 12000
  duration:    { type: Number, default: 30 },             // days
  description: { type: String },
  features:    [{ type: String }],                        // ["Pool access", "Unlimited classes"]
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);