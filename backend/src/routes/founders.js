const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getFounders, getFounder, createFounder, updateFounder, deleteFounder } = require('../controllers/founderController');
const { protect, authorize } = require('../middleware/auth');

// Memory storage — buffer passed directly to S3 (same pattern as certificates)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPG, PNG, WEBP and GIF images are allowed for founder profiles.'), false);
  },
});

// Wrap multer so upload errors return clean JSON instead of crashing
const uploadSingle = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (!err) return next();
    const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(status).json({ success: false, message: err.message });
  });
};

router.route('/')
  .get(getFounders)
  .post(protect, authorize('superadmin', 'admin'), uploadSingle('profileImage'), createFounder);

router.route('/:id')
  .get(getFounder)
  .put(protect, authorize('superadmin', 'admin'), uploadSingle('profileImage'), updateFounder)
  .delete(protect, authorize('superadmin', 'admin'), deleteFounder);

module.exports = router;
