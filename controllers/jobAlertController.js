const JobAlert = require('../models/JobAlert');
const JobPosting = require('../models/JobPosting');

async function createAlert(req, res) {
  const alert = await JobAlert.create({ ...req.body, candidateId: req.user._id });
  res.status(201).json({ success: true, message: 'Job alert created', data: alert });
}

async function listAlerts(req, res) {
  const alerts = await JobAlert.find({ candidateId: req.user._id }).populate('matches', 'title location');
  for (const alert of alerts) {
    const query = { status: 'Open' };
    if (alert.keyword) query.title = { $regex: alert.keyword, $options: 'i' };
    if (alert.location) query.location = { $regex: alert.location, $options: 'i' };
    if (alert.skills && alert.skills.length) query.skills = { $in: alert.skills.map(skill => new RegExp(skill, 'i')) };
    alert.matches = await JobPosting.find(query).select('title location');
  }
  res.json({ success: true, message: 'Job alerts retrieved', data: alerts });
}

module.exports = { createAlert, listAlerts };
