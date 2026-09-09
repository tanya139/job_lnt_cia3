const Application = require('../models/Application');
const JobPosting = require('../models/JobPosting');

async function funnel(req, res) {
  const stages = ['Applied', 'Shortlisted', 'Interview', 'Offered', 'Rejected', 'Hired'];
  const counts = {};
  for (const stage of stages) counts[stage.toLowerCase()] = await Application.countDocuments({ stage });
  const rate = (from, to) => counts[from] ? Number(((counts[to] / counts[from]) * 100).toFixed(2)) : 0;
  res.json({ success: true, message: 'Funnel report retrieved', data: { totalApplications: await Application.countDocuments(), counts, conversionRates: { appliedToShortlisted: rate('applied', 'shortlisted'), shortlistedToInterview: rate('shortlisted', 'interview'), interviewToOffered: rate('interview', 'offered'), offeredToHired: rate('offered', 'hired') } } });
}

async function jobsReport(req, res) {
  const jobs = await JobPosting.find().select('status location');
  const byLocation = {};
  jobs.forEach(job => { byLocation[job.location] = (byLocation[job.location] || 0) + 1; });
  const hired = await Application.find({ stage: 'Hired' }).select('appliedAt hiredAt');
  const timeToHireDays = hired.filter(item => item.hiredAt).map(item => Math.round((item.hiredAt - item.appliedAt) / 86400000));
  res.json({ success: true, message: 'Jobs report retrieved', data: { totalJobPostings: jobs.length, openJobs: jobs.filter(job => job.status === 'Open').length, closedJobs: jobs.filter(job => job.status === 'Closed').length, jobsByLocation: byLocation, timeToHireDays } });
}

module.exports = { funnel, jobsReport };
