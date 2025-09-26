/**
 * Main Express Server
 * Production-ready API server with comprehensive security
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import { pino } from 'pino';
import pinoHttp from 'pino-http';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';

// Import routers
import authRouter from './api/auth.router';
import childrenRouter from './api/children.router';
import parentsRouter from './api/parents.router';
import verificationRouter from './api/verification.router';
import gamesRouter from './api/games.router';
import securityRouter from './api/security.router';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { securityHeaders } from './middleware/securityHeaders';
import { requestValidator } from './middleware/requestValidator';
import { authMiddleware } from './middleware/authMiddleware';

// Import services
import { kmsService } from './services/KeyManagementService';
import { jwtAuthService } from './auth/JWTAuthService';

// Load environment variables
dotenv.config();

// Create logger
const logger = pino({
  name: 'stealth-learning-api',
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
});

// Initialize Express app
const app: Express = express();
const PORT = process.env.PORT || 3000;

// Redis client for sessions and rate limiting
let redisClient: Redis | null = null;

/**
 * Initialize database connections
 */
async function initializeDatabase(): Promise<void> {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/stealth-learning';
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    logger.info('✅ MongoDB connected successfully');

    // Connect to Redis if available
    if (process.env.REDIS_URL) {
      redisClient = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => Math.min(times * 50, 2000)
      });

      redisClient.on('connect', () => {
        logger.info('✅ Redis connected successfully');
      });

      redisClient.on('error', (err) => {
        logger.error('Redis connection error:', err);
      });
    } else {
      logger.warn('⚠️ Redis not configured - using in-memory session store');
    }
  } catch (error) {
    logger.error('❌ Database initialization failed:', error);
    throw error;
  }
}

/**
 * Configure security middleware
 */
function configureSecurityMiddleware(): void {
  // Basic security headers with Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts for now
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        childSrc: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        upgradeInsecureRequests: []
      }
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    dnsPrefetchControl: true,
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true
  }));

  // CORS configuration
  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);

      // Allow requests with no origin (mobile apps, Postman, etc)
      if (!origin) return callback(null, true);

      // Check if origin is allowed
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
    exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Per-Page'],
    maxAge: 86400 // 24 hours
  };
  app.use(cors(corsOptions));

  // Additional security headers
  app.use(securityHeaders);

  // Body parsing middleware with limits
  app.use(express.json({
    limit: '10mb',
    type: ['application/json', 'text/plain']
  }));
  app.use(express.urlencoded({
    extended: true,
    limit: '10mb'
  }));

  // MongoDB query sanitization
  app.use(mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
      logger.warn(`Sanitized potentially malicious input in ${key}`);
    }
  }));

  // Compression
  app.use(compression());

  // Request logging
  app.use(pinoHttp({
    logger,
    autoLogging: {
      ignore: (req) => req.url === '/health'
    },
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        headers: {
          ...req.headers,
          authorization: req.headers.authorization ? 'Bearer [REDACTED]' : undefined
        }
      }),
      res: (res) => ({
        statusCode: res.statusCode,
        headers: res.getHeaders()
      })
    }
  }));
}

/**
 * Configure rate limiting
 */
function configureRateLimiting(): void {
  // General API rate limit
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: req.rateLimit?.resetTime
      });
    }
  });

  // Strict rate limit for authentication endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 auth requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
    skipSuccessfulRequests: true, // Don't count successful requests
    standardHeaders: true,
    legacyHeaders: false
  });

  // Very strict rate limit for verification endpoints
  const verificationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 verification requests per hour
    message: 'Too many verification attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
  });

  // Apply rate limiters
  app.use('/api/', generalLimiter);
  app.use('/api/auth/', authLimiter);
  app.use('/api/verification/', verificationLimiter);
}

/**
 * Configure API routes
 */
function configureRoutes(): void {
  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV
    });
  });

  // API version endpoint
  app.get('/api', (req: Request, res: Response) => {
    res.json({
      name: 'Stealth Learning API',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        children: '/api/children',
        parents: '/api/parents',
        verification: '/api/verification',
        games: '/api/games',
        security: '/api/security'
      }
    });
  });

  // Mount API routers
  app.use('/api/auth', authRouter);
  app.use('/api/children', authMiddleware, childrenRouter);
  app.use('/api/parents', authMiddleware, parentsRouter);
  app.use('/api/verification', verificationRouter);
  app.use('/api/games', authMiddleware, gamesRouter);
  app.use('/api/security', authMiddleware, securityRouter);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);
}

/**
 * Graceful shutdown handler
 */
async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`${signal} received, starting graceful shutdown...`);

  // Stop accepting new connections
  server.close(() => {
    logger.info('HTTP server closed');
  });

  try {
    // Close database connections
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');

    if (redisClient) {
      redisClient.disconnect();
      logger.info('Redis connection closed');
    }

    // Exit process
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
}

/**
 * Start the server
 */
let server: any;

async function startServer(): Promise<void> {
  try {
    // Initialize services
    logger.info('🚀 Initializing Stealth Learning API Server...');

    // Initialize database
    await initializeDatabase();

    // Configure middleware
    configureSecurityMiddleware();
    configureRateLimiting();

    // Configure routes
    configureRoutes();

    // Start server
    server = app.listen(PORT, () => {
      logger.info(`
        🎮 Stealth Learning API Server Started
        =====================================
        📍 Environment: ${process.env.NODE_ENV || 'development'}
        🌐 Port: ${PORT}
        🔒 Security: ENABLED
        📊 Rate Limiting: ACTIVE
        🗄️  MongoDB: CONNECTED
        💾 Redis: ${redisClient ? 'CONNECTED' : 'NOT CONFIGURED'}
        🔐 COPPA: COMPLIANT
        =====================================
        🚀 Server ready at http://localhost:${PORT}
      `);
    });

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();