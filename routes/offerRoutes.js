const router = require('express').Router();
const { body } = require('express-validator');
const protect = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const asyncHandler = require('../utils/asyncHandler');
const { validate } = require('../middleware/validate');
const controller = require('../controllers/offerController');

router.get('/', protect, allowRoles('Recruiter', 'Admin'), asyncHandler(controller.listOffers));
router.post('/', protect, allowRoles('Recruiter'), body('applicationId').isMongoId(), body('salary').isFloat({ min: 0 }), body('joiningDate').isISO8601(), validate, asyncHandler(controller.createOffer));
router.put('/:id/status', protect, allowRoles('Candidate'), body('status').isIn(['Accepted', 'Rejected']), validate, asyncHandler(controller.updateOfferStatus));
module.exports = router;
