const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:            { type: String, required: true, trim: true },
  email:           { type: String, required: true, unique: true, lowercase: true },
  password:        { type: String, required: true },
  phone:           { type: String },
  role:            { type: String, enum: ['admin', 'member'], default: 'member' },
  status:          { type: String, enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' },
  plan:            { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  cnic:            { type: String },
  address:         { type: String },
  emergencyContact:{ type: String },
  photo:           { type: String },               // file path
  gymCardNumber:   { type: String },  // e.g. MASS-2025-0001
  memberSince:     { type: Date, default: Date.now },
  renewalDate:     { type: Date },
  createdBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);