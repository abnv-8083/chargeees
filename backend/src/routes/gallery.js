const express = require('express');
const multer = require('multer');
const router = express.Router();
const { getGallery, uploadGalleryItem, updateGalleryItem, deleteGalleryItem, getFolders } = require('../controllers/galleryController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

const uploadSingle = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (!err) return next();
    console.error('[Gallery Upload Error]', err.message || err);
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    }
    if (err.message === 'Unsupported file type') {
      return res.status(400).json({ success: false, message: 'Unsupported file type. Allowed: JPG, PNG, GIF, WEBP, SVG, MP4, WEBM, PDF.' });
    }
    if (err.http_code || err.name === 'Error' || (err.message && err.message.includes('cloudinary'))) {
      return res.status(400).json({ success: false, message: `File upload failed: ${err.message || 'Cloudinary error'}` });
    }
    const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(status).json({ success: false, message: err.message });
  });
};

router.get('/folders', protect, authorize('superadmin', 'admin', 'editor'), getFolders);
router.route('/')
  .get(getGallery)
  .post(protect, authorize('superadmin', 'admin', 'editor'), uploadSingle('file'), uploadGalleryItem);

router.route('/:id')
  .put(protect, authorize('superadmin', 'admin', 'editor'), uploadSingle('file'), updateGalleryItem)
  .delete(protect, authorize('superadmin', 'admin'), deleteGalleryItem);

module.exports = router;
