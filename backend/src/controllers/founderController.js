const Founder = require('../models/Founder');
const { uploadFounderImage, deleteFromS3 } = require('../config/s3');

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
    // Parse JSON-stringified fields sent via FormData
    if (typeof req.body.achievements === 'string') {
      try { req.body.achievements = JSON.parse(req.body.achievements); } catch { req.body.achievements = []; }
    }
    if (typeof req.body.education === 'string') {
      try { req.body.education = JSON.parse(req.body.education); } catch { req.body.education = []; }
    }
    if (typeof req.body.socialLinks === 'string') {
      try { req.body.socialLinks = JSON.parse(req.body.socialLinks); } catch { req.body.socialLinks = {}; }
    }

    if (req.file) {
      let result;
      try {
        result = await uploadFounderImage(req.file.buffer, req.file.originalname, req.file.mimetype);
      } catch (uploadErr) {
        return res.status(400).json({ success: false, message: uploadErr.message });
      }
      req.body.profileImage = result.fileUrl;
      req.body.profileImageS3Key = result.s3Key;
    }

    const doc = await Founder.create(req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (err) { next(err); }
};

// UPDATE
exports.updateFounder = async (req, res, next) => {
  try {
    // Parse JSON-stringified fields sent via FormData
    if (typeof req.body.achievements === 'string') {
      try { req.body.achievements = JSON.parse(req.body.achievements); } catch { req.body.achievements = []; }
    }
    if (typeof req.body.education === 'string') {
      try { req.body.education = JSON.parse(req.body.education); } catch { req.body.education = []; }
    }
    if (typeof req.body.socialLinks === 'string') {
      try { req.body.socialLinks = JSON.parse(req.body.socialLinks); } catch { req.body.socialLinks = {}; }
    }

    if (req.file) {
      // Delete old image from S3 if present
      const existing = await Founder.findById(req.params.id);
      if (existing && existing.profileImageS3Key) {
        await deleteFromS3(existing.profileImageS3Key, existing.profileImage).catch(() => {});
      }

      let result;
      try {
        result = await uploadFounderImage(req.file.buffer, req.file.originalname, req.file.mimetype);
      } catch (uploadErr) {
        return res.status(400).json({ success: false, message: uploadErr.message });
      }
      req.body.profileImage = result.fileUrl;
      req.body.profileImageS3Key = result.s3Key;
    }

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

    // Clean up S3 image
    if (doc.profileImageS3Key || doc.profileImage) {
      await deleteFromS3(doc.profileImageS3Key, doc.profileImage).catch(() => {});
    }

    res.status(200).json({ success: true, message: 'Deleted successfully.' });
  } catch (err) { next(err); }
};
