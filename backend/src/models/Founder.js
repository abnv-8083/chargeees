const mongoose = require('mongoose');

const founderSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['founder', 'cofounder'], default: 'founder' },
    name: { type: String, required: true },
    title: { type: String, default: 'Founder & CEO' },
    profileImage: { type: String, default: null },
    biography: { type: String, default: '' },
    experience: { type: String, default: '' },
    achievements: [{ type: String }],
    education: [{ degree: String, institution: String, year: String }],
    messageFromFounder: { type: String, default: '' },
    socialLinks: {
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Founder', founderSchema);
