import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

import { notFound, errorHandler } from '#shared/index.js';

// Import Feature Route Handlers
import { authRoutes } from '#features/auth/index.js';
import { categoryRoutes } from '#features/categories/index.js';
import { productRoutes } from '#features/products/index.js';
import { orderRoutes } from '#features/orders/index.js';
import { wishlistRoutes } from '#features/wishlist/index.js';
import { paymentRoutes } from '#features/payments/index.js';
import { analyticsRoutes } from '#features/analytics/index.js';

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false // Allow loading images locally
}));

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
  'http://localhost:3000',
  'http://localhost:5173',
  'https://shopifi-commerce.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    const isVercel = origin && (origin.endsWith('.vercel.app') || origin.includes('vercel.app'));
    const isLocal = origin && (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1'));
    if (!origin || allowedOrigins.includes(origin) || isVercel || isLocal || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Logger in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', analyticsRoutes); // Admin routes mapped to analytics features

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Cinematic Editorial Commerce REST API is active.' });
});

// Fallback Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
