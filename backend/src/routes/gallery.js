const express = require('express');
const router = express.Router();
const { getGallery, uploadGalleryItem, updateGalleryItem, deleteGalleryItem, getFolders } = require('../controllers/galleryController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/folders', protect, authorize('superadmin', 'admin', 'editor'), getFolders);
router.route('/')
  .get(getGallery)
  .post(protect, authorize('superadmin', 'admin', 'editor'), upload.single('file'), uploadGalleryItem);

router.route('/:id')
  .put(protect, authorize('superadmin', 'admin', 'editor'), updateGalleryItem)
  .delete(protect, authorize('superadmin', 'admin'), deleteGalleryItem);

module.exports = router;
