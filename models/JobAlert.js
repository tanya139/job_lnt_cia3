const mongoose = require('mongoose');

const jobAlertSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  keyword: String,
  location: String,
  skills: [String],
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting' }]
}, { timestamps: true });

module.exports = mongoose.model('JobAlert', jobAlertSchema);
