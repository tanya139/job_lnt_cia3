const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { fail } = require('../middleware/validate');

function userData(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

async function register(req, res) {
  const { name, email, password, role = 'Candidate' } = req.body;
  if (!['Candidate', 'Recruiter'].includes(role)) throw fail('Only Candidate or Recruiter registration is allowed', 403, 'FORBIDDEN');
  if (await User.findOne({ email })) throw fail('Email is already registered', 409, 'DUPLICATE_EMAIL');
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: passwordHash, role });
  res.status(201).json({ success: true, message: 'Registration successful', data: { token: generateToken(user), user: userData(user) } });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) throw fail('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  res.json({ success: true, message: 'Login successful', data: { token: generateToken(user), user: userData(user) } });
}

module.exports = { register, login };
