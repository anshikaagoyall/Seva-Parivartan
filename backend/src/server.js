import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import transferRoutes from './routes/transferRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import moderationRoutes from './routes/moderationRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
});

// Connect Database
connectDB();

// Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth/login', loginLimiter);

// Serve Uploads Folder for Multer Files & Documents
const uploadDir = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadDir));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'Seva Parivartan Independent Facilitation Engine',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    services: {
      auth: 'JWT Active',
      upload: 'Multer Active',
      haversine: 'Active',
      nominatim: 'OpenStreetMap Proxy Active',
      privacyMasking: 'Strict Anonymous Mode Active',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/moderation', moderationRoutes);
app.use('/api/departments', departmentRoutes);

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  =============================================================
  🏛️  SEVA PARIVARTAN - INDEPENDENT FACILITATION API ENGINE
  =============================================================
  🔊  Port: ${PORT}
  🌍  Environment: ${process.env.NODE_ENV || 'development'}
  🔒  Privacy Masking: Active
  🔗  Health Check: http://localhost:${PORT}/api/health
  =============================================================
  `);
});
