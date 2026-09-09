const router = require('express').Router();
const { body } = require('express-validator');
const protect = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const asyncHandler = require('../utils/asyncHandler');
const { validate } = require('../middleware/validate');
const controller = require('../controllers/interviewController');

router.get('/', protect, asyncHandler(controller.listInterviews));
router.post('/', protect, allowRoles('Recruiter'), body('applicationId').isMongoId(), body('scheduledAt').isISO8601(), body('mode').isIn(['Online', 'Offline']), validate, asyncHandler(controller.createInterview));
module.exports = router;
