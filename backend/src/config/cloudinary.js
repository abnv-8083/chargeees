const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'chargeease/general';
    try {
      if (req.params && req.params.folder) folder = `chargeease/${req.params.folder}`;
      else if (req.body && req.body.folder) folder = `chargeease/${req.body.folder}`;
    } catch (_) { /* ignore */ }

    const isVideo = file.mimetype.startsWith('video/');
    const isPdf = file.mimetype === 'application/pdf';
    const resourceType = isVideo ? 'video' : isPdf ? 'raw' : 'image';

    const params = {
      folder,
      resource_type: resourceType,
    };

    // Only apply image optimizations for image uploads
    if (!isVideo && !isPdf) {
      params.transformation = [{ quality: 'auto', fetch_format: 'auto' }];
    }

    return params;
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'video/mp4', 'video/webm', 'application/pdf',
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Unsupported file type'), false);
  },
});

module.exports = { cloudinary, upload };
