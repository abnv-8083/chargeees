const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const fs = require('fs');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

/**
 * Core upload helper — uploads to S3 under the given folder prefix,
 * or falls back to local disk storage when S3 credentials are absent.
 *
 * @param {Buffer} fileBuffer
 * @param {string} originalName
 * @param {string} mimeType
 * @param {string} folder  e.g. 'certificates' | 'founders' | 'projects'
 * @returns {{ fileUrl: string, s3Key: string }}
 */
const uploadToS3WithFolder = async (fileBuffer, originalName, mimeType, folder = 'uploads') => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const ext = path.extname(originalName) || (mimeType === 'application/pdf' ? '.pdf' : '.jpg');
  const s3Key = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

  // ── S3 upload ────────────────────────────────────────────────────────────
  if (bucketName && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    const region = process.env.AWS_REGION || 'us-east-1';
    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: mimeType,
    }));
    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`;
    return { fileUrl, s3Key };
  }

  // ── Local disk fallback (dev only — never on read-only hosts like Render) ─
  // Only attempt when we have a writable filesystem
  try {
    const uploadsDir = path.join(__dirname, `../../uploads/${folder}`);
    fs.mkdirSync(uploadsDir, { recursive: true });
    const localPath = path.join(uploadsDir, path.basename(s3Key));
    fs.writeFileSync(localPath, fileBuffer);
    return { fileUrl: `/uploads/${folder}/${path.basename(s3Key)}`, s3Key };
  } catch (diskErr) {
    // Filesystem is read-only (Render, Vercel, etc.) — throw a clear error
    // so the controller surfaces a 500 with a useful message
    throw new Error(
      'Image upload failed: AWS S3 is not configured and the server filesystem is read-only. ' +
      'Please set AWS_S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY environment variables on Render.'
    );
  }
};

/**
 * Upload to 'certificates' folder (backwards-compatible alias).
 */
exports.uploadToS3 = (fileBuffer, originalName, mimeType) =>
  uploadToS3WithFolder(fileBuffer, originalName, mimeType, 'certificates');

/**
 * Upload to 'founders' folder.
 */
exports.uploadFounderImage = (fileBuffer, originalName, mimeType) =>
  uploadToS3WithFolder(fileBuffer, originalName, mimeType, 'founders');

/**
 * Upload to 'projects' folder.
 */
exports.uploadProjectImage = (fileBuffer, originalName, mimeType) =>
  uploadToS3WithFolder(fileBuffer, originalName, mimeType, 'projects');

/**
 * Delete file from S3 bucket or local fallback.
 * Supports any folder prefix.
 */
exports.deleteFromS3 = async (s3Key, fileUrl) => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (bucketName && s3Key && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    try {
      await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key }));
      return;
    } catch (err) {
      console.error('AWS S3 Delete Error:', err.message);
    }
  }

  // Local fallback — works for any /uploads/<folder>/ path
  if (fileUrl && fileUrl.startsWith('/uploads/')) {
    const relative = fileUrl.replace(/^\/uploads\//, '');
    const localPath = path.join(__dirname, '../../uploads', relative);
    if (fs.existsSync(localPath)) {
      try { fs.unlinkSync(localPath); } catch (e) { /* ignore */ }
    }
  }
};
