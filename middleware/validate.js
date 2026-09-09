const { validationResult } = require('express-validator');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errorCode: 'VALIDATION_ERROR',
      errors: errors.array()
    });
  }
  next();
}

function fail(message, statusCode = 400, errorCode = 'BUSINESS_RULE_ERROR') {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errorCode = errorCode;
  return error;
}

module.exports = { validate, fail };
