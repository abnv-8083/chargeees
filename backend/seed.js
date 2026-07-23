require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const SiteSettings = require('./src/models/SiteSettings');
const { HeroSection, AboutSection, VisionSection, MissionSection } = require('./src/models/Sections');
const Founder = require('./src/models/Founder');
const Project = require('./src/models/Project');
const Service = require('./src/models/Service');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany(), SiteSettings.deleteMany(),
    HeroSection.deleteMany(), AboutSection.deleteMany(),
    VisionSection.deleteMany(), MissionSection.deleteMany(),
    Founder.deleteMany(), Project.deleteMany(), Service.deleteMany(),
  ]);
  console.log('🧹 Cleared existing data');

  // Admin user
  await User.create({ name: 'Super Admin', email: 'admin@chargeease.com', password: 'Admin@1234', role: 'superadmin' });
  console.log('👤 Created admin user: admin@chargeease.com / Admin@1234');

  // Site Settings
  await SiteSettings.create({
    companyName: 'ChargEase',
    companyTagline: 'Powering the Future of Business',
    companyDescription: 'ChargEase delivers cutting-edge solutions that transform industries and accelerate growth through innovation, precision, and excellence.',
    contact: {
      email: 'info@chargeease.com',
      phone: '+1 (555) 000-0000',
      address: '100 Innovation Drive, Suite 500, New York, NY 10001',
      officeHours: 'Monday – Friday, 9:00 AM – 6:00 PM EST',
    },
    navigation: [
      { label: 'Home', href: '#hero', order: 1 },
      { label: 'About', href: '#about', order: 2 },
      { label: 'Vision', href: '#vision', order: 3 },
      { label: 'Mission', href: '#mission', order: 4 },
      { label: 'Founder', href: '#founder', order: 5 },
      { label: 'Projects', href: '#projects', order: 6 },
      { label: 'Services', href: '#services', order: 7 },
      { label: 'Gallery', href: '#gallery', order: 8 },
      { label: 'Contact', href: '#contact', order: 9 },
    ],
  });

  // Hero
  await HeroSection.create({
    companyName: 'ChargEase',
    tagline: 'Powering the Future of Business',
    introduction: 'We deliver cutting-edge solutions that transform industries and accelerate growth through innovation, precision, and excellence.',
    primaryCTA: { label: 'Explore Our Work', link: '#projects' },
    secondaryCTA: { label: 'Get in Touch', link: '#contact' },
  });

  // About
  await AboutSection.create({
    heading: 'About ChargEase',
    subheading: 'Who We Are',
    introduction: 'ChargEase is a forward-thinking company committed to delivering transformative solutions.',
    story: 'Founded with a singular vision — to redefine how businesses grow and operate — ChargEase has evolved into a trusted partner for organizations seeking precision, innovation, and sustainable progress.',
    coreValues: [
      { title: 'Integrity', description: 'We operate with transparency and honesty in every engagement.', icon: 'Shield' },
      { title: 'Innovation', description: 'We push boundaries and embrace emerging technologies.', icon: 'Lightbulb' },
      { title: 'Excellence', description: 'We deliver nothing short of the highest quality in all we do.', icon: 'Star' },
      { title: 'Client-First', description: 'Our clients are at the center of every decision we make.', icon: 'Heart' },
    ],
    timeline: [
      { year: '2018', title: 'Founded', description: 'ChargEase was established with a vision to transform business operations.' },
      { year: '2020', title: 'Expansion', description: 'Expanded to 3 countries with a team of 50+ professionals.' },
      { year: '2022', title: 'Innovation Award', description: 'Recognized as the most innovative company of the year.' },
      { year: '2024', title: 'Global Reach', description: 'Serving 200+ clients across 15+ countries worldwide.' },
    ],
  });

  // Vision
  await VisionSection.create({
    heading: 'Our Vision',
    statement: 'To be the global benchmark of excellence — where innovation meets integrity, and ambition is realized with purpose.',
    futureGoals: [
      { title: 'Global Leadership', description: 'Establish ChargEase as the #1 trusted partner in our domain globally.' },
      { title: 'Sustainable Impact', description: 'Drive sustainable growth for our clients and communities alike.' },
      { title: 'Technological Frontier', description: 'Pioneer the next generation of intelligent business solutions.' },
    ],
    strategicDirection: 'We aim to leverage emerging technologies to create scalable, future-proof solutions that stand the test of time.',
  });

  // Mission
  await MissionSection.create({
    heading: 'Our Mission',
    statement: 'To empower organizations with intelligent solutions, uncompromising quality, and a relentless commitment to client success.',
    commitments: [
      { title: 'Quality Assurance', description: 'Every deliverable undergoes rigorous quality checks before reaching our clients.' },
      { title: 'Continuous Innovation', description: 'We invest in R&D to stay ahead of industry trends and client needs.' },
      { title: 'Partnership Approach', description: 'We build long-term relationships, not just one-time transactions.' },
    ],
    objectives: [
      'Deliver measurable business outcomes for every client',
      'Maintain the highest standards of professional ethics',
      'Foster a culture of continuous learning and growth',
      'Create solutions that scale with our clients\' ambitions',
    ],
    customerFirst: 'Every strategy, product, and decision at ChargEase is crafted with our clients\' success as the primary objective.',
  });

  // Founders
  await Founder.create([
    {
      type: 'founder',
      name: 'Alexandra Morgan',
      title: 'Founder & CEO',
      biography: 'Alexandra Morgan is a visionary entrepreneur with over 15 years of experience in building high-impact businesses. Her strategic thinking and passion for innovation have been the cornerstone of ChargEase\'s rapid growth.',
      experience: '15+ years in business strategy, technology leadership, and venture building across Fortune 500 companies and startups.',
      achievements: [
        'Forbes 30 Under 30 — Business & Technology',
        'Built ChargEase from 0 to $50M ARR in 5 years',
        'Led 3 successful company acquisitions',
        'Speaker at Davos, TED, and Web Summit',
      ],
      education: [
        { degree: 'MBA — Strategy & Innovation', institution: 'Harvard Business School', year: '2009' },
        { degree: 'BSc — Computer Science', institution: 'MIT', year: '2007' },
      ],
      messageFromFounder: 'ChargEase was born from a simple belief: that every business, regardless of size, deserves access to world-class tools and expertise. We are not just a company — we are your growth partner.',
      socialLinks: { linkedin: '#', twitter: '#', instagram: '#' },
      order: 1,
    },
    {
      type: 'cofounder',
      name: 'Daniel Reeves',
      title: 'Co-Founder & CTO',
      biography: 'Daniel Reeves is a technology architect and serial entrepreneur who has spent two decades designing the systems that power modern business. He leads ChargEase\'s technical vision with precision and creativity.',
      experience: '20+ years in software engineering, cloud infrastructure, and enterprise technology architecture.',
      achievements: [
        'Architected systems serving 50M+ users globally',
        'Multiple patents in distributed computing',
        'MIT Technology Review Innovator of the Year',
        'Open-source contributor with 10,000+ GitHub stars',
      ],
      education: [
        { degree: 'PhD — Computer Science', institution: 'Stanford University', year: '2005' },
        { degree: 'BSc — Electrical Engineering', institution: 'Caltech', year: '2001' },
      ],
      messageFromFounder: 'Technology should serve people, not the other way around. At ChargEase, we build tools that are powerful yet human — designed to amplify what you can achieve.',
      socialLinks: { linkedin: '#', twitter: '#', instagram: '#' },
      order: 1,
    },
  ]);

  // Services
  await Service.create([
    { name: 'Strategic Consulting', description: 'Comprehensive business strategy development tailored to your organization\'s unique goals and market position.', icon: 'Target', order: 1 },
    { name: 'Digital Transformation', description: 'End-to-end digital transformation services that modernize operations, enhance efficiency, and unlock new revenue streams.', icon: 'Zap', order: 2 },
    { name: 'Technology Solutions', description: 'Custom software and technology solutions designed to solve complex business challenges at enterprise scale.', icon: 'Code', order: 3 },
    { name: 'Data & Analytics', description: 'Advanced data analytics and business intelligence solutions that turn raw data into actionable strategic insights.', icon: 'BarChart', order: 4 },
    { name: 'Innovation Labs', description: 'Dedicated innovation and R&D services to help your organization stay ahead of disruption and lead in your industry.', icon: 'Lightbulb', order: 5 },
    { name: 'Global Partnerships', description: 'Building strategic alliances and partnership frameworks that accelerate global expansion and market penetration.', icon: 'Globe', order: 6 },
  ]);

  // Projects
  await Project.create([
    { title: 'Nexus Platform', description: 'A comprehensive B2B SaaS platform connecting 500+ enterprises globally with seamless workflow automation and real-time analytics.', category: 'Technology', status: 'completed', completionDate: new Date('2024-03-01'), featured: true, order: 1 },
    { title: 'Meridian Initiative', description: 'Large-scale digital transformation project for a Fortune 500 financial institution, reducing operational costs by 40%.', category: 'Consulting', status: 'completed', completionDate: new Date('2023-11-01'), featured: true, order: 2 },
    { title: 'Aurora Analytics', description: 'Next-generation business intelligence suite providing predictive insights across supply chain, marketing, and operations.', category: 'Data & Analytics', status: 'ongoing', order: 3 },
    { title: 'Helix Infrastructure', description: 'Cloud-native infrastructure modernization for a global healthcare network, serving 2M+ patients across 8 countries.', category: 'Technology', status: 'completed', completionDate: new Date('2024-06-01'), order: 4 },
    { title: 'Zenith Expansion', description: 'Market entry and expansion strategy for a leading European tech company entering the North American market.', category: 'Strategy', status: 'ongoing', order: 5 },
    { title: 'Catalyst Program', description: 'Accelerator program empowering 50 emerging startups with mentorship, funding access, and strategic partnerships.', category: 'Innovation', status: 'upcoming', order: 6 },
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('\n🔐 Admin Credentials:');
  console.log('   Email:    admin@chargeease.com');
  console.log('   Password: Admin@1234\n');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
