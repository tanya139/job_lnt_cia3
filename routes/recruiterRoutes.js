const router = require('express').Router();
const protect = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const asyncHandler = require('../utils/asyncHandler');
const controller = require('../controllers/recruiterController');

router.get('/applicants', protect, allowRoles('Recruiter', 'Admin'), asyncHandler(controller.applicants));
module.exports = router;
