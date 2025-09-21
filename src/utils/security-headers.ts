/**
 * Security Headers and Content Security Policy Implementation
 * Ultra-secure headers for child data protection
 */

import { securityConfig, getCSPDirectives } from '@/config/security';

interface SecurityHeaders {
  'Content-Security-Policy': string;
  'X-Content-Type-Options': string;
  'X-Frame-Options': string;
  'X-XSS-Protection': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'Strict-Transport-Security': string;
  'Cache-Control': string;
}

class SecurityHeadersService {
  private static instance: SecurityHeadersService;

  constructor() {
    this.initializeSecurityHeaders();
  }

  static getInstance(): SecurityHeadersService {
    if (!SecurityHeadersService.instance) {
      SecurityHeadersService.instance = new SecurityHeadersService();
    }
    return SecurityHeadersService.instance;
  }

  /**
   * Initialize security headers on app startup
   */
  private initializeSecurityHeaders(): void {
    try {
      // Apply CSP via meta tag if enabled
      if (securityConfig.CSP_ENABLED) {
        this.applyCSSSecurityPolicy();
      }

      // Set other security headers via HTTP (would normally be done server-side)
      this.setSecurityHeaders();

      console.log('✅ Security headers initialized');
    } catch (error) {
      console.error('🔒 Security headers initialization failed:', error);
    }
  }

  /**
   * Apply Content Security Policy
   */
  private applyCSSSecurityPolicy(): void {
    try {
      const cspDirectives = getCSPDirectives();

      if (!cspDirectives) {
        console.warn('🔒 CSP disabled in configuration');
        return;
      }

      // Try to set via meta tag (limited effectiveness, server-side preferred)
      let cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');

      if (!cspMeta) {
        cspMeta = document.createElement('meta');
        cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
        document.head.appendChild(cspMeta);
      }

      cspMeta.setAttribute('content', cspDirectives);

      console.log('✅ Content Security Policy applied');
      console.log('🔒 CSP Directives:', cspDirectives);

    } catch (error) {
      console.error('🔒 Failed to apply CSP:', error);
    }
  }

  /**
   * Set additional security headers (client-side simulation)
   * Note: These should be set server-side in production
   */
  private setSecurityHeaders(): void {
    try {
      const headers: SecurityHeaders = {
        'Content-Security-Policy': getCSPDirectives(),
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': this.getPermissionsPolicy(),
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private'
      };

      // Store headers for API requests
      this.storeSecurityHeaders(headers);

      console.log('✅ Security headers configured');

    } catch (error) {
      console.error('🔒 Failed to set security headers:', error);
    }
  }

  /**
   * Get permissions policy for child protection
   */
  private getPermissionsPolicy(): string {
    const policies = [
      'camera=(),', // Block camera access
      'microphone=(),', // Block microphone access
      'geolocation=(),', // Block location access
      'payment=(),', // Block payment APIs
      'usb=(),', // Block USB access
      'bluetooth=(),', // Block Bluetooth access
      'magnetometer=(),', // Block magnetometer
      'gyroscope=(),', // Block gyroscope
      'accelerometer=(),', // Block accelerometer
      'ambient-light-sensor=(),', // Block ambient light sensor
      'autoplay=()', // Block autoplay
    ];

    return policies.join(' ');
  }

  /**
   * Store security headers for API requests
   */
  private storeSecurityHeaders(headers: SecurityHeaders): void {
    try {
      // Store in sessionStorage for use by API interceptors
      sessionStorage.setItem('security_headers', JSON.stringify(headers));
    } catch (error) {
      console.error('🔒 Failed to store security headers:', error);
    }
  }

  /**
   * Get stored security headers for API requests
   */
  getSecurityHeaders(): SecurityHeaders | null {
    try {
      const stored = sessionStorage.getItem('security_headers');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('🔒 Failed to retrieve security headers:', error);
      return null;
    }
  }

  /**
   * Validate current page security compliance
   */
  validatePageSecurity(): { isSecure: boolean; violations: string[] } {
    const violations: string[] = [];

    try {
      // Check HTTPS in production
      if (securityConfig.APP_ENVIRONMENT === 'production' && window.location.protocol !== 'https:') {
        violations.push('Page not served over HTTPS in production');
      }

      // Check for inline scripts (CSP violation)
      const inlineScripts = document.querySelectorAll('script:not([src])');
      if (inlineScripts.length > 0) {
        violations.push(`Found ${inlineScripts.length} inline scripts (CSP violation)`);
      }

      // Check for inline styles (CSP violation)
      const inlineStyles = document.querySelectorAll('[style]');
      if (inlineStyles.length > 5) { // Allow some for dynamic styling
        violations.push(`Excessive inline styles found: ${inlineStyles.length}`);
      }

      // Check for mixed content
      const mixedContent = document.querySelectorAll('img[src^="http:"], link[href^="http:"], script[src^="http:"]');
      if (mixedContent.length > 0 && window.location.protocol === 'https:') {
        violations.push(`Mixed content detected: ${mixedContent.length} insecure resources`);
      }

      // Check for external resources from untrusted domains
      const externalResources = document.querySelectorAll('script[src], link[href], img[src]');
      const trustedDomains = [window.location.hostname, 'localhost', '127.0.0.1'];

      externalResources.forEach(resource => {
        const src = resource.getAttribute('src') || resource.getAttribute('href');
        if (src && src.startsWith('http')) {
          try {
            const url = new URL(src);
            if (!trustedDomains.includes(url.hostname)) {
              violations.push(`Untrusted external resource: ${url.hostname}`);
            }
          } catch {
            violations.push(`Invalid resource URL: ${src}`);
          }
        }
      });

      return {
        isSecure: violations.length === 0,
        violations
      };

    } catch (error) {
      console.error('🔒 Security validation failed:', error);
      return {
        isSecure: false,
        violations: ['Security validation error']
      };
    }
  }

  /**
   * Monitor for CSP violations
   */
  setupCSPViolationReporting(): void {
    try {
      document.addEventListener('securitypolicyviolation', (event) => {
        console.error('🔒 CSP Violation detected:', {
          directive: event.violatedDirective,
          blockedURI: event.blockedURI,
          lineNumber: event.lineNumber,
          sourceFile: event.sourceFile
        });

        // In production, send to security monitoring service
        if (securityConfig.APP_ENVIRONMENT === 'production') {
          this.reportSecurityViolation({
            type: 'csp_violation',
            directive: event.violatedDirective,
            blockedURI: event.blockedURI,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          });
        }
      });

      console.log('✅ CSP violation reporting enabled');

    } catch (error) {
      console.error('🔒 Failed to setup CSP violation reporting:', error);
    }
  }

  /**
   * Report security violations to monitoring service
   */
  private reportSecurityViolation(violation: {
    type: string;
    directive: string;
    blockedURI: string;
    userAgent: string;
    timestamp: string;
  }): void {
    try {
      // In production, send to security monitoring service
      console.log('🔒 Security violation reported:', violation);

      // Store locally for batch reporting
      const violations = JSON.parse(localStorage.getItem('security_violations') || '[]');
      violations.push(violation);

      // Keep only last 100 violations
      if (violations.length > 100) {
        violations.splice(0, violations.length - 100);
      }

      localStorage.setItem('security_violations', JSON.stringify(violations));

    } catch (error) {
      console.error('🔒 Failed to report security violation:', error);
    }
  }

  /**
   * Get security violation reports
   */
  getSecurityViolations(): any[] {
    try {
      return JSON.parse(localStorage.getItem('security_violations') || '[]');
    } catch (error) {
      console.error('🔒 Failed to retrieve security violations:', error);
      return [];
    }
  }

  /**
   * Clear security violation reports
   */
  clearSecurityViolations(): void {
    try {
      localStorage.removeItem('security_violations');
      console.log('✅ Security violations cleared');
    } catch (error) {
      console.error('🔒 Failed to clear security violations:', error);
    }
  }
}

// Export singleton instance
export const securityHeaders = SecurityHeadersService.getInstance();
export default SecurityHeadersService;