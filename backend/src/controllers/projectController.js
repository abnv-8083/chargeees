const Project = require('../models/Project');
const { uploadProjectImage, deleteFromS3 } = require('../config/s3');

// Parse JSON-stringified FormData fields (tags, seo arrays/objects)
function parseFormFields(body) {
  if (typeof body.tags === 'string') {
    try { body.tags = JSON.parse(body.tags); } catch { body.tags = body.tags.split(',').map(t => t.trim()).filter(Boolean); }
  }
  if (typeof body.seo === 'string') {
    try { body.seo = JSON.parse(body.seo); } catch { delete body.seo; }
  }
  return body;
}

// GET all (public: only published, admin: all)
exports.getProjects = async (req, res, next) => {
  try {
    const { category, status, search, page = 1, limit = 20, admin } = req.query;
    const query = {};
    if (!admin) query.isPublished = true;
    if (category) query.category = { $regex: category, $options: 'i' };
    if (status) query.status = status;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.status(200).json({ success: true, total, page: parseInt(page), data: projects });
  } catch (err) { next(err); }
};

exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    res.status(200).json({ success: true, data: project });
  } catch (err) { next(err); }
};

exports.createProject = async (req, res, next) => {
  try {
    parseFormFields(req.body);

    if (req.file) {
      let result;
      try {
        result = await uploadProjectImage(req.file.buffer, req.file.originalname, req.file.mimetype);
      } catch (uploadErr) {
        return res.status(400).json({ success: false, message: uploadErr.message });
      }
      req.body.coverImage = result.fileUrl;
      req.body.coverImageS3Key = result.s3Key;
    }

    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) { next(err); }
};

exports.updateProject = async (req, res, next) => {
  try {
    parseFormFields(req.body);

    if (req.file) {
      let result;
      try {
        result = await uploadProjectImage(req.file.buffer, req.file.originalname, req.file.mimetype);
      } catch (uploadErr) {
        return res.status(400).json({ success: false, message: uploadErr.message });
      }
      // Delete old cover image from S3 (best-effort)
      const existing = await Project.findById(req.params.id);
      if (existing && (existing.coverImageS3Key || existing.coverImage)) {
        await deleteFromS3(existing.coverImageS3Key, existing.coverImage).catch(() => {});
      }
      req.body.coverImage = result.fileUrl;
      req.body.coverImageS3Key = result.s3Key;
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    res.status(200).json({ success: true, data: project });
  } catch (err) { next(err); }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    // Delete cover image from S3
    if (project.coverImageS3Key || project.coverImage) {
      await deleteFromS3(project.coverImageS3Key, project.coverImage).catch(() => {});
    }

    // Delete all gallery images from S3
    for (const item of project.gallery) {
      if (item.s3Key || item.url) {
        await deleteFromS3(item.s3Key, item.url).catch(() => {});
      }
    }

    res.status(200).json({ success: true, message: 'Project deleted.' });
  } catch (err) { next(err); }
};

// Add image to project gallery
exports.addToGallery = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    if (req.file) {
      let result;
      try {
        result = await uploadProjectImage(req.file.buffer, req.file.originalname, req.file.mimetype);
      } catch (uploadErr) {
        return res.status(400).json({ success: false, message: uploadErr.message });
      }
      project.gallery.push({
        url: result.fileUrl,
        s3Key: result.s3Key,
        type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
        caption: req.body.caption || '',
      });
      await project.save();
    }

    res.status(200).json({ success: true, data: project });
  } catch (err) { next(err); }
};

// Get unique categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Project.distinct('category', { isPublished: true });
    res.status(200).json({ success: true, data: categories });
  } catch (err) { next(err); }
};
