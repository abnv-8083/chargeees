const Project = require('../models/Project');

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
    if (req.file) req.body.coverImage = req.file.path;
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) { next(err); }
};

exports.updateProject = async (req, res, next) => {
  try {
    if (req.file) req.body.coverImage = req.file.path;
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    res.status(200).json({ success: true, data: project });
  } catch (err) { next(err); }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    res.status(200).json({ success: true, message: 'Project deleted.' });
  } catch (err) { next(err); }
};

// Add image to project gallery
exports.addToGallery = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    if (req.file) {
      project.gallery.push({
        url: req.file.path,
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
