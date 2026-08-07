const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createCertificate,
  getAllCertificates,
  searchCertificateByNumber,
  claimCertificate,
  getMyCertificates,
  getCertificateById,
  updateCertificate,
  deleteCertificate,
} = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/auth');

// Multer memory storage configuration for S3 uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only PDF documents and Images (JPG, PNG, WEBP) are allowed.'), false);
    }
  },
});

// Public / Client search endpoint
router.get('/search/:certNumber', searchCertificateByNumber);

// Protected Client endpoints
router.post('/claim', protect, claimCertificate);
router.get('/my-certificates', protect, getMyCertificates);

// Protected Admin endpoints
router.get('/', protect, authorize('superadmin', 'admin', 'editor'), getAllCertificates);
router.post('/', protect, authorize('superadmin', 'admin', 'editor'), upload.single('file'), createCertificate);
router.get('/:id', protect, getCertificateById);
router.put('/:id', protect, authorize('superadmin', 'admin', 'editor'), upload.single('file'), updateCertificate);
router.delete('/:id', protect, authorize('superadmin', 'admin', 'editor'), deleteCertificate);

module.exports = router;
