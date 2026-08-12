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
 * Upload file to AWS S3 bucket (or local storage fallback if S3 credentials not provided)
 */
exports.uploadToS3 = async (fileBuffer, originalName, mimeType) => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const ext = path.extname(originalName) || (mimeType === 'application/pdf' ? '.pdf' : '.png');
  const filename = `certificates/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

  // If AWS S3 credentials and bucket name are configured, upload to S3
  if (bucketName && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: filename,
        Body: fileBuffer,
        ContentType: mimeType,
      });

      await s3Client.send(command);

      const region = process.env.AWS_REGION || 'us-east-1';
      const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${filename}`;
      return { fileUrl, s3Key: filename };
    } catch (err) {
      console.error('AWS S3 Upload Error, using local fallback:', err.message);
    }
  }

  // Fallback to local storage if S3 credentials are missing or upload fails
  const uploadsDir = path.join(__dirname, '../../uploads/certificates');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const localPath = path.join(uploadsDir, path.basename(filename));
  fs.writeFileSync(localPath, fileBuffer);

  const fileUrl = `/uploads/certificates/${path.basename(filename)}`;
  return { fileUrl, s3Key: filename };
};

/**
 * Delete file from S3 bucket or local fallback
 */
exports.deleteFromS3 = async (s3Key, fileUrl) => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (bucketName && s3Key && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
      });
      await s3Client.send(command);
      return;
    } catch (err) {
      console.error('AWS S3 Delete Error:', err.message);
    }
  }

  // Local fallback cleanup
  if (fileUrl && fileUrl.startsWith('/uploads/certificates/')) {
    const filename = path.basename(fileUrl);
    const localPath = path.join(__dirname, '../../uploads/certificates', filename);
    if (fs.existsSync(localPath)) {
      try { fs.unlinkSync(localPath); } catch (e) { /* ignore */ }
    }
  }
};
