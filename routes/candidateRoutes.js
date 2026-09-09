const router = require('express').Router();
const protect = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const asyncHandler = require('../utils/asyncHandler');
const controller = require('../controllers/candidateController');

router.use(protect, allowRoles('Candidate'));
router.get('/profile', asyncHandler(controller.getProfile));
router.put('/profile', asyncHandler(controller.saveProfile));
router.get('/applications', asyncHandler(controller.myApplications));
router.get('/interviews', asyncHandler(controller.myInterviews));
router.get('/offers', asyncHandler(controller.myOffers));
module.exports = router;
