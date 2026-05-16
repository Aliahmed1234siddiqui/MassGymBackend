const asyncHandler = require('express-async-handler');
const Payment = require('../models/payment');
const User = require('../models/user');
const Notification = require('../models/notification');
const sendEmail = require('../utils/send-email');
const paymentEmail = require('../template/payment-email');
const renewalEmail = require('../template/renewal-email');

// Generate invoice number like INV-2025-0001
const generateInvoice = async () => {
    const count = await Payment.countDocuments();
    return `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
};

// GET /api/payments
exports.getAllPayments = asyncHandler(async (req, res) => {
    const { status, method, memberId } = req.query;
    const query = {};
    if (status) query.status = status;
    if (method) query.method = method;
    if (memberId) query.member = memberId;
    const payments = await Payment.find(query)
        .populate('member', 'name email gymCardNumber')
        .populate('plan', 'name price')
        .sort('-createdAt');
    res.json({ count: payments.length, payments });
});

// POST /api/payments  — admin records a payment
exports.createPayment = asyncHandler(async (req, res) => {
    const { memberId, planId, amount, method, note, dueDate } = req.body;

    const invoiceNumber = await generateInvoice();
    const paidAt = method !== 'Bank Transfer' ? new Date() : null;

    const payment = await Payment.create({
        invoiceNumber, member: memberId, plan: planId,
        amount, method, note,
        status: paidAt ? 'Paid' : 'Pending',
        paidAt,
        dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        recordedBy: req.user._id,
    });

    // Update member renewal date
    const newRenewal = new Date();
    newRenewal.setDate(newRenewal.getDate() + 30);
    await User.findByIdAndUpdate(memberId, { renewalDate: newRenewal });

    // Get member details for email
    const member = await User.findById(memberId).populate('plan', 'name');

    // Send payment receipt email
    if (paidAt) {
        await sendEmail({
            to: member.email,
            subject: `Payment Receipt — ${invoiceNumber}`,
            html: paymentEmail({
                name: member.name,
                invoiceNumber,
                amount,
                plan: member.plan?.name || '',
                method,
                paidAt,
            }),
        });
    }

    // Save notification
    await Notification.create({
        recipient: memberId,
        type: 'payment',
        title: `Payment ${payment.status}`,
        message: `Your payment of Rs ${amount} (${invoiceNumber}) has been ${payment.status.toLowerCase()}.`,
        sentViaEmail: !!paidAt,
    });

    const populated = await Payment.findById(payment._id)
        .populate('member', 'name email')
        .populate('plan', 'name price');

    res.status(201).json({ message: 'Payment recorded', payment: populated });
});

// PUT /api/payments/:id/status  — mark as paid / overdue
exports.updatePaymentStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const update = { status };
    if (status === 'Paid') update.paidAt = new Date();

    const payment = await Payment.findByIdAndUpdate(req.params.id, update, { new: true })
        .populate('member', 'name email')
        .populate('plan', 'name');

    if (status === 'Paid') {
        await sendEmail({
            to: payment.member.email,
            subject: `Payment Confirmed — ${payment.invoiceNumber}`,
            html: paymentEmail({
                name: payment.member.name,
                invoiceNumber: payment.invoiceNumber,
                amount: payment.amount,
                plan: payment.plan?.name,
                method: payment.method,
                paidAt: payment.paidAt,
            }),
        });
    }
    res.json(payment);
});

// POST /api/payments/send-renewal-reminders  — call this via a cron job
exports.sendRenewalReminders = asyncHandler(async (req, res) => {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const dueSoon = await User.find({
        role: 'member',
        status: 'Active',
        renewalDate: { $lte: threeDaysFromNow, $gte: new Date() },
    }).populate('plan', 'name');

    for (const member of dueSoon) {
        await sendEmail({
            to: member.email,
            subject: `Membership Renewal Reminder — ${process.env.GYM_NAME}`,
            html: renewalEmail({ name: member.name, renewalDate: member.renewalDate, plan: member.plan?.name }),
        });
        await Notification.create({
            recipient: member._id,
            type: 'renewal',
            title: 'Renewal Reminder',
            message: `Your membership renews on ${new Date(member.renewalDate).toLocaleDateString('en-PK')}.`,
            sentViaEmail: true,
        });
    }

    res.json({ message: `Reminders sent to ${dueSoon.length} members` });
});


// GET /api/payments/member/:id  — member views own payment history
exports.getMemberPayments = asyncHandler(async (req, res) => {
  // Guard: member can only access their own payments
  if (req.user.role === 'member' && req.user._id.toString() !== req.params.id) {
    res.status(403); throw new Error('Access denied');
  }

  const payments = await Payment.find({ member: req.params.id })
    .populate('plan', 'name price')
    .sort('-createdAt')
    .select('invoiceNumber amount method status paidAt dueDate createdAt plan');

  const total = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  res.json({ count: payments.length, totalPaid: total, payments });
});