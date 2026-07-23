const SiteSettings = require('../models/SiteSettings');
const Project = require('../models/Project');
const Service = require('../models/Service');
const GalleryItem = require('../models/GalleryItem');
const Inquiry = require('../models/Inquiry');

exports.getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.status(200).json({ success: true, data: settings });
  } catch (err) { next(err); }
};

exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, req.body, {
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
