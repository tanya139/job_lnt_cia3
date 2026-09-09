const router = require('express').Router();
const { body } = require('express-validator');
const protect = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const asyncHandler = require('../utils/asyncHandler');
const { validate } = require('../middleware/validate');
const controller = require('../controllers/jobController');

router.get('/search', asyncHandler(controller.searchJobs));
router.get('/my', protect, allowRoles('Recruiter', 'Admin'), asyncHandler(controller.myJobs));
router.get('/:id', asyncHandler(controller.getJob));
router.post('/', protect, allowRoles('Recruiter', 'Admin'), body('companyId').isMongoId(), body('title').trim().notEmpty(), body('description').trim().notEmpty(), body('location').trim().notEmpty(), body('experienceLevel').trim().notEmpty(), body('salaryMin').optional().isFloat({ min: 0 }), body('salaryMax').optional().isFloat({ min: 0 }), validate, asyncHandler(controller.createJob));
router.put('/:id', protect, allowRoles('Recruiter', 'Admin'), asyncHandler(controller.updateJob));
router.delete('/:id', protect, allowRoles('Recruiter', 'Admin'), asyncHandler(controller.deleteJob));
module.exports = router;
