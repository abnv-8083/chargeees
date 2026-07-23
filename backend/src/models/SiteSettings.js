const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: 'ChargEase' },
    companyTagline: { type: String, default: 'Powering the Future of Business' },
    companyDescription: { type: String, default: '' },
    logo: { type: String, default: null },
    favicon: { type: String, default: null },
    contact: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      address: { type: String, default: '' },
      officeHours: { type: String, default: 'Monday - Friday, 9:00 AM - 6:00 PM' },
      googleMapsEmbed: { type: String, default: '' },
      googleMapsApiKey: { type: String, default: '' },
    },
    social: {
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    smtp: {
      host: { type: String, default: '' },
      port: { type: Number, default: 587 },
      email: { type: String, default: '' },
      password: { type: String, default: '', select: false },
      fromName: { type: String, default: 'ChargEase' },
    },
    seo: {
      metaTitle: { type: String, default: 'ChargEase — Professional Excellence' },
      metaDescription: { type: String, default: 'ChargEase delivers cutting-edge solutions that transform industries and accelerate growth.' },
      ogImage: { type: String, default: null },
      twitterHandle: { type: String, default: '' },
      googleAnalyticsId: { type: String, default: '' },
    },
    navigation: [{ label: String, href: String, order: Number }],
    footer: {
      copyright: { type: String, default: `© ${new Date().getFullYear()} ChargEase. All rights reserved.` },
      privacyPolicyUrl: { type: String, default: '/privacy-policy' },
      termsUrl: { type: String, default: '/terms' },
      quickLinks: [{ label: String, href: String }],
    },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
