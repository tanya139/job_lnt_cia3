const Application = require('../models/Application');
const JobPosting = require('../models/JobPosting');
const { fail } = require('../middleware/validate');

const transitions = {
  Applied: ['Shortlisted', 'Rejected'], Shortlisted: ['Interview', 'Rejected'],
  Interview: ['Offered', 'Rejected'], Offered: ['Hired'], Rejected: [], Hired: []
};

async function apply(req, res) {
  const { jobId, resumeName, coverNote } = req.body;
  const job = await JobPosting.findById(jobId);
  if (!job) throw fail('Job not found', 404, 'NOT_FOUND');
  if (job.status !== 'Open') throw fail('Cannot apply to a closed job');
  if (await Application.findOne({ jobId, candidateId: req.user._id })) throw fail('You have already applied to this job', 409, 'DUPLICATE_APPLICATION');
  const application = await Application.create({ jobId, candidateId: req.user._id, resumeName, coverNote });
  res.status(201).json({ success: true, message: 'Application submitted', data: application });
}

async function updateStage(req, res) {
  const application = await Application.findById(req.params.id).populate('jobId');
  if (!application) throw fail('Application not found', 404, 'NOT_FOUND');
  if (!application.jobId.recruiterId.equals(req.user._id) && req.user.role !== 'Admin') throw fail('You do not own this application', 403, 'FORBIDDEN');
  const nextStage = req.body.stage;
  if (!transitions[application.stage] || !transitions[application.stage].includes(nextStage)) throw fail('Invalid application stage transition', 400, 'INVALID_STAGE_TRANSITION');
  application.stage = nextStage;
  if (nextStage === 'Hired') application.hiredAt = new Date();
  await application.save();
  res.json({ success: true, message: 'Application stage updated', data: application });
}

module.exports = { apply, updateStage, transitions };
