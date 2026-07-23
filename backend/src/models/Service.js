const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Service name is required'], trim: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'Zap' }, // Lucide icon name
    features: [{ type: String }],
    learnMoreLink: { type: String, default: '#' },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    isDraft: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
