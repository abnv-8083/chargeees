const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: '' },
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video', 'pdf'], default: 'image' },
    folder: { type: String, default: 'general' },
    mimeType: { type: String, default: '' },
    size: { type: Number, default: 0 }, // bytes
    width: { type: Number },
    height: { type: Number },
    publicId: { type: String, default: '' }, // Cloudinary public_id
    tags: [{ type: String }],
    caption: { type: String, default: '' },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
