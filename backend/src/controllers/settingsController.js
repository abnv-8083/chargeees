const SiteSettings = require('../models/SiteSettings');
const Project = require('../models/Project');
const Service = require('../models/Service');
const GalleryItem = require('../models/GalleryItem');
const Inquiry = require('../models/Inquiry');

const { uploadToCloudinary } = require('../config/cloudinary');

exports.getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.status(200).json({ success: true, data: settings });
  } catch (err) { next(err); }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const body = { ...req.body };

    // Parse JSON-stringified nested fields from FormData
    const jsonFields = ['contact', 'social', 'seo', 'navigation', 'footer', 'smtp'];
    jsonFields.forEach((field) => {
      if (typeof body[field] === 'string') {
        try {
          body[field] = JSON.parse(body[field]);
        } catch (e) {
          // Ignore parsing error if already an object or invalid
        }
      }
    });

    // Handle logo and favicon uploads via Cloudinary
    if (req.files) {
      if (req.files.logo && req.files.logo[0]) {
        try {
          const logoUpload = await uploadToCloudinary(
            req.files.logo[0].buffer,
            req.files.logo[0].mimetype,
            'chargeease/branding'
          );
          body.logo = logoUpload.url;
        } catch (err) {
          console.error('Logo upload error:', err);
        }
      }
      if (req.files.favicon && req.files.favicon[0]) {
        try {
          const faviconUpload = await uploadToCloudinary(
            req.files.favicon[0].buffer,
            req.files.favicon[0].mimetype,
            'chargeease/branding'
          );
          body.favicon = faviconUpload.url;
        } catch (err) {
          console.error('Favicon upload error:', err);
        }
      }
    }

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(body);
    } else {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, body, {
        new: true,
        runValidators: true,
      });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (err) { next(err); }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [projects, services, gallery, totalInquiries, unreadInquiries, recentInquiries] = await Promise.all([
      Project.countDocuments({ isPublished: true }),
      Service.countDocuments({ isPublished: true }),
      GalleryItem.countDocuments({ isPublished: true }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'unread' }),
      Inquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    res.status(200).json({
      success: true,
      data: { projects, services, gallery, totalInquiries, unreadInquiries, recentInquiries },
    });
  } catch (err) { next(err); }
};
