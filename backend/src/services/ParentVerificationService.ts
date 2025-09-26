/**
 * Parent Verification Service
 * COPPA-compliant parent verification with multiple verification methods
 */

import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { pino } from 'pino';
import Stripe from 'stripe';
import { UserModel, IUser, UserType, ConsentStatus, VerificationMethod } from '@database/schemas/UserSchema';
import { kmsService } from './KeyManagementService';
import { jwtAuthService } from '@auth/JWTAuthService';

const logger = pino({ name: 'ParentVerificationService' });

// Verification configuration
const VERIFICATION_TOKEN_EXPIRE = 24 * 60 * 60 * 1000; // 24 hours
const CONSENT_TOKEN_EXPIRE = 72 * 60 * 60 * 1000; // 72 hours
const VERIFICATION_ATTEMPTS_LIMIT = 5;
const VERIFICATION_CHARGE_AMOUNT = 50; // $0.50 in cents
const MIN_PARENT_AGE = 18;
const COPPA_AGE_THRESHOLD = 13;

// Email templates
const EMAIL_TEMPLATES = {
  PARENT_CONSENT: 'parent-consent',
  VERIFICATION_CODE: 'verification-code',
  CONSENT_GRANTED: 'consent-granted',
  CONSENT_DENIED: 'consent-denied',
  CHILD_ACCOUNT_CREATED: 'child-account-created',
  SUSPICIOUS_ACTIVITY: 'suspicious-activity'
};

// Verification status
export enum VerificationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired'
}

// Verification request interface
export interface VerificationRequest {
  requestId: string;
  childUserId: string;
  childName: string;
  childAge: number;
  parentEmail: string;
  parentName?: string;
  requestedAt: Date;
  method: VerificationMethod;
  status: VerificationStatus;
  token: string;
  tokenExpiry: Date;
  attempts: number;
  ipAddress: string;
  userAgent: string;
  verifiedAt?: Date;
  failureReason?: string;
}

// Consent request interface
export interface ConsentRequest {
  consentId: string;
  childUserId: string;
  parentUserId?: string;
  parentEmail: string;
  consentType: 'initial' | 'update' | 'renewal';
  dataTypes: string[];
  purpose: string;
  requestedAt: Date;
  status: ConsentStatus;
  token: string;
  tokenExpiry: Date;
  consentedAt?: Date;
  deniedAt?: Date;
  revokedAt?: Date;
  dataCollectionSettings?: {
    allowAnalytics: boolean;
    allowProgressTracking: boolean;
    allowAchievements: boolean;
    allowCommunication: boolean;
  };
}

export class ParentVerificationService {
  private static instance: ParentVerificationService;
  private emailTransporter?: nodemailer.Transporter;
  private stripeClient?: Stripe;
  private verificationRequests: Map<string, VerificationRequest> = new Map();
  private consentRequests: Map<string, ConsentRequest> = new Map();
  private verificationCodes: Map<string, { code: string; expiry: Date }> = new Map();

  private constructor() {
    this.initializeServices();
  }

  public static getInstance(): ParentVerificationService {
    if (!ParentVerificationService.instance) {
      ParentVerificationService.instance = new ParentVerificationService();
    }
    return ParentVerificationService.instance;
  }

  /**
   * Initialize external services
   */
  private async initializeServices(): Promise<void> {
    try {
      // Initialize email service
      if (process.env.SENDGRID_API_KEY) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        logger.info('SendGrid email service initialized');
      } else if (process.env.SMTP_HOST) {
        this.emailTransporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
        logger.info('SMTP email service initialized');
      } else {
        logger.warn('No email service configured - verification emails disabled');
      }

      // Initialize Stripe for credit card verification
      if (process.env.STRIPE_SECRET_KEY) {
        this.stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: '2023-10-16'
        });
        logger.info('Stripe payment service initialized');
      } else {
        logger.warn('Stripe not configured - credit card verification disabled');
      }

      // Start cleanup interval
      this.startCleanupInterval();
    } catch (error) {
      logger.error('Failed to initialize parent verification service:', error);
      throw error;
    }
  }

  /**
   * Initiate parent verification for a child account
   */
  public async initiateParentVerification(
    child: IUser,
    parentEmail: string,
    method: VerificationMethod,
    requestInfo: {
      ipAddress: string;
      userAgent: string;
    }
  ): Promise<VerificationRequest> {
    // Validate child age requires consent
    if (!this.requiresParentalConsent(child.profile.age || 0)) {
      throw new Error('Child does not require parental consent');
    }

    // Check for existing verification request
    const existingRequest = this.findExistingRequest(child.userId, parentEmail);
    if (existingRequest && existingRequest.status === VerificationStatus.PENDING) {
      if (existingRequest.attempts >= VERIFICATION_ATTEMPTS_LIMIT) {
        throw new Error('Verification attempt limit exceeded');
      }
      existingRequest.attempts++;
      return existingRequest;
    }

    // Create verification request
    const requestId = crypto.randomUUID();
    const token = await kmsService.generateSecureToken(32);

    const verificationRequest: VerificationRequest = {
      requestId,
      childUserId: child.userId,
      childName: child.profile.firstName,
      childAge: child.profile.age || 0,
      parentEmail,
      requestedAt: new Date(),
      method,
      status: VerificationStatus.PENDING,
      token,
      tokenExpiry: new Date(Date.now() + VERIFICATION_TOKEN_EXPIRE),
      attempts: 1,
      ipAddress: requestInfo.ipAddress,
      userAgent: requestInfo.userAgent
    };

    // Store request
    this.verificationRequests.set(requestId, verificationRequest);

    // Send verification based on method
    switch (method) {
      case VerificationMethod.EMAIL:
        await this.sendEmailVerification(verificationRequest);
        break;
      case VerificationMethod.CREDIT_CARD:
        await this.initiateCreditCardVerification(verificationRequest);
        break;
      case VerificationMethod.PHONE_SMS:
        await this.sendSMSVerification(verificationRequest);
        break;
      case VerificationMethod.GOVERNMENT_ID:
        await this.initiateGovernmentIDVerification(verificationRequest);
        break;
      case VerificationMethod.VIDEO_CALL:
        await this.scheduleVideoVerification(verificationRequest);
        break;
    }

    // Update child record
    child.coppa.verificationToken = token;
    await child.save();

    logger.info(`Parent verification initiated for child ${child.userId} via ${method}`);

    return verificationRequest;
  }

  /**
   * Send email verification to parent
   */
  private async sendEmailVerification(request: VerificationRequest): Promise<void> {
    const verificationUrl = `${process.env.APP_URL}/verify-parent?token=${request.token}&request=${request.requestId}`;

    const emailContent = {
      to: request.parentEmail,
      from: process.env.FROM_EMAIL || 'noreply@stealth-learning.app',
      subject: 'Parent Consent Required - Stealth Learning',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .info-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎮 Parent Consent Required</h1>
              <p>Your child wants to join Stealth Learning</p>
            </div>
            <div class="content">
              <h2>Hello,</h2>
              <p>We received a request to create a Stealth Learning account for:</p>

              <div class="info-box">
                <strong>Child's Name:</strong> ${request.childName}<br>
                <strong>Age:</strong> ${request.childAge} years old<br>
                <strong>Request Date:</strong> ${request.requestedAt.toLocaleDateString()}
              </div>

              <div class="warning">
                <strong>⚠️ Important:</strong> Under COPPA (Children's Online Privacy Protection Act),
                we require parental consent before collecting any information from children under 13.
              </div>

              <h3>What We Collect:</h3>
              <ul>
                <li>First name only (no last name)</li>
                <li>Age (for age-appropriate content)</li>
                <li>Learning progress and game scores</li>
                <li>Achievement data</li>
              </ul>

              <h3>What We DON'T Collect:</h3>
              <ul>
                <li>❌ Email addresses from children</li>
                <li>❌ Phone numbers or addresses</li>
                <li>❌ Photos or videos</li>
                <li>❌ Location data</li>
                <li>❌ Third-party tracking or advertising data</li>
              </ul>

              <h3>Your Rights as a Parent:</h3>
              <ul>
                <li>✅ Review all data we collect about your child</li>
                <li>✅ Request deletion of your child's data at any time</li>
                <li>✅ Control what features your child can access</li>
                <li>✅ Set time limits and restrictions</li>
                <li>✅ Monitor your child's progress and activity</li>
              </ul>

              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify & Grant Consent</a>
              </div>

              <p><strong>This link expires in 24 hours for security.</strong></p>

              <h3>Need to Verify a Different Way?</h3>
              <p>We offer multiple verification methods for your convenience:</p>
              <ul>
                <li>Credit card verification ($0.50 charge, immediately refunded)</li>
                <li>Government ID upload (securely processed and deleted)</li>
                <li>Phone/SMS verification</li>
              </ul>

              <p>If you did NOT expect this email or don't recognize this request,
              please ignore it and the request will expire automatically.</p>

              <div class="footer">
                <p>This email was sent to ${request.parentEmail}</p>
                <p>Stealth Learning - Educational Games for Kids</p>
                <p>© ${new Date().getFullYear()} Stealth Learning. All rights reserved.</p>
                <p>
                  <a href="${process.env.APP_URL}/privacy">Privacy Policy</a> |
                  <a href="${process.env.APP_URL}/coppa">COPPA Information</a> |
                  <a href="${process.env.APP_URL}/contact">Contact Us</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Parent Consent Required - Stealth Learning

        Hello,

        We received a request to create a Stealth Learning account for:
        Child's Name: ${request.childName}
        Age: ${request.childAge} years old

        Under COPPA, we require your consent before your child can use our service.

        Please click the following link to verify and grant consent:
        ${verificationUrl}

        This link expires in 24 hours.

        If you did not expect this email, please ignore it.

        Stealth Learning - Educational Games for Kids
      `
    };

    // Send email using configured service
    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send(emailContent);
    } else if (this.emailTransporter) {
      await this.emailTransporter.sendMail(emailContent);
    } else {
      logger.warn('Email service not configured, skipping email send');
    }

    logger.info(`Verification email sent to ${request.parentEmail}`);
  }

  /**
   * Initiate credit card verification
   */
  private async initiateCreditCardVerification(request: VerificationRequest): Promise<{
    clientSecret: string;
    amount: number;
  }> {
    if (!this.stripeClient) {
      throw new Error('Credit card verification not available');
    }

    // Create payment intent for $0.50
    const paymentIntent = await this.stripeClient.paymentIntents.create({
      amount: VERIFICATION_CHARGE_AMOUNT,
      currency: 'usd',
      description: 'Parent verification for COPPA compliance',
      metadata: {
        requestId: request.requestId,
        childUserId: request.childUserId,
        parentEmail: request.parentEmail,
        verificationType: 'parent_consent'
      },
      automatic_payment_methods: {
        enabled: true
      }
    });

    // Schedule automatic refund after verification
    setTimeout(async () => {
      try {
        if (paymentIntent.status === 'succeeded') {
          await this.stripeClient!.refunds.create({
            payment_intent: paymentIntent.id,
            reason: 'requested_by_customer'
          });
          logger.info(`Refunded verification charge for request ${request.requestId}`);
        }
      } catch (error) {
        logger.error('Failed to refund verification charge:', error);
      }
    }, 5 * 60 * 1000); // Refund after 5 minutes

    return {
      clientSecret: paymentIntent.client_secret!,
      amount: VERIFICATION_CHARGE_AMOUNT
    };
  }

  /**
   * Send SMS verification
   */
  private async sendSMSVerification(request: VerificationRequest): Promise<void> {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store code with expiry
    this.verificationCodes.set(request.requestId, {
      code,
      expiry: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send SMS (using Twilio or similar service)
    // Implementation would depend on SMS provider
    logger.info(`SMS verification code generated for request ${request.requestId}`);
  }

  /**
   * Initiate government ID verification
   */
  private async initiateGovernmentIDVerification(request: VerificationRequest): Promise<{
    uploadUrl: string;
    sessionId: string;
  }> {
    // Generate secure upload URL
    const sessionId = crypto.randomUUID();
    const uploadToken = await kmsService.generateSecureToken();

    const uploadUrl = `${process.env.APP_URL}/upload-id?session=${sessionId}&token=${uploadToken}`;

    // Store session for later verification
    // In production, integrate with ID verification service like Jumio or Onfido

    return {
      uploadUrl,
      sessionId
    };
  }

  /**
   * Schedule video verification call
   */
  private async scheduleVideoVerification(request: VerificationRequest): Promise<{
    meetingUrl: string;
    scheduledTime: Date;
  }> {
    // In production, integrate with video call service like Zoom or Whereby
    const meetingId = crypto.randomUUID();
    const scheduledTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // Next day

    const meetingUrl = `${process.env.APP_URL}/video-verify?meeting=${meetingId}`;

    return {
      meetingUrl,
      scheduledTime
    };
  }

  /**
   * Complete parent verification
   */
  public async completeVerification(
    token: string,
    requestId: string,
    verificationData?: any
  ): Promise<{
    success: boolean;
    parentUserId?: string;
    message: string;
  }> {
    const request = this.verificationRequests.get(requestId);
    if (!request) {
      return {
        success: false,
        message: 'Verification request not found'
      };
    }

    // Check token validity
    if (request.token !== token) {
      request.attempts++;
      return {
        success: false,
        message: 'Invalid verification token'
      };
    }

    // Check expiry
    if (request.tokenExpiry < new Date()) {
      request.status = VerificationStatus.EXPIRED;
      return {
        success: false,
        message: 'Verification token has expired'
      };
    }

    // Process verification based on method
    let verificationSuccess = false;
    let parentUserId: string | undefined;

    switch (request.method) {
      case VerificationMethod.EMAIL:
        // Email click is verification
        verificationSuccess = true;
        break;

      case VerificationMethod.CREDIT_CARD:
        // Check Stripe payment status
        if (verificationData?.paymentIntentId) {
          const paymentIntent = await this.stripeClient!.paymentIntents.retrieve(
            verificationData.paymentIntentId
          );
          verificationSuccess = paymentIntent.status === 'succeeded';
        }
        break;

      case VerificationMethod.PHONE_SMS:
        // Verify SMS code
        const storedCode = this.verificationCodes.get(requestId);
        if (storedCode && storedCode.code === verificationData?.code) {
          if (storedCode.expiry > new Date()) {
            verificationSuccess = true;
          }
        }
        break;

      case VerificationMethod.GOVERNMENT_ID:
        // Check ID verification status (would integrate with ID verification service)
        verificationSuccess = verificationData?.idVerified === true;
        break;

      case VerificationMethod.VIDEO_CALL:
        // Check video verification completion
        verificationSuccess = verificationData?.videoVerified === true;
        break;
    }

    if (!verificationSuccess) {
      request.status = VerificationStatus.FAILED;
      request.failureReason = 'Verification failed';
      return {
        success: false,
        message: 'Verification failed. Please try again.'
      };
    }

    // Create or find parent account
    let parent = await UserModel.findOne({ email: request.parentEmail });
    if (!parent) {
      // Create parent account
      parent = new UserModel({
        userId: crypto.randomUUID(),
        userType: UserType.PARENT,
        email: request.parentEmail,
        username: `parent_${crypto.randomBytes(4).toString('hex')}`,
        profile: {
          firstName: request.parentName || 'Parent',
          preferredLanguage: 'en',
          timezone: 'UTC'
        },
        coppa: {
          requiresConsent: false,
          parentVerified: true,
          verificationDate: new Date(),
          verificationMethod: request.method
        },
        security: {
          emailVerified: true,
          emailVerifiedAt: new Date()
        }
      });
      await parent.save();
    }

    parentUserId = parent.userId;

    // Update child account
    const child = await UserModel.findOne({ userId: request.childUserId });
    if (child) {
      child.parentId = parentUserId;
      child.coppa.parentVerified = true;
      child.coppa.verificationDate = new Date();
      child.coppa.verificationMethod = request.method;
      child.coppa.consentStatus = ConsentStatus.GRANTED;
      child.coppa.consentDate = new Date();
      await child.save();

      // Add child to parent's children list
      if (!parent.childrenIds) {
        parent.childrenIds = [];
      }
      if (!parent.childrenIds.includes(child.userId)) {
        parent.childrenIds.push(child.userId);
        await parent.save();
      }
    }

    // Update request status
    request.status = VerificationStatus.COMPLETED;
    request.verifiedAt = new Date();

    // Send confirmation email
    await this.sendVerificationConfirmation(request, parent);

    logger.info(`Parent verification completed for child ${request.childUserId}`);

    return {
      success: true,
      parentUserId,
      message: 'Parent verification completed successfully'
    };
  }

  /**
   * Send verification confirmation email
   */
  private async sendVerificationConfirmation(
    request: VerificationRequest,
    parent: IUser
  ): Promise<void> {
    const dashboardUrl = `${process.env.APP_URL}/parent-dashboard`;

    const emailContent = {
      to: request.parentEmail,
      from: process.env.FROM_EMAIL || 'noreply@stealth-learning.app',
      subject: 'Parent Verification Complete - Stealth Learning',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4CAF50; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .success-box { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Verification Complete!</h1>
              <p>You're all set as a verified parent</p>
            </div>
            <div class="content">
              <div class="success-box">
                <strong>Success!</strong> You have been verified as the parent/guardian of ${request.childName}.
              </div>

              <h3>What's Next?</h3>
              <ul>
                <li>${request.childName} can now safely use Stealth Learning</li>
                <li>You have full access to the Parent Dashboard</li>
                <li>You can monitor progress and set restrictions</li>
                <li>You'll receive weekly progress reports</li>
              </ul>

              <div style="text-align: center;">
                <a href="${dashboardUrl}" class="button">Go to Parent Dashboard</a>
              </div>

              <h3>Your Parent Account:</h3>
              <p>Username: ${parent.username}</p>
              <p>Email: ${parent.email}</p>
              <p>
                <small>You can set a password by clicking "Set Password" in the dashboard.</small>
              </p>

              <h3>Privacy & Safety:</h3>
              <p>We take your child's privacy seriously:</p>
              <ul>
                <li>No ads or third-party tracking</li>
                <li>Data encrypted and secure</li>
                <li>COPPA compliant</li>
                <li>You can delete data anytime</li>
              </ul>
            </div>
          </div>
        </body>
        </html>
      `
    };

    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send(emailContent);
    } else if (this.emailTransporter) {
      await this.emailTransporter.sendMail(emailContent);
    }
  }

  /**
   * Request consent for specific data collection
   */
  public async requestConsent(
    childUserId: string,
    parentEmail: string,
    dataTypes: string[],
    purpose: string
  ): Promise<ConsentRequest> {
    const consentId = crypto.randomUUID();
    const token = await kmsService.generateSecureToken();

    const consentRequest: ConsentRequest = {
      consentId,
      childUserId,
      parentEmail,
      consentType: 'initial',
      dataTypes,
      purpose,
      requestedAt: new Date(),
      status: ConsentStatus.PENDING,
      token,
      tokenExpiry: new Date(Date.now() + CONSENT_TOKEN_EXPIRE)
    };

    this.consentRequests.set(consentId, consentRequest);

    // Send consent request email
    await this.sendConsentRequestEmail(consentRequest);

    return consentRequest;
  }

  /**
   * Send consent request email
   */
  private async sendConsentRequestEmail(request: ConsentRequest): Promise<void> {
    const consentUrl = `${process.env.APP_URL}/consent?token=${request.token}&id=${request.consentId}`;

    const emailContent = {
      to: request.parentEmail,
      from: process.env.FROM_EMAIL || 'noreply@stealth-learning.app',
      subject: 'Data Collection Consent Request - Stealth Learning',
      html: `
        <h2>Consent Request</h2>
        <p>We're requesting your consent to collect the following data:</p>
        <ul>${request.dataTypes.map(type => `<li>${type}</li>`).join('')}</ul>
        <p>Purpose: ${request.purpose}</p>
        <a href="${consentUrl}">Review and Respond</a>
      `
    };

    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send(emailContent);
    } else if (this.emailTransporter) {
      await this.emailTransporter.sendMail(emailContent);
    }
  }

  /**
   * Revoke consent
   */
  public async revokeConsent(childUserId: string, parentUserId: string): Promise<void> {
    const child = await UserModel.findOne({ userId: childUserId });
    if (!child) {
      throw new Error('Child account not found');
    }

    // Verify parent relationship
    if (child.parentId !== parentUserId) {
      throw new Error('Unauthorized: Not the parent of this child');
    }

    // Update consent status
    child.coppa.consentStatus = ConsentStatus.REVOKED;
    child.coppa.dataCollectionSettings = {
      allowAnalytics: false,
      allowProgressTracking: false,
      allowAchievements: false,
      allowCommunication: false
    };

    await child.save();

    // Anonymize collected data
    await child.anonymizeData();

    logger.info(`Consent revoked for child ${childUserId} by parent ${parentUserId}`);
  }

  /**
   * Check if child requires parental consent
   */
  private requiresParentalConsent(age: number): boolean {
    return age < COPPA_AGE_THRESHOLD;
  }

  /**
   * Find existing verification request
   */
  private findExistingRequest(childUserId: string, parentEmail: string): VerificationRequest | undefined {
    for (const request of this.verificationRequests.values()) {
      if (request.childUserId === childUserId && request.parentEmail === parentEmail) {
        return request;
      }
    }
    return undefined;
  }

  /**
   * Start cleanup interval for expired requests
   */
  private startCleanupInterval(): void {
    setInterval(() => {
      const now = new Date();

      // Clean expired verification requests
      for (const [id, request] of this.verificationRequests.entries()) {
        if (request.tokenExpiry < now) {
          this.verificationRequests.delete(id);
        }
      }

      // Clean expired consent requests
      for (const [id, request] of this.consentRequests.entries()) {
        if (request.tokenExpiry < now) {
          this.consentRequests.delete(id);
        }
      }

      // Clean expired verification codes
      for (const [id, code] of this.verificationCodes.entries()) {
        if (code.expiry < now) {
          this.verificationCodes.delete(id);
        }
      }
    }, 60 * 60 * 1000); // Every hour
  }

  /**
   * Get parent dashboard data
   */
  public async getParentDashboardData(parentUserId: string): Promise<{
    children: Array<{
      userId: string;
      name: string;
      age: number;
      lastActive: Date;
      totalPlayTime: number;
      consentStatus: ConsentStatus;
    }>;
    settings: any;
    reports: any[];
  }> {
    const parent = await UserModel.findOne({ userId: parentUserId });
    if (!parent || parent.userType !== UserType.PARENT) {
      throw new Error('Parent account not found');
    }

    const children = await UserModel.find({
      userId: { $in: parent.childrenIds }
    });

    return {
      children: children.map(child => ({
        userId: child.userId,
        name: child.profile.firstName,
        age: child.profile.age || 0,
        lastActive: child.activity.lastActivity || child.activity.lastLogin || new Date(),
        totalPlayTime: child.activity.totalPlayTime,
        consentStatus: child.coppa.consentStatus
      })),
      settings: {}, // Parent-specific settings
      reports: [] // Weekly/monthly reports
    };
  }
}

// Export singleton instance
export const parentVerificationService = ParentVerificationService.getInstance();