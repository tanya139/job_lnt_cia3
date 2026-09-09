const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      const error = new Error('Authentication token is required');
      error.statusCode = 401;
      error.errorCode = 'UNAUTHORIZED';
      throw error;
    }
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      error.errorCode = 'UNAUTHORIZED';
      throw error;
    }
    next();
  } catch (error) {
    error.statusCode = 401;
    error.errorCode = 'UNAUTHORIZED';
    next(error);
  }
}

module.exports = protect;
