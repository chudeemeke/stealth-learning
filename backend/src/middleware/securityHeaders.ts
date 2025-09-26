/**
 * Security Headers Middleware
 * Adds additional security headers beyond Helmet defaults
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * Generate nonce for CSP
 */
function generateNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}

/**
 * Security headers middleware
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction): void {
  // Generate CSP nonce for this request
  const nonce = generateNonce();
  res.locals.cspNonce = nonce;

  // Additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );

  // HSTS for production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Remove fingerprinting headers
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');

  // Cache control for sensitive endpoints
  if (req.path.includes('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  // CORS headers for API
  if (req.path.includes('/api/')) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');
  }

  // Security headers for child protection (COPPA)
  res.setHeader('X-Child-Protection', 'enabled');
  res.setHeader('X-COPPA-Compliant', 'true');
  res.setHeader('X-No-Tracking', 'true');
  res.setHeader('X-No-Analytics', 'true');

  next();
}

/**
 * CSRF token middleware
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  // Skip CSRF for certain methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    next();
    return;
  }

  // Get CSRF token from header
  const csrfToken = req.headers['x-csrf-token'];

  // For now, we'll implement a simple check
  // In production, use a proper CSRF library
  if (!csrfToken) {
    res.status(403).json({
      error: 'Forbidden',
      message: 'CSRF token required'
    });
    return;
  }

  // Validate CSRF token (implement proper validation)
  // This is a placeholder - use express-csrf or similar in production
  next();
}

/**
 * Clickjacking protection
 */
export function clickjackingProtection(req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
  next();
}

/**
 * API version header
 */
export function apiVersionHeader(req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-API-Version', '1.0.0');
  res.setHeader('X-API-Environment', process.env.NODE_ENV || 'development');
  next();
}