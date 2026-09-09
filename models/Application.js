const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting', required: true, index: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  stage: { type: String, enum: ['Applied', 'Shortlisted', 'Interview', 'Offered', 'Rejected', 'Hired'], default: 'Applied' },
  appliedAt: { type: Date, default: Date.now },
  hiredAt: Date,
  resumeName: String,
  coverNote: String
}, { timestamps: true });
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
