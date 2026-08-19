/**
 * Unified image upload helper.
 *
 * Priority:
 *  1. AWS S3  — when AWS_S3_BUCKET_NAME + credentials are set
 *  2. Cloudinary — when CLOUDINARY_CLOUD_NAME is set (existing Render config)
 *  3. Local disk  — dev-only fallback
 *
 * All three paths return the same shape: { fileUrl, s3Key }
 * Controllers never need to know which backend was used.
 */

const path = require('path');
const fs = require('fs');

/* ── AWS S3 (optional) ───────────────────────────────────────────────────── */
let s3Client, PutObjectCommand, DeleteObjectCommand;
try {
  ({ S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3'));
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    s3Client = new (require('@aws-sdk/client-s3').S3Client)({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
} catch (_) { /* @aws-sdk not installed — skip */ }

/* ── Cloudinary (optional) ───────────────────────────────────────────────── */
let cloudinary;
try {
  cloudinary = require('cloudinary').v2;
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  } else {
    cloudinary = null;
  }
} catch (_) { cloudinary = null; }

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/**
 * Upload via Cloudinary using a buffer stream.
 * Returns { fileUrl, s3Key } to stay API-compatible.
 */
const uploadViaCloudinary = (fileBuffer, mimeType, folder) => {
  return new Promise((resolve, reject) => {
    const resourceType = mimeType.startsWith('video') ? 'video' : 'image';
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `chargeease/${folder}`,
        resource_type: resourceType,
        transformation: resourceType === 'image' ? [{ quality: 'auto', fetch_format: 'auto' }] : [],
      },
      (error, result) => {
        if (error) return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        resolve({
          fileUrl: result.secure_url,
          s3Key: result.public_id, // reuse s3Key field for the public_id
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Core upload — tries S3 → Cloudinary → local disk in order.
 */
const uploadToS3WithFolder = async (fileBuffer, originalName, mimeType, folder = 'uploads') => {
  const ext = path.extname(originalName) || '.jpg';
  const uniqueName = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

  /* 1. AWS S3 */
  if (s3Client && process.env.AWS_S3_BUCKET_NAME) {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const region = process.env.AWS_REGION || 'us-east-1';
    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueName,
      Body: fileBuffer,
      ContentType: mimeType,
    }));
    return {
      fileUrl: `https://${bucketName}.s3.${region}.amazonaws.com/${uniqueName}`,
      s3Key: uniqueName,
    };
  }

  /* 2. Cloudinary */
  if (cloudinary) {
    return uploadViaCloudinary(fileBuffer, mimeType, folder);
  }

  /* 3. Local disk (dev only) */
  try {
    const uploadsDir = path.join(__dirname, `../../uploads/${folder}`);
    fs.mkdirSync(uploadsDir, { recursive: true });
    const localPath = path.join(uploadsDir, path.basename(uniqueName));
    fs.writeFileSync(localPath, fileBuffer);
    return { fileUrl: `/uploads/${folder}/${path.basename(uniqueName)}`, s3Key: uniqueName };
  } catch (diskErr) {
    throw new Error(
      'Image upload failed: no storage backend is configured. ' +
      'Set AWS_S3_BUCKET_NAME + AWS credentials, or CLOUDINARY_CLOUD_NAME + API keys, in your environment variables.'
    );
  }
};

/* ── Delete helper ───────────────────────────────────────────────────────── */
exports.deleteFromS3 = async (s3Key, fileUrl) => {
  /* AWS S3 */
  if (s3Client && process.env.AWS_S3_BUCKET_NAME && s3Key && !s3Key.includes('/')) {
    // public_ids from cloudinary contain '/', raw S3 keys also can — distinguish by URL
    if (fileUrl && !fileUrl.includes('cloudinary')) {
      try {
        await s3Client.send(new (require('@aws-sdk/client-s3').DeleteObjectCommand)({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: s3Key,
        }));
        return;
      } catch (err) {
        console.error('S3 Delete Error:', err.message);
      }
    }
  }

  /* Cloudinary */
  if (cloudinary && s3Key && (fileUrl || '').includes('cloudinary')) {
    try {
      await cloudinary.uploader.destroy(s3Key);
    } catch (err) {
      console.error('Cloudinary Delete Error:', err.message);
    }
    return;
  }

  /* Local fallback cleanup */
  if (fileUrl && fileUrl.startsWith('/uploads/')) {
    const relative = fileUrl.replace(/^\/uploads\//, '');
    const localPath = path.join(__dirname, '../../uploads', relative);
    if (fs.existsSync(localPath)) {
      try { fs.unlinkSync(localPath); } catch (_) {}
    }
  }
};

/* ── Named exports (backwards-compatible) ───────────────────────────────── */
exports.uploadToS3 = (buf, name, mime) =>
  uploadToS3WithFolder(buf, name, mime, 'certificates');

exports.uploadFounderImage = (buf, name, mime) =>
  uploadToS3WithFolder(buf, name, mime, 'founders');

exports.uploadProjectImage = (buf, name, mime) =>
  uploadToS3WithFolder(buf, name, mime, 'projects');
