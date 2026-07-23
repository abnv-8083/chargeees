const express = require('express');
const router = express.Router();
const {
  getProjects, getProject, createProject, updateProject, deleteProject,
  addToGallery, getCategories,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/categories', getCategories);
router.route('/')
  .get(getProjects)
  .post(protect, authorize('superadmin', 'admin', 'editor'), upload.single('coverImage'), createProject);

router.route('/:id')
  .get(getProject)
  .put(protect, authorize('superadmin', 'admin', 'editor'), upload.single('coverImage'), updateProject)
  .delete(protect, authorize('superadmin', 'admin'), deleteProject);

router.post('/:id/gallery', protect, authorize('superadmin', 'admin', 'editor'), upload.single('file'), addToGallery);

module.exports = router;
