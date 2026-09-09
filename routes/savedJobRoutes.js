const router = require('express').Router();
const { body } = require('express-validator');
const protect = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const asyncHandler = require('../utils/asyncHandler');
const { validate } = require('../middleware/validate');
const controller = require('../controllers/savedJobController');

router.use(protect, allowRoles('Candidate'));
router.get('/', asyncHandler(controller.listSaved));
router.post('/', body('jobId').isMongoId(), validate, asyncHandler(controller.saveJob));
router.delete('/:id', asyncHandler(controller.deleteSaved));
module.exports = router;
