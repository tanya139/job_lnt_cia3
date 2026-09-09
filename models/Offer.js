const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true, unique: true },
  salary: { type: Number, required: true, min: 0 },
  joiningDate: { type: Date, required: true },
  offerLetterName: String,
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
