const asyncHandler = require('express-async-handler');
const Payment      = require('../models/payment');
const User         = require('../models/user');
const { generatePaymentReport } = require('../utils/generate-report');

// GET /api/reports/payments?startDate=&endDate=
exports.getPaymentReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, format } = req.query;
  const query = { status: 'Paid' };
  if (startDate || endDate) {
    query.paidAt = {};
    if (startDate) query.paidAt.$gte = new Date(startDate);
    if (endDate)   query.paidAt.$lte = new Date(endDate);
  }
  const payments = await Payment.find(query)
    .populate('member', 'name email gymCardNumber')
    .populate('plan',   'name price')
    .sort('-paidAt');

  if (format === 'pdf') return generatePaymentReport(payments, res);

  const total = payments.reduce((sum, p) => sum + p.amount, 0);
  res.json({ count: payments.length, total, payments });
});

// GET /api/reports/members
exports.getMemberReport = asyncHandler(async (req, res) => {
  const members = await User.find({ role: 'member' })
    .populate('plan', 'name price').select('-password').sort('-createdAt');
  res.json({ count: members.length, members });
});