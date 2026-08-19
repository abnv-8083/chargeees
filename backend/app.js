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
const certificateRoutes = require('./src/routes/certificates');
const path = require('path');

// Connect to MongoDB
connectDB();

const app = express();

// Serve local upload fallback files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Security & Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));
app.use(compression());
// Only parse JSON / urlencoded for non-multipart requests
// (multer handles multipart/form-data itself — don't let express touch it first)
app.use((req, res, next) => {
  const ct = req.headers['content-type'] || '';
  if (ct.startsWith('multipart/form-data')) return next();
  express.json({ limit: '25mb' })(req, res, next);
});
app.use((req, res, next) => {
  const ct = req.headers['content-type'] || '';
  if (ct.startsWith('multipart/form-data')) return next();
  express.urlencoded({ extended: true, limit: '25mb' })(req, res, next);
});
// Sanitize only after body is parsed, skip when body is absent
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query) mongoSanitize.sanitize(req.query);
  next();
});
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
app.use('/api/certificates', certificateRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
