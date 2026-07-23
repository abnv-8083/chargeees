const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    companyName: { type: String, trim: true, default: '' },
    email: { type: String, required: [true, 'Email is required'], lowercase: true, trim: true },
    phone: { type: String, trim: true, default: '' },
    subject: { type: String, required: [true, 'Subject is required'], trim: true },
    inquiryType: {
      type: String,
      enum: ['General', 'Partnership', 'Project', 'Career', 'Media', 'Support', 'Other'],
      default: 'General',
    },
    message: { type: String, required: [true, 'Message is required'] },
    status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
    isStarred: { type: Boolean, default: false },
    adminNotes: { type: String, default: '' },
    repliedAt: { type: Date },
    repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
