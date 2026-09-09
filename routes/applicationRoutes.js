const router = require('express').Router();
const { body } = require('express-validator');
const protect = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const asyncHandler = require('../utils/asyncHandler');
const { validate } = require('../middleware/validate');
const controller = require('../controllers/applicationController');

router.post('/', protect, allowRoles('Candidate'), body('jobId').isMongoId(), validate, asyncHandler(controller.apply));
router.put('/:id/stage', protect, allowRoles('Recruiter', 'Admin'), body('stage').isIn(['Applied', 'Shortlisted', 'Interview', 'Offered', 'Rejected', 'Hired']), validate, asyncHandler(controller.updateStage));
module.exports = router;
