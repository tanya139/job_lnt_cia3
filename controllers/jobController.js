const JobPosting = require('../models/JobPosting');
const Company = require('../models/Company');
const { fail } = require('../middleware/validate');

async function createJob(req, res) {
  const company = await Company.findById(req.body.companyId);
  if (!company) throw fail('Company not found', 404, 'NOT_FOUND');
  if (!company.recruiterIds.some(id => id.equals(req.user._id)) && req.user.role !== 'Admin') throw fail('You do not own this company', 403, 'FORBIDDEN');
  if (req.body.salaryMax !== undefined && req.body.salaryMin > req.body.salaryMax) throw fail('salaryMin cannot exceed salaryMax');
  const job = await JobPosting.create({ ...req.body, recruiterId: req.user._id });
  res.status(201).json({ success: true, message: 'Job created', data: job });
}

async function searchJobs(req, res) {
  const query = { status: 'Open' };
  if (req.query.title) query.title = { $regex: req.query.title, $options: 'i' };
  if (req.query.location) query.location = { $regex: req.query.location, $options: 'i' };
  if (req.query.experienceLevel) query.experienceLevel = req.query.experienceLevel;
  if (req.query.skills) query.skills = { $in: req.query.skills.split(',').map(skill => new RegExp(skill.trim(), 'i')) };
  const jobs = await JobPosting.find(query).populate('companyId', 'name location');
  res.json({ success: true, message: 'Jobs retrieved', data: jobs });
}

async function getJob(req, res) {
  const job = await JobPosting.findById(req.params.id).populate('companyId');
  if (!job) throw fail('Job not found', 404, 'NOT_FOUND');
  res.json({ success: true, message: 'Job retrieved', data: job });
}

async function myJobs(req, res) {
  const jobs = await JobPosting.find({ recruiterId: req.user._id }).populate('companyId', 'name');
  res.json({ success: true, message: 'Your jobs retrieved', data: jobs });
}

async function updateJob(req, res) {
  const job = await JobPosting.findById(req.params.id);
  if (!job) throw fail('Job not found', 404, 'NOT_FOUND');
  if (!job.recruiterId.equals(req.user._id) && req.user.role !== 'Admin') throw fail('You do not own this job', 403, 'FORBIDDEN');
  if (req.body.salaryMax !== undefined && req.body.salaryMin !== undefined && req.body.salaryMin > req.body.salaryMax) throw fail('salaryMin cannot exceed salaryMax');
  Object.assign(job, req.body);
  await job.save();
  res.json({ success: true, message: 'Job updated', data: job });
}

async function deleteJob(req, res) {
  const job = await JobPosting.findById(req.params.id);
  if (!job) throw fail('Job not found', 404, 'NOT_FOUND');
  if (!job.recruiterId.equals(req.user._id) && req.user.role !== 'Admin') throw fail('You do not own this job', 403, 'FORBIDDEN');
  await job.deleteOne();
  res.json({ success: true, message: 'Job deleted', data: null });
}

module.exports = { createJob, searchJobs, getJob, myJobs, updateJob, deleteJob };
