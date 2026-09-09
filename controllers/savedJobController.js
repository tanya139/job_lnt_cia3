const SavedJob = require('../models/SavedJob');
const JobPosting = require('../models/JobPosting');
const { fail } = require('../middleware/validate');

async function saveJob(req, res) {
  if (!await JobPosting.findById(req.body.jobId)) throw fail('Job not found', 404, 'NOT_FOUND');
  if (await SavedJob.findOne({ candidateId: req.user._id, jobId: req.body.jobId })) throw fail('Job is already saved', 409, 'DUPLICATE_SAVED_JOB');
  const saved = await SavedJob.create({ candidateId: req.user._id, jobId: req.body.jobId });
  res.status(201).json({ success: true, message: 'Job saved', data: saved });
}

async function listSaved(req, res) {
  const saved = await SavedJob.find({ candidateId: req.user._id }).populate('jobId');
  res.json({ success: true, message: 'Saved jobs retrieved', data: saved });
}

async function deleteSaved(req, res) {
  const saved = await SavedJob.findOneAndDelete({ _id: req.params.id, candidateId: req.user._id });
  if (!saved) throw fail('Saved job not found', 404, 'NOT_FOUND');
  res.json({ success: true, message: 'Saved job removed', data: null });
}

module.exports = { saveJob, listSaved, deleteSaved };
