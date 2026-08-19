const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getProjects, getProject, createProject, updateProject, deleteProject,
  addToGallery, getCategories,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

// Memory storage — buffer passed directly to S3 (same pattern as certificates)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files (JPG, PNG, WEBP, GIF, SVG) are allowed for projects.'), false);
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

router.get('/categories', getCategories);

router.route('/')
  .get(getProjects)
  .post(protect, authorize('superadmin', 'admin', 'editor'), uploadSingle('coverImage'), createProject);

router.route('/:id')
  .get(getProject)
  .put(protect, authorize('superadmin', 'admin', 'editor'), uploadSingle('coverImage'), updateProject)
  .delete(protect, authorize('superadmin', 'admin'), deleteProject);

router.post('/:id/gallery', protect, authorize('superadmin', 'admin', 'editor'), uploadSingle('file'), addToGallery);

module.exports = router;
