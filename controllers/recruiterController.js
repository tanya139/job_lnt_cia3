const JobPosting = require('../models/JobPosting');
const Application = require('../models/Application');

async function applicants(req, res) {
  const jobs = await JobPosting.find({ recruiterId: req.user._id }).select('_id title');
  const query = { jobId: { $in: jobs.map(job => job._id) } };
  if (req.query.stage) query.stage = req.query.stage;
  const applications = await Application.find(query).populate('candidateId', 'name email').populate('jobId', 'title');
  res.json({ success: true, message: 'Applicants retrieved', data: applications });
}

module.exports = { applicants };
