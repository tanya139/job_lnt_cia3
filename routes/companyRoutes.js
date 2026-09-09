const router = require('express').Router();
const { body } = require('express-validator');
const protect = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const asyncHandler = require('../utils/asyncHandler');
const { validate } = require('../middleware/validate');
const controller = require('../controllers/companyController');

router.get('/', asyncHandler(controller.listCompanies));
router.get('/mine', protect, allowRoles('Recruiter', 'Admin'), asyncHandler(controller.myCompanies));
router.get('/:id', asyncHandler(controller.getCompany));
router.post('/', protect, allowRoles('Recruiter', 'Admin'), body('name').trim().notEmpty(), validate, asyncHandler(controller.createCompany));
router.put('/:id', protect, allowRoles('Recruiter', 'Admin'), asyncHandler(controller.updateCompany));
module.exports = router;
