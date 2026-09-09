const Offer = require('../models/Offer');
const Application = require('../models/Application');
const { fail } = require('../middleware/validate');

async function createOffer(req, res) {
  const application = await Application.findById(req.body.applicationId).populate('jobId');
  if (!application) throw fail('Application not found', 404, 'NOT_FOUND');
  if (!application.jobId.recruiterId.equals(req.user._id)) throw fail('You do not own this application', 403, 'FORBIDDEN');
  if (application.stage !== 'Offered') throw fail('An offer can only be created for an Offered application');
  if (await Offer.findOne({ applicationId: application._id })) throw fail('Offer already exists', 409, 'DUPLICATE_OFFER');
  const offer = await Offer.create(req.body);
  res.status(201).json({ success: true, message: 'Offer created', data: offer });
}

async function updateOfferStatus(req, res) {
  const offer = await Offer.findById(req.params.id).populate({ path: 'applicationId', populate: { path: 'candidateId' } });
  if (!offer) throw fail('Offer not found', 404, 'NOT_FOUND');
  if (!offer.applicationId.candidateId._id.equals(req.user._id)) throw fail('You do not own this offer', 403, 'FORBIDDEN');
  if (!['Accepted', 'Rejected'].includes(req.body.status)) throw fail('Invalid offer status');
  offer.status = req.body.status;
  await offer.save();
  res.json({ success: true, message: 'Offer status updated', data: offer });
}

async function listOffers(req, res) {
  const offers = await Offer.find().populate({ path: 'applicationId', populate: [{ path: 'candidateId', select: 'name email' }, { path: 'jobId', select: 'title' }] });
  res.json({ success: true, message: 'Offers retrieved', data: offers });
}

module.exports = { createOffer, updateOfferStatus, listOffers };
