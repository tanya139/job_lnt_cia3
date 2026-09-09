const router = require('express').Router();
const protect = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const asyncHandler = require('../utils/asyncHandler');
const controller = require('../controllers/jobAlertController');

router.use(protect, allowRoles('Candidate'));
router.get('/', asyncHandler(controller.listAlerts));
router.post('/', asyncHandler(controller.createAlert));
module.exports = router;
