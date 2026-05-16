const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const GymCard = require('../models/gymcard');
const Notification = require('../models/notification');
const sendEmail = require('../utils/send-email');
const { generateCardNumber, generateQR } = require('../utils/generate-card');
const welcomeEmail = require('../template/welcome-email');
const generatePassword = require('../utils/generate-password');

// GET /api/members
exports.getAllMembers = asyncHandler(async (req, res) => {
    const { status, plan, search } = req.query;
    const query = { role: 'member' };
    if (status) query.status = status;
    if (plan) query.plan = plan;
    if (search) query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { gymCardNumber: { $regex: search, $options: 'i' } },
    ];
    const members = await User.find(query).populate('plan', 'name price').select('-password').sort('-createdAt');
    res.json({ count: members.length, members });
});

// GET /api/members/:id
exports.getMember = asyncHandler(async (req, res) => {
    const member = await User.findById(req.params.id).populate('plan').select('-password');
    if (!member) { res.status(404); throw new Error('Member not found'); }
    res.json(member);
});

// POST /api/members/create  — admin creates member, sends welcome email + gym card
exports.createMember = asyncHandler(async (req, res) => {
    const { name, email, phone, planId, cnic, address, emergencyContact } = req.body;
    const password = generatePassword();
    const exists = await User.findOne({ email });
    if (exists) { res.status(400); throw new Error('Email already registered'); }

    // Generate gym card number
    const count = await User.countDocuments({ role: 'member' });
    const cardNumber = generateCardNumber(count + 1);
    const qrCode = await generateQR(cardNumber);
    
    // Calculate renewal date (30 days from now by default)
    const renewalDate = new Date();
    renewalDate.setDate(renewalDate.getDate() + 30);

    const member = await User.create({
        name, email, password, phone, plan: planId,
        cnic, address, emergencyContact,
        role: 'member', gymCardNumber: cardNumber,
        renewalDate, createdBy: req.user._id,
    });

    // Save gym card
    await GymCard.create({
        member: member._id, cardNumber, qrCode,
        expiryDate: renewalDate,
    });

    // Save notification
    await Notification.create({
        recipient: member._id,
        type: 'welcome',
        title: 'Welcome to Mass Gym!',
        message: `Your membership has been activated. Card number: ${cardNumber}`,
        sentViaEmail: true,
    });

    // Send welcome email with credentials + card number
    await sendEmail({
        to: email,
        subject: `Welcome to ${process.env.GYM_NAME} — Your Login Details`,
        html: welcomeEmail({ name, email, password, plan: req.body.planName || 'Silver', cardNumber }),
    });

    res.status(201).json({
        message: 'Member registered and welcome email sent',
        member: { id: member._id, name: member.name, email: member.email, gymCardNumber: cardNumber },
    });
});

// PUT /api/members/:id
exports.updateMember = asyncHandler(async (req, res) => {
    const { password, ...updateData } = req.body;  // never allow password update here
    const member = await User.findByIdAndUpdate(req.params.id, updateData, { new: true })
        .populate('plan').select('-password');
    if (!member) { res.status(404); throw new Error('Member not found'); }
    res.json({"message": "member update successfully" ,member});
});

// PUT /api/members/:id/status
exports.updateMemberStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const member = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
    await Notification.create({
        recipient: member._id,
        type: 'general',
        title: `Account ${status}`,
        message: `Your account status has been changed to ${status}.`,
    });
    res.json({ message: `Member status updated to ${status}`, member });
});

// DELETE /api/members/:id
exports.deleteMember = asyncHandler(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    await GymCard.findOneAndDelete({ member: req.params.id });
    res.json({ message: 'Member removed successfully' });
});

// GET /api/members/:id/card
exports.getMemberCard = asyncHandler(async (req, res) => {
    const card = await GymCard.findOne({ member: req.params.id }).populate('member', 'name email plan');
    if (!card) { res.status(404); throw new Error('Gym card not found'); }
    res.json(card);
});

// GET /api/members/:id/notifications
exports.getMemberNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.params.id }).sort('-createdAt');
    res.json(notifications);
});

// PUT /api/members/:id/notifications/read
exports.markNotificationsRead = asyncHandler(async (req, res) => {
  // Guard: member can only mark their own
  if (req.user.role === 'member' && req.user._id.toString() !== req.params.id) {
    res.status(403); throw new Error('Access denied');
  }

  const result = await Notification.updateMany(
    { recipient: req.params.id, isRead: false },
    { isRead: true }
  );

  res.json({ message: `${result.modifiedCount} notifications marked as read` });
});