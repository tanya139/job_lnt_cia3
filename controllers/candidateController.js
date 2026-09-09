const CandidateProfile = require('../models/CandidateProfile');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const Offer = require('../models/Offer');
const { fail } = require('../middleware/validate');

async function getProfile(req, res) {
  const profile = await CandidateProfile.findOne({ userId: req.user._id });
  res.json({ success: true, message: 'Profile retrieved', data: profile });
}

async function saveProfile(req, res) {
  const profile = await CandidateProfile.findOneAndUpdate({ userId: req.user._id }, { ...req.body, userId: req.user._id }, { new: true, upsert: true, runValidators: true });
  res.json({ success: true, message: 'Profile saved', data: profile });
}

async function myApplications(req, res) {
  const applications = await Application.find({ candidateId: req.user._id }).populate({ path: 'jobId', populate: { path: 'companyId', select: 'name' } });
  res.json({ success: true, message: 'Applications retrieved', data: applications });
}

async function myInterviews(req, res) {
  const applications = await Application.find({ candidateId: req.user._id }).select('_id');
  const interviews = await Interview.find({ applicationId: { $in: applications.map(item => item._id) } }).populate('applicationId');
  res.json({ success: true, message: 'Interviews retrieved', data: interviews });
}

async function myOffers(req, res) {
  const applications = await Application.find({ candidateId: req.user._id }).select('_id');
  const offers = await Offer.find({ applicationId: { $in: applications.map(item => item._id) } }).populate('applicationId');
  res.json({ success: true, message: 'Offers retrieved', data: offers });
}

module.exports = { getProfile, saveProfile, myApplications, myInterviews, myOffers, fail };
