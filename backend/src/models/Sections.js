const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: 'ChargEase' },
    tagline: { type: String, default: 'Powering the Future of Business' },
    introduction: { type: String, default: 'We deliver cutting-edge solutions that transform industries and accelerate growth through innovation, precision, and excellence.' },
    primaryCTA: { label: String, link: String },
    secondaryCTA: { label: String, link: String },
    backgroundType: { type: String, enum: ['particles', 'gradient', 'image'], default: 'particles' },
    backgroundImage: { type: String, default: null },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const aboutSchema = new mongoose.Schema(
  {
    heading: { type: String, default: 'About ChargEase' },
    subheading: { type: String, default: 'Who We Are' },
    introduction: { type: String, default: 'ChargEase is a forward-thinking company committed to delivering transformative solutions across industries.' },
    story: { type: String, default: 'Founded with a singular vision — to redefine how businesses grow and operate — ChargEase has evolved into a trusted partner for organizations seeking precision, innovation, and sustainable progress.' },
    coreValues: [{ title: String, description: String, icon: String }],
    whyUs: [{ title: String, description: String }],
    timeline: [{ year: String, title: String, description: String }],
    image: { type: String, default: null },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const visionSchema = new mongoose.Schema(
  {
    heading: { type: String, default: 'Our Vision' },
    statement: { type: String, default: 'To be the global benchmark of excellence — where innovation meets integrity, and ambition is realized with purpose.' },
    futureGoals: [{ title: String, description: String }],
    strategicDirection: { type: String, default: '' },
    image: { type: String, default: null },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const missionSchema = new mongoose.Schema(
  {
    heading: { type: String, default: 'Our Mission' },
    statement: { type: String, default: 'To empower organizations with intelligent solutions, uncompromising quality, and a relentless commitment to client success.' },
    commitments: [{ title: String, description: String }],
    objectives: [{ type: String }],
    customerFirst: { type: String, default: '' },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = {
  HeroSection: mongoose.model('HeroSection', heroSchema),
  AboutSection: mongoose.model('AboutSection', aboutSchema),
  VisionSection: mongoose.model('VisionSection', visionSchema),
  MissionSection: mongoose.model('MissionSection', missionSchema),
};
