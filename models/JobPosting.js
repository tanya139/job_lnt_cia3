const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  skills: [{ type: String, trim: true }],
  location: { type: String, required: true },
  salaryMin: { type: Number, min: 0 },
  salaryMax: { type: Number, min: 0 },
  experienceLevel: { type: String, required: true },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' }
}, { timestamps: true });

module.exports = mongoose.model('JobPosting', jobSchema);
