const router = require('express').Router();
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const asyncHandler = require('../utils/asyncHandler');
const { validate } = require('../middleware/validate');

const email = body('email').isEmail().normalizeEmail();
router.post('/register', body('name').trim().notEmpty(), email, body('password').isLength({ min: 6 }), body('role').optional().isIn(['Candidate', 'Recruiter', 'Admin']), validate, asyncHandler(register));
router.post('/login', email, body('password').notEmpty(), validate, asyncHandler(login));
module.exports = router;
