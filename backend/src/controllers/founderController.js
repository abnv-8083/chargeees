const Founder = require('../models/Founder');

// GET all founders by type
exports.getFounders = async (req, res, next) => {
  try {
    const type = req.query.type || 'founder';
    const docs = await Founder.find({ type }).sort('order');
    res.status(200).json({ success: true, data: docs });
  } catch (err) { next(err); }
};

// GET single
exports.getFounder = async (req, res, next) => {
  try {
    const doc = await Founder.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Not found.' });
    res.status(200).json({ success: true, data: doc });
  } catch (err) { next(err); }
};

// CREATE
exports.createFounder = async (req, res, next) => {
  try {
    if (req.file) req.body.profileImage = req.file.path;
    const doc = await Founder.create(req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (err) { next(err); }
};

// UPDATE
exports.updateFounder = async (req, res, next) => {
  try {
    if (req.file) req.body.profileImage = req.file.path;
    const doc = await Founder.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ success: false, message: 'Not found.' });
    res.status(200).json({ success: true, data: doc });
  } catch (err) { next(err); }
};

// DELETE
exports.deleteFounder = async (req, res, next) => {
  try {
    const doc = await Founder.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Not found.' });
    res.status(200).json({ success: true, message: 'Deleted successfully.' });
  } catch (err) { next(err); }
};
