require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const connectDB = require('./src/config/database');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');

// Routes
const authRoutes = require('./src/routes/auth');
const sectionRoutes = require('./src/routes/sections');
const founderRoutes = require('./src/routes/founders');
const projectRoutes = require('./src/routes/projects');
const serviceRoutes = require('./src/routes/services');
const galleryRoutes = require('./src/routes/gallery');
const inquiryRoutes = require('./src/routes/inquiries');
const settingsRoutes = require('./src/routes/settings');

// Connect to MongoDB
connectDB();

const app = express();

// Security & Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(mongoSanitize());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Rate limiting
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: 'Too many requests.' });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many auth attempts.' });
const inquiryLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: 'Too many inquiry submissions.' });

app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter);

// Health check
app.get('/api/health', (req, res) => res.json({ success: true, message: 'ChargEase API is running 🚀', env: process.env.NODE_ENV }));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/founders', founderRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/inquiries', inquiryLimiter, inquiryRoutes);
app.use('/api/settings', settingsRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
