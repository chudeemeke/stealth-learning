/**
 * Authentication Service
 * Handles real parent authentication with validation
 */

export interface ParentCredentials {
  email: string;
  password: string;
}

export interface ParentSignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// Simulated user database (in real app, this would be backend API calls)
const MOCK_USERS: Array<{
  id: string;
  name: string;
  email: string;
  password: string;
}> = [
  {
    id: 'parent-1',
    name: 'Demo Parent',
    email: 'parent@demo.com',
    password: 'demo123',
  },
  {
    id: 'parent-2',
    name: 'Test Parent',
    email: 'test@parent.com',
    password: 'test123',
  },
];

export class AuthService {
  /**
   * Validate email format
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): { valid: boolean; message: string } {
    if (password.length < 6) {
      return { valid: false, message: 'Password must be at least 6 characters long' };
    }
    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
      return { valid: false, message: 'Password must contain both letters and numbers' };
    }
    return { valid: true, message: 'Password is valid' };
  }

  /**
   * Parent Sign In with real validation
   */
  static async signIn(credentials: ParentCredentials): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validate email format
    if (!this.validateEmail(credentials.email)) {
      return {
        success: false,
        message: 'Please enter a valid email address',
      };
    }

    // Validate password
    if (!credentials.password || credentials.password.length < 3) {
      return {
        success: false,
        message: 'Password is required',
      };
    }

    // Check if user exists with correct credentials
    const user = MOCK_USERS.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    return {
      success: true,
      message: 'Successfully signed in',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  /**
   * Parent Sign Up with validation
   */
  static async signUp(signupData: ParentSignupData): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Validate name
    if (!signupData.name || signupData.name.trim().length < 2) {
      return {
        success: false,
        message: 'Name must be at least 2 characters long',
      };
    }

    // Validate email
    if (!this.validateEmail(signupData.email)) {
      return {
        success: false,
        message: 'Please enter a valid email address',
      };
    }

    // Check if email already exists
    const existingUser = MOCK_USERS.find(u => u.email === signupData.email);
    if (existingUser) {
      return {
        success: false,
        message: 'An account with this email already exists',
      };
    }

    // Validate password
    const passwordValidation = this.validatePassword(signupData.password);
    if (!passwordValidation.valid) {
      return {
        success: false,
        message: passwordValidation.message,
      };
    }

    // Validate password confirmation
    if (signupData.password !== signupData.confirmPassword) {
      return {
        success: false,
        message: 'Passwords do not match',
      };
    }

    // Create new user
    const newUser = {
      id: `parent-${Date.now()}`,
      name: signupData.name.trim(),
      email: signupData.email.toLowerCase(),
      password: signupData.password,
    };

    // Add to mock database
    MOCK_USERS.push(newUser);

    return {
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    };
  }

  /**
   * Get demo credentials for testing
   */
  static getDemoCredentials(): ParentCredentials {
    return {
      email: 'parent@demo.com',
      password: 'demo123',
    };
  }
}