const Certificate = require('../models/Certificate');
const User = require('../models/User');
const { uploadToS3, deleteFromS3 } = require('../config/s3');

// Helper to generate a unique Certificate Number e.g., CERT-2026-9481
const generateCertNumber = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CERT-${year}-${randomNum}`;
};

// @desc    Create / Issue a new Certificate (Admin)
// @route   POST /api/certificates
// @access  Private (Admin/Superadmin/Editor)
exports.createCertificate = async (req, res, next) => {
  try {
    const { title, user, issueDate, expiryDate, issuer, description } = req.body;
    let { certificateNumber } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Certificate title is required.' });
    }

    // Auto-generate certificate number if not provided or empty
    if (!certificateNumber || certificateNumber.trim() === '') {
      certificateNumber = generateCertNumber();
      // Ensure uniqueness
      while (await Certificate.findOne({ certificateNumber })) {
        certificateNumber = generateCertNumber();
      }
    } else {
      certificateNumber = certificateNumber.trim().toUpperCase();
      const existing = await Certificate.findOne({ certificateNumber });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Certificate number already exists.' });
      }
    }

    let fileUrl = req.body.fileUrl || '';
    let s3Key = '';
    let fileType = 'pdf';

    // Handle uploaded file (PDF or Image)
    if (req.file) {
      const mime = req.file.mimetype || '';
      fileType = mime.includes('pdf') ? 'pdf' : 'image';
      const uploadResult = await uploadToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
      fileUrl = uploadResult.fileUrl;
      s3Key = uploadResult.s3Key;
    }

    if (!fileUrl) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF or Image certificate file.' });
    }

    const certificate = await Certificate.create({
      title,
      certificateNumber,
      user: user || null,
      issueDate: issueDate || Date.now(),
      expiryDate: expiryDate || null,
      issuer: issuer || 'ChargEase',
      description: description || '',
      fileUrl,
      fileType,
      s3Key,
      issuedBy: req.user ? req.user.id : null,
    });

    const populated = await Certificate.findById(certificate._id).populate('user', 'name email').populate('issuedBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Certificate created successfully.',
      data: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all certificates (Admin)
// @route   GET /api/certificates
// @access  Private (Admin)
exports.getAllCertificates = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { certificateNumber: { $regex: search, $options: 'i' } },
        { issuer: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Certificate.countDocuments(query);
    const certificates = await Certificate.find(query)
      .populate('user', 'name email role')
      .populate('issuedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total,
      data: certificates,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search certificate by certificate number (Public / Client)
// @route   GET /api/certificates/search/:certNumber
// @access  Public / Authenticated
exports.searchCertificateByNumber = async (req, res, next) => {
  try {
    const certNumber = (req.params.certNumber || '').trim().toUpperCase();

    if (!certNumber) {
      return res.status(400).json({ success: false, message: 'Please provide a valid certificate number.' });
    }

    const certificate = await Certificate.findOne({ certificateNumber: certNumber })
      .populate('user', 'name email');

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'No certificate found with that certificate number.' });
    }

    // Check if claimed
    const isClaimedByMe = req.user && certificate.user && certificate.user._id.toString() === req.user.id.toString();
    const isClaimedByOthers = certificate.user && (!req.user || certificate.user._id.toString() !== req.user.id.toString());

    res.status(200).json({
      success: true,
      data: {
        _id: certificate._id,
        title: certificate.title,
        certificateNumber: certificate.certificateNumber,
        issueDate: certificate.issueDate,
        expiryDate: certificate.expiryDate,
        issuer: certificate.issuer,
        description: certificate.description,
        fileUrl: certificate.fileUrl,
        fileType: certificate.fileType,
        status: certificate.status,
        isClaimed: !!certificate.user,
        isClaimedByMe,
        isClaimedByOthers,
        claimedUser: certificate.user ? { name: certificate.user.name, email: certificate.user.email } : null,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Claim / Link certificate to user profile
// @route   POST /api/certificates/claim
// @access  Private (Authenticated Client / User)
exports.claimCertificate = async (req, res, next) => {
  try {
    const { certificateNumber } = req.body;
    if (!certificateNumber) {
      return res.status(400).json({ success: false, message: 'Certificate number is required.' });
    }

    const certNumber = certificateNumber.trim().toUpperCase();
    const certificate = await Certificate.findOne({ certificateNumber: certNumber });

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'No certificate found with that number.' });
    }

    if (certificate.status !== 'active') {
      return res.status(400).json({ success: false, message: `This certificate is ${certificate.status}.` });
    }

    // Check if already assigned to someone else
    if (certificate.user && certificate.user.toString() !== req.user.id.toString()) {
      return res.status(400).json({ success: false, message: 'This certificate has already been claimed by another account.' });
    }

    // Link certificate to user
    certificate.user = req.user.id;
    await certificate.save();

    const updated = await Certificate.findById(certificate._id).populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Certificate claimed and added to your profile successfully!',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get certificates for logged-in user
// @route   GET /api/certificates/my-certificates
// @access  Private (Client / Authenticated User)
exports.getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single certificate by ID
// @route   GET /api/certificates/:id
// @access  Private
exports.getCertificateById = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('user', 'name email')
      .populate('issuedBy', 'name email');

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found.' });
    }

    res.status(200).json({ success: true, data: certificate });
  } catch (err) {
    next(err);
  }
};

// @desc    Update certificate (Admin)
// @route   PUT /api/certificates/:id
// @access  Private (Admin)
exports.updateCertificate = async (req, res, next) => {
  try {
    let certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found.' });
    }

    // Handle new file if uploaded
    if (req.file) {
      if (certificate.s3Key || certificate.fileUrl) {
        await deleteFromS3(certificate.s3Key, certificate.fileUrl);
      }
      const mime = req.file.mimetype || '';
      req.body.fileType = mime.includes('pdf') ? 'pdf' : 'image';
      const uploadResult = await uploadToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
      req.body.fileUrl = uploadResult.fileUrl;
      req.body.s3Key = uploadResult.s3Key;
    }

    if (req.body.certificateNumber) {
      req.body.certificateNumber = req.body.certificateNumber.trim().toUpperCase();
    }

    certificate = await Certificate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user', 'name email');

    res.status(200).json({ success: true, message: 'Certificate updated successfully.', data: certificate });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete certificate (Admin)
// @route   DELETE /api/certificates/:id
// @access  Private (Admin)
exports.deleteCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found.' });
    }

    // Remove from S3
    if (certificate.s3Key || certificate.fileUrl) {
      await deleteFromS3(certificate.s3Key, certificate.fileUrl);
    }

    await certificate.deleteOne();

    res.status(200).json({ success: true, message: 'Certificate deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
