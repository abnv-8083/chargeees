const express = require('express');
const multer = require('multer');
const router = express.Router();
const { getGallery, uploadGalleryItem, updateGalleryItem, deleteGalleryItem, getFolders } = require('../controllers/galleryController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
  }
  if (err.message === 'Unsupported file type') {
    return res.status(400).json({ success: false, message: 'Unsupported file type. Allowed: JPG, PNG, GIF, WEBP, SVG, MP4, WEBM, PDF.' });
  }
  next(err);
};

router.get('/folders', protect, authorize('superadmin', 'admin', 'editor'), getFolders);
router.route('/')
  .get(getGallery)
  .post(protect, authorize('superadmin', 'admin', 'editor'), upload.single('file'), handleUploadError, uploadGalleryItem);

router.route('/:id')
  .put(protect, authorize('superadmin', 'admin', 'editor'), updateGalleryItem)
  .delete(protect, authorize('superadmin', 'admin'), deleteGalleryItem);

module.exports = router;
