const Inquiry = require('../models/Inquiry');
const { sendInquiryEmails, sendReplyEmail } = require('../utils/email');
const { Parser } = require('json2csv');

// @desc  Public inquiry submission
exports.submitInquiry = async (req, res, next) => {
  try {
    const { name, companyName, email, phone, subject, inquiryType, message } = req.body;
    const inquiry = await Inquiry.create({
      name, companyName, email, phone, subject, inquiryType, message,
      ipAddress: req.ip,
    });
    try { await sendInquiryEmails(inquiry); } catch (emailErr) {
      console.error('Email send error:', emailErr.message);
    }
    res.status(201).json({ success: true, message: 'Your inquiry has been received. We will get back to you soon.', id: inquiry._id });
  } catch (err) { next(err); }
};

// @desc  Admin — get all inquiries
exports.getInquiries = async (req, res, next) => {
  try {
    const { status, search, inquiryType, page = 1, limit = 20, starred } = req.query;
    const query = {};
    if (status) query.status = status;
    if (inquiryType) query.inquiryType = inquiryType;
    if (starred === 'true') query.isStarred = true;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
      { companyName: { $regex: search, $options: 'i' } },
    ];

    const total = await Inquiry.countDocuments(query);
    const inquiries = await Inquiry.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.status(200).json({ success: true, total, page: parseInt(page), data: inquiries });
  } catch (err) { next(err); }
};

// @desc  Admin — get single inquiry
exports.getInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    if (inquiry.status === 'unread') { inquiry.status = 'read'; await inquiry.save(); }
    res.status(200).json({ success: true, data: inquiry });
  } catch (err) { next(err); }
};

// @desc  Admin — update status / star
exports.updateInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    res.status(200).json({ success: true, data: inquiry });
  } catch (err) { next(err); }
};

// @desc  Admin — reply to inquiry via email
exports.replyInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    await sendReplyEmail({ to: inquiry.email, name: inquiry.name, subject: inquiry.subject, replyMessage: req.body.message });
    inquiry.status = 'replied';
    inquiry.repliedAt = Date.now();
    inquiry.repliedBy = req.user.id;
    await inquiry.save();
    res.status(200).json({ success: true, message: 'Reply sent successfully.' });
  } catch (err) { next(err); }
};

// @desc  Admin — delete inquiry
exports.deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    res.status(200).json({ success: true, message: 'Inquiry deleted.' });
  } catch (err) { next(err); }
};

// @desc  Admin — export inquiries as CSV
exports.exportInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();
    const fields = ['_id', 'name', 'companyName', 'email', 'phone', 'subject', 'inquiryType', 'message', 'status', 'createdAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(inquiries);
    res.header('Content-Type', 'text/csv');
    res.attachment('inquiries.csv');
    res.send(csv);
  } catch (err) { next(err); }
};

// @desc  Dashboard stats
exports.getStats = async (req, res, next) => {
  try {
    const [total, unread, read, replied] = await Promise.all([
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'unread' }),
      Inquiry.countDocuments({ status: 'read' }),
      Inquiry.countDocuments({ status: 'replied' }),
    ]);
    res.status(200).json({ success: true, data: { total, unread, read, replied } });
  } catch (err) { next(err); }
};
