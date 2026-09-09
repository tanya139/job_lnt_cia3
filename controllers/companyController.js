const Company = require('../models/Company');
const { fail } = require('../middleware/validate');

async function createCompany(req, res) {
  const company = await Company.create({ ...req.body, recruiterIds: [req.user._id] });
  res.status(201).json({ success: true, message: 'Company created', data: company });
}

async function listCompanies(req, res) {
  const companies = await Company.find().populate('recruiterIds', 'name email');
  res.json({ success: true, message: 'Companies retrieved', data: companies });
}

async function myCompanies(req, res) {
  const companies = await Company.find({ recruiterIds: req.user._id }).populate('recruiterIds', 'name email');
  res.json({ success: true, message: 'Your companies retrieved', data: companies });
}

async function getCompany(req, res) {
  const company = await Company.findById(req.params.id).populate('recruiterIds', 'name email');
  if (!company) throw fail('Company not found', 404, 'NOT_FOUND');
  res.json({ success: true, message: 'Company retrieved', data: company });
}

async function updateCompany(req, res) {
  const company = await Company.findById(req.params.id);
  if (!company) throw fail('Company not found', 404, 'NOT_FOUND');
  if (!company.recruiterIds.some(id => id.equals(req.user._id)) && req.user.role !== 'Admin') throw fail('You do not own this company', 403, 'FORBIDDEN');
  Object.assign(company, req.body);
  await company.save();
  res.json({ success: true, message: 'Company updated', data: company });
}

module.exports = { createCompany, listCompanies, myCompanies, getCompany, updateCompany };
