const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memoryStorage — files go into memory buffer, then we upload to Cloudinary manually
const upload = multer({
  storage: multer.memoryStorage(),
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

/**
 * Upload a buffer to Cloudinary and return { url, publicId }
 */
const uploadToCloudinary = (buffer, mimetype, folder = 'chargeease/general') => {
  return new Promise((resolve, reject) => {
    const isVideo = mimetype.startsWith('video/');
    const isPdf = mimetype === 'application/pdf';
    const resourceType = isVideo ? 'video' : isPdf ? 'raw' : 'image';

    const options = {
      folder,
      resource_type: resourceType,
    };

    if (!isVideo && !isPdf) {
      options.transformation = [{ quality: 'auto', fetch_format: 'auto' }];
    }

    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve({ url: result.secure_url, publicId: result.public_id });
    });

    stream.end(buffer);
  });
};

module.exports = { cloudinary, upload, uploadToCloudinary };
