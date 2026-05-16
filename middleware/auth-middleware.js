const jwt  = require('jsonwebtoken');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

exports.protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-password').populate('plan');
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }
  if(req.user.status == 'Inactive'){
    res.status(403);
    throw new Error('Your account is Inactive');
  }
  next();
});