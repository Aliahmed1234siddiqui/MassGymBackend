const asyncHandler = require('express-async-handler');
const User     = require('../models/user');
const Payment  = require('../models/payment');
const Plan   = require('../models/plan');
const Notification = require('../models/notification');

exports.getStats = asyncHandler(async (req, res) => {
  const now      = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalMembers, activeMembers, suspendedMembers,
    totalRevenue, monthRevenue,
    pendingPayments, overduePayments,
    planBreakdown,
  ] = await Promise.all([
    User.countDocuments({ role: 'member' }),
    User.countDocuments({ role: 'member', status: 'Active' }),
    User.countDocuments({ role: 'member', status: 'Suspended' }),
    Payment.aggregate([{ $match: { status: 'Paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Payment.aggregate([{ $match: { status: 'Paid', paidAt: { $gte: firstDay } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Payment.countDocuments({ status: 'Pending' }),
    Payment.countDocuments({ status: 'Overdue' }),
    User.aggregate([
      { $match: { role: 'member' } },
      { $group: { _id: '$plan', count: { $sum: 1 } } },
      { $lookup: { from: 'plans', localField: '_id', foreignField: '_id', as: 'plan' } },
      { $unwind: '$plan' },
      { $project: { name: '$plan.name', count: 1 } },
    ]),
  ]);

  // Monthly revenue for the last 6 months
  const monthlyRevenue = await Payment.aggregate([
    { $match: { status: 'Paid', paidAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
    { $group: { _id: { year: { $year: '$paidAt' }, month: { $month: '$paidAt' } }, total: { $sum: '$amount' } } },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Renewals due in next 7 days
  const sevenDays = new Date();
  sevenDays.setDate(sevenDays.getDate() + 7);
  const renewalsDue = await User.countDocuments({
    role: 'member', status: 'Active',
    renewalDate: { $lte: sevenDays, $gte: now },
  });

  // Recent 5 members
  const recentMembers = await User.find({ role: 'member' })
    .select('name email status plan gymCardNumber createdAt')
    .populate('plan', 'name')
    .sort('-createdAt').limit(5);

  res.json({
    members:  { total: totalMembers, active: activeMembers, suspended: suspendedMembers },
    revenue:  { total: totalRevenue[0]?.total || 0, thisMonth: monthRevenue[0]?.total || 0 },
    payments: { pending: pendingPayments, overdue: overduePayments },
    renewalsDue,
    planBreakdown,
    monthlyRevenue,
    recentMembers,
  });
});

// GET /api/dashboard/member  — member's personal home screen
exports.getMemberDashboard = asyncHandler(async (req, res) => {
  const memberId = req.user._id;

  const member = await User.findById(memberId)
    .populate('plan', 'name price duration features')
    .select('-password');

  if (!member) { res.status(404); throw new Error('Member not found'); }

  // Days until renewal
  const today = new Date();
  const daysLeft = member.renewalDate
    ? Math.max(0, Math.ceil((new Date(member.renewalDate) - today) / (1000 * 60 * 60 * 24)))
    : null;

  // Last 3 payments
  const recentPayments = await Payment.find({ member: memberId })
    .populate('plan', 'name')
    .sort('-createdAt')
    .limit(3)
    .select('invoiceNumber amount method status paidAt createdAt');

  // Unread notification count
  const unreadCount = await Notification.countDocuments({
    recipient: memberId,
    isRead: false,
  });

  res.json({
    profile: {
      name: member.name,
      email: member.email,
      phone: member.phone,
      gymCardNumber: member.gymCardNumber,
      status: member.status,
      memberSince: member.createdAt,
    },
    plan: member.plan,
    renewal: {
      date: member.renewalDate,
      daysLeft,
      isExpiringSoon: daysLeft !== null && daysLeft <= 7,
    },
    recentPayments,
    unreadNotifications: unreadCount,
  });
});