const asyncHandler = require('express-async-handler');
const Plan = require('../models/plan');

exports.getAllPlans = asyncHandler(async (req, res) => {
  const plans = await Plan.find({ isActive: true });
  res.json(plans);
});

exports.getPlan = asyncHandler(async (req, res) => {
  const plan = await Plan.findById(req.params.id);
  if (!plan) { res.status(404); throw new Error('Plan not found'); }
  res.json(plan);
});

exports.createPlan = asyncHandler(async (req, res) => {
  const plan = await Plan.create(req.body);
  res.status(201).json(plan);
});

exports.updatePlan = asyncHandler(async (req, res) => {
  const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!plan) { res.status(404); throw new Error('Plan not found'); }
  res.json(plan);
});

exports.deletePlan = asyncHandler(async (req, res) => {
  await Plan.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Plan deactivated' });
});