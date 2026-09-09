const Interview = require('../models/Interview');
const Application = require('../models/Application');
const { fail } = require('../middleware/validate');

async function createInterview(req, res) {
  const application = await Application.findById(req.body.applicationId).populate('jobId');
  if (!application) throw fail('Application not found', 404, 'NOT_FOUND');
  if (!application.jobId.recruiterId.equals(req.user._id)) throw fail('You do not own this application', 403, 'FORBIDDEN');
  if (!['Shortlisted', 'Interview'].includes(application.stage)) throw fail('Application must be Shortlisted or Interview');
  const interview = await Interview.create(req.body);
  application.stage = 'Interview';
  await application.save();
  res.status(201).json({ success: true, message: 'Interview scheduled', data: interview });
}

async function listInterviews(req, res) {
  const interviews = await Interview.find().populate({ path: 'applicationId', populate: [{ path: 'candidateId', select: 'name email' }, { path: 'jobId', select: 'title' }] });
  res.json({ success: true, message: 'Interviews retrieved', data: interviews });
}

module.exports = { createInterview, listInterviews };
