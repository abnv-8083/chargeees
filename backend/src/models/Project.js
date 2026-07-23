const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Project title is required'], trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'General' },
    status: { type: String, enum: ['ongoing', 'completed', 'upcoming', 'on-hold'], default: 'ongoing' },
    completionDate: { type: Date, default: null },
    coverImage: { type: String, default: null },
    gallery: [
      {
        url: String,
        type: { type: String, enum: ['image', 'video'], default: 'image' },
        caption: String,
      },
    ],
    tags: [{ type: String }],
    client: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    isDraft: { type: Boolean, default: false },
    seo: {
      metaTitle: String,
      metaDescription: String,
    },
  },
  { timestamps: true }
);

projectSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
