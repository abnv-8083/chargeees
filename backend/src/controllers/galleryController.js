const GalleryItem = require('../models/GalleryItem');
const { cloudinary } = require('../config/cloudinary');

exports.getGallery = async (req, res, next) => {
  try {
    const { folder, type, search, page = 1, limit = 30, admin } = req.query;
    const query = {};
    if (!admin) query.isPublished = true;
    if (folder) query.folder = folder;
    if (type) query.type = type;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { caption: { $regex: search, $options: 'i' } },
    ];

    const total = await GalleryItem.countDocuments(query);
    const items = await GalleryItem.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.status(200).json({ success: true, total, data: items });
  } catch (err) { next(err); }
};

exports.uploadGalleryItem = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
    const item = await GalleryItem.create({
      url: req.file.path,
      publicId: req.file.filename,
      type: req.file.mimetype.startsWith('video') ? 'video'
        : req.file.mimetype === 'application/pdf' ? 'pdf' : 'image',
      mimeType: req.file.mimetype,
      title: req.body.title || req.file.originalname,
      caption: req.body.caption || '',
      folder: req.body.folder || 'general',
      tags: req.body.tags ? (() => { try { const parsed = JSON.parse(req.body.tags); return Array.isArray(parsed) ? parsed : [req.body.tags]; } catch { return req.body.tags.split(',').map((t) => t.trim()); } })() : [],
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.updateGalleryItem = async (req, res, next) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    if (req.file) {
      if (item.publicId) {
        await cloudinary.uploader.destroy(item.publicId, {
          resource_type: item.type === 'video' ? 'video' : item.type === 'pdf' ? 'raw' : 'image',
        }).catch((e) => console.warn('Cloudinary delete old asset warning:', e?.message));
      }
      item.url = req.file.path;
      item.publicId = req.file.filename;
      item.mimeType = req.file.mimetype;
      item.type = req.file.mimetype.startsWith('video') ? 'video'
        : req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';
    }

    if (req.body.title !== undefined) item.title = req.body.title;
    if (req.body.caption !== undefined) item.caption = req.body.caption;
    if (req.body.folder !== undefined) item.folder = req.body.folder;
    if (req.body.type !== undefined && !req.file) item.type = req.body.type;
    if (req.body.isPublished !== undefined) item.isPublished = req.body.isPublished === true || req.body.isPublished === 'true';

    if (req.body.tags !== undefined) {
      if (Array.isArray(req.body.tags)) {
        item.tags = req.body.tags;
      } else if (typeof req.body.tags === 'string') {
        try {
          const parsed = JSON.parse(req.body.tags);
          item.tags = Array.isArray(parsed) ? parsed : [req.body.tags];
        } catch {
          item.tags = req.body.tags.split(',').map((t) => t.trim()).filter(Boolean);
        }
      }
    }

    const updatedItem = await item.save();
    res.status(200).json({ success: true, data: updatedItem });
  } catch (err) {
    console.error('[Update Gallery Error]', err);
    next(err);
  }
};

exports.deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
    if (item.publicId) {
      await cloudinary.uploader.destroy(item.publicId, {
        resource_type: item.type === 'video' ? 'video' : item.type === 'pdf' ? 'raw' : 'image',
      });
    }
    await item.deleteOne();
    res.status(200).json({ success: true, message: 'Item deleted.' });
  } catch (err) { next(err); }
};

exports.getFolders = async (req, res, next) => {
  try {
    const folders = await GalleryItem.distinct('folder');
    res.status(200).json({ success: true, data: folders });
  } catch (err) { next(err); }
};
