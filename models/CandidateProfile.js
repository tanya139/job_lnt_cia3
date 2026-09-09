const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  phone: String,
  skills: [String],
  experienceYears: { type: Number, min: 0 },
  education: String,
  experienceSummary: String,
  resumeName: String,
  resumeSummary: String
}, { timestamps: true });

module.exports = mongoose.model('CandidateProfile', profileSchema);
