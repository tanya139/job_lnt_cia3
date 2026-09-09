const router = require('express').Router();
const protect = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const asyncHandler = require('../utils/asyncHandler');
const controller = require('../controllers/adminController');

router.use(protect, allowRoles('Admin'));
router.get('/reports/funnel', asyncHandler(controller.funnel));
router.get('/reports/jobs', asyncHandler(controller.jobsReport));
router.get('/users', asyncHandler(controller.users));
router.get('/companies', asyncHandler(controller.companies));
router.get('/overview', asyncHandler(controller.overview));
router.get('/jobs', asyncHandler(controller.allJobs));
module.exports = router;
