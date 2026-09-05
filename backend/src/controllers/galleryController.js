const GalleryItem = require('../models/GalleryItem');
const { cloudinary, uploadToCloudinary } = require('../config/cloudinary');

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

    const folderName = req.body.folder || 'general';
    const cloudinaryFolder = `chargeease/${folderName}`;
    const { url, publicId } = await uploadToCloudinary(req.file.buffer, req.file.mimetype, cloudinaryFolder);

    const item = await GalleryItem.create({
      url,
      publicId,
      type: req.file.mimetype.startsWith('video') ? 'video'
        : req.file.mimetype === 'application/pdf' ? 'pdf' : 'image',
      mimeType: req.file.mimetype,
      title: req.body.title || req.file.originalname,
      caption: req.body.caption || '',
      folder: folderName,
      tags: req.body.tags
        ? (() => {
          try {
            const parsed = JSON.parse(req.body.tags);
            return Array.isArray(parsed) ? parsed : [req.body.tags];
          } catch {
            return req.body.tags.split(',').map((t) => t.trim()).filter(Boolean);
          }
        })()
        : [],
    });

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    console.error('[Upload Gallery Error]', err);
    next(err);
  }
};

exports.updateGalleryItem = async (req, res, next) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    if (req.file) {
      // Delete old asset from Cloudinary
      if (item.publicId) {
        await cloudinary.uploader.destroy(item.publicId, {
          resource_type: item.type === 'video' ? 'video' : item.type === 'pdf' ? 'raw' : 'image',
        }).catch((e) => console.warn('Cloudinary delete old asset warning:', e?.message));
      }

      const folderName = req.body.folder || item.folder || 'general';
      const cloudinaryFolder = `chargeease/${folderName}`;
      const { url, publicId } = await uploadToCloudinary(req.file.buffer, req.file.mimetype, cloudinaryFolder);

      item.url = url;
      item.publicId = publicId;
      item.mimeType = req.file.mimetype;
      item.type = req.file.mimetype.startsWith('video') ? 'video'
        : req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';
    }

    if (req.body.title !== undefined) item.title = req.body.title;
    if (req.body.caption !== undefined) item.caption = req.body.caption;
    if (req.body.folder !== undefined) item.folder = req.body.folder;
    if (req.body.type !== undefined && !req.file) item.type = req.body.type;
    if (req.body.isPublished !== undefined) {
      item.isPublished = req.body.isPublished === true || req.body.isPublished === 'true';
    }

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
      }).catch((e) => console.warn('Cloudinary delete warning:', e?.message));
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
