# Setup Guide - Stealth Learning Platform

## System Requirements

### Minimum Requirements
- **Node.js**: 18.0 or higher
- **RAM**: 4GB available
- **Storage**: 2GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)

### Recommended Requirements
- **Node.js**: 20.0 LTS
- **RAM**: 8GB available
- **Storage**: 5GB free space
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## Installation

### Step 1: Install Node.js
Download and install Node.js from [nodejs.org](https://nodejs.org/)

Verify installation:
```bash
node --version  # Should be 18.0+
npm --version   # Should be included with Node.js
```

### Step 2: Install pnpm (Required)
This project uses pnpm exclusively. Do not use npm or yarn.

```bash
npm install -g pnpm
```

Verify pnpm installation:
```bash
pnpm --version  # Should be 8.0+
```

### Step 3: Clone Repository
```bash
git clone <repository-url>
cd stealth-learning
```

### Step 4: Install Dependencies
```bash
pnpm install
```

This will install all project dependencies including:
- React 18 and related packages
- TypeScript and build tools
- Testing frameworks
- Development utilities

### Step 5: Environment Setup
Copy the environment template:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```bash
# Database Configuration
VITE_DB_NAME=stealth_learning_db
VITE_DB_VERSION=1

# Feature Flags
VITE_ENABLE_VOICE_RECOGNITION=true
VITE_ENABLE_DRAWING_CANVAS=true
VITE_ENABLE_ANALYTICS=true

# Development
VITE_NODE_ENV=development
VITE_ENABLE_DEV_TOOLS=true
```

### Step 6: Start Development Server
```bash
pnpm dev
```

The application will be available at:
- **Main App**: http://localhost:3000
- **Storybook**: Run `pnpm storybook` for http://localhost:6006

## Verification

### Basic Functionality Test
1. Open http://localhost:3000
2. You should see the welcome screen
3. Click on age group selection (3-5, 6-8, or 9+)
4. Verify touch targets adapt to age group
5. Navigate to games section
6. Confirm offline functionality works

### Development Tools Test
```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Unit tests
pnpm test

# Build test
pnpm build
```

All commands should complete without errors.

## Configuration

### Age Group Settings
The platform automatically adapts to different age groups. Default configurations:

#### Ages 3-5
- Touch targets: 64px minimum
- Animation speed: Slower (0.8s)
- Colors: Bright, high contrast
- Text: Large, simple fonts

#### Ages 6-8
- Touch targets: 48px minimum
- Animation speed: Medium (0.5s)
- Colors: Balanced palette
- Text: Medium sized fonts

#### Ages 9+
- Touch targets: 44px minimum
- Animation speed: Fast (0.3s)
- Colors: Sophisticated palette
- Text: Standard sized fonts

### Database Configuration
The application uses IndexedDB for offline storage:

```typescript
// Database configuration in src/services/database/
{
  name: 'stealth_learning_db',
  version: 1,
  encryption: true,
  autoSync: true,
  retention: {
    sessions: '90 days',
    performance: '1 year',
    achievements: 'permanent'
  }
}
```

### Performance Settings
Optimal performance configurations:

```typescript
// Performance budgets
{
  bundleSize: '2MB',
  firstContentfulPaint: '1.8s',
  timeToInteractive: '3.0s',
  memoryUsage: '100MB'
}
```

## Development Setup

### VSCode Configuration
Recommended VSCode extensions:
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "ms-playwright.playwright"
  ]
}
```

VSCode settings for optimal development:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "'([^']*)'"]
  ]
}
```

### Git Hooks Setup
Pre-commit hooks are automatically installed with dependencies:
```bash
# Manually run pre-commit checks
pnpm lint-staged
```

### Testing Environment
Set up testing environment:
```bash
# Install Playwright browsers
npx playwright install

# Run initial test suite
pnpm test
pnpm test:e2e
```

## Advanced Configuration

### Custom Age Group Themes
Create custom themes for specific needs:

```typescript
// In src/styles/age-themes.ts
export const customAgeTheme = {
  '3-5': {
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#45B7D1'
    },
    fonts: {
      size: 'xl',
      weight: 'bold'
    }
  }
  // ... other age groups
};
```

### Database Encryption
Configure custom encryption settings:
```typescript
// In .env.local
VITE_ENCRYPTION_KEY=your_custom_encryption_key
VITE_ENCRYPTION_ALGORITHM=AES-256-GCM
```

### Analytics Configuration
Set up learning analytics:
```typescript
// In src/services/analytics/config.ts
export const analyticsConfig = {
  enabled: true,
  privacy: 'coppa-compliant',
  retention: {
    anonymizedData: '2 years',
    personalData: '30 days'
  },
  metrics: [
    'learning_progress',
    'engagement_time',
    'skill_mastery',
    'error_patterns'
  ]
};
```

## Troubleshooting

### Common Installation Issues

#### Node.js Version Issues
```bash
# Check current version
node --version

# Use nvm to manage Node.js versions (if needed)
nvm install 20
nvm use 20
```

#### pnpm Installation Issues
```bash
# Alternative pnpm installation methods
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Or using npm
npm install -g @pnpm/exe
```

#### Dependency Installation Issues
```bash
# Clear cache and reinstall
pnpm store prune
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Development Server Issues

#### Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000
kill -9 <PID>

# Or use different port
pnpm dev -- --port 3001
```

#### TypeScript Errors
```bash
# Restart TypeScript server in VSCode
Ctrl+Shift+P > TypeScript: Restart TS Server

# Or clear TypeScript cache
rm -rf node_modules/.cache
pnpm install
```

#### Build Failures
```bash
# Clean build cache
rm -rf dist .vite
pnpm build

# Check specific error details
pnpm build -- --debug
```

### Database Issues

#### IndexedDB Quota Exceeded
```javascript
// Clear browser storage
// Chrome: DevTools > Application > Storage > Clear storage
// Firefox: DevTools > Storage > Clear All

// Or programmatically
if ('storage' in navigator && 'estimate' in navigator.storage) {
  navigator.storage.estimate().then(estimate => {
    console.log('Storage usage:', estimate);
  });
}
```

#### Database Migration Issues
```typescript
// Reset database schema
await db.delete();
await db.open();
```

### Performance Issues

#### Slow Development Server
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm dev
```

#### Large Bundle Size
```bash
# Analyze bundle
pnpm build
npx vite-bundle-analyzer dist

# Identify large dependencies
npx bundlephobia <package-name>
```

## Platform-Specific Setup

### Windows
```bash
# Enable long path support (Administrator)
git config --system core.longpaths true

# If using WSL2
wsl --install
```

### macOS
```bash
# Install Xcode Command Line Tools
xcode-select --install

# If using Homebrew
brew install node pnpm
```

### Linux (Ubuntu)
```bash
# Update package manager
sudo apt update

# Install Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm
```

## Security Setup

### HTTPS in Development
```bash
# Generate local certificates
mkdir -p .certs
mkcert -install
mkcert -key-file .certs/key.pem -cert-file .certs/cert.pem localhost

# Start with HTTPS
pnpm dev -- --https --cert .certs/cert.pem --key .certs/key.pem
```

### Content Security Policy
Development CSP configuration in `index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  connect-src 'self' ws: wss:;
">
```

## Success Checklist

After setup, verify these items work:

- [ ] Development server starts without errors
- [ ] TypeScript compilation passes
- [ ] Unit tests run successfully
- [ ] Storybook displays component library
- [ ] Age group adaptation works correctly
- [ ] Offline functionality operates
- [ ] Database operations complete
- [ ] Build process succeeds
- [ ] Performance meets targets
- [ ] Security measures active

## Next Steps

1. **Read the [Developer Guide](./DEVELOPER_GUIDE.md)** for development workflows
2. **Review the [API Documentation](./API.md)** for service interfaces
3. **Explore the [Component Library](http://localhost:6006)** via Storybook
4. **Run the test suite** to understand test patterns
5. **Examine sample games** in the games directory

## Support

If you encounter issues not covered in this guide:

1. Check the [Developer Guide](./DEVELOPER_GUIDE.md) troubleshooting section
2. Search existing GitHub issues
3. Create a new issue with:
   - Environment details (`node --version`, `pnpm --version`)
   - Error messages and stack traces
   - Steps to reproduce
   - Expected vs actual behavior

The setup should take approximately 10-15 minutes on a modern development machine with a good internet connection.