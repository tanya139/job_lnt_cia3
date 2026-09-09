const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  scheduledAt: { type: Date, required: true },
  mode: { type: String, enum: ['Online', 'Offline'], required: true },
  meetingLink: String,
  feedback: String
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
