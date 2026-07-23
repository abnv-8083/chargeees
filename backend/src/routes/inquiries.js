const express = require('express');
const router = express.Router();
const {
  submitInquiry, getInquiries, getInquiry, updateInquiry,
  replyInquiry, deleteInquiry, exportInquiries, getStats,
} = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/auth');

// Public
router.post('/', submitInquiry);

// Admin
router.get('/stats', protect, getStats);
router.get('/export', protect, authorize('superadmin', 'admin'), exportInquiries);
router.get('/', protect, getInquiries);
router.route('/:id')
  .get(protect, getInquiry)
  .put(protect, updateInquiry)
  .delete(protect, authorize('superadmin', 'admin'), deleteInquiry);
router.post('/:id/reply', protect, replyInquiry);

module.exports = router;
