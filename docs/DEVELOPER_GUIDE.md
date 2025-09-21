# Developer Guide - Stealth Learning Platform

## Table of Contents
1. [Quick Start](#quick-start)
2. [Project Architecture](#project-architecture)
3. [Development Workflow](#development-workflow)
4. [Code Standards](#code-standards)
5. [Testing Strategy](#testing-strategy)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm (required - do not use npm or yarn)
- Git

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd stealth-learning

# Install dependencies (MUST use pnpm)
pnpm install

# Start development server
pnpm dev

# Open browser to http://localhost:3000
```

### Essential Commands
```bash
# Development
pnpm dev              # Start dev server with hot reload
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm type-check       # TypeScript type checking

# Quality Assurance
pnpm lint             # ESLint code analysis
pnpm format           # Prettier code formatting
pnpm test             # Run unit tests
pnpm test:coverage    # Test coverage report
pnpm test:ui          # Interactive test UI

# Documentation
pnpm storybook        # Component documentation
pnpm build-storybook  # Build static Storybook
```

## Project Architecture

### Core Philosophy
The Stealth Learning Platform is built on three foundational principles:

1. **Age-Adaptive Design**: All components automatically adapt to age groups (3-5, 6-8, 9+)
2. **Offline-First**: Full functionality without internet connectivity
3. **Privacy-by-Design**: COPPA-compliant with no tracking of children

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Redux Toolkit with RTK Query
- **Styling**: Tailwind CSS with age-adaptive design system
- **Database**: Dexie (IndexedDB wrapper) for offline storage
- **Testing**: Vitest + React Testing Library + Playwright
- **Documentation**: Storybook for component library

### Directory Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Card, etc.)
│   └── layout/         # Layout components
├── features/           # Feature-specific modules
├── hooks/              # Custom React hooks
├── pages/              # Route components
├── services/           # Business logic and data services
│   ├── database/       # Database layer
│   ├── game/          # Game engine and mechanics
│   ├── analytics/     # Learning analytics
│   └── monitoring/    # Error tracking and performance
├── store/              # Redux store and slices
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/             # Static assets
```

### Age-Adaptive Architecture

#### Touch Target Sizing
```typescript
const TOUCH_TARGET_SIZES = {
  '3-5': 64,   // Large for small fingers
  '6-8': 48,   // Medium size
  '9+': 44,    // Standard size
};
```

#### Animation Speeds
```typescript
const ANIMATION_SPEEDS = {
  '3-5': { duration: 0.8, playful: true },   // Slower, more playful
  '6-8': { duration: 0.5, playful: false },  // Balanced
  '9+': { duration: 0.3, playful: false },   // Quick, efficient
};
```

#### Component Usage
```tsx
// All components accept ageGroup prop
<Button ageGroup="3-5" variant="primary">
  🎮 Play Game!
</Button>

<Card ageGroup="6-8" cardType="metric" value={85} label="Accuracy">
  Performance Tracking
</Card>
```

## Development Workflow

### Branch Strategy
```bash
main                    # Production-ready code
├── develop            # Integration branch
├── feature/abc-123    # Feature branches
├── bugfix/xyz-456     # Bug fix branches
└── hotfix/critical    # Emergency fixes
```

### Feature Development
1. **Create Feature Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/new-game-mode
   ```

2. **Development Cycle**
   ```bash
   # Make changes
   pnpm dev              # Test in development
   pnpm type-check       # Verify TypeScript
   pnpm test             # Run unit tests
   pnpm lint             # Check code quality
   ```

3. **Testing**
   ```bash
   pnpm test:coverage    # Ensure 90%+ coverage
   pnpm test:e2e         # End-to-end testing
   pnpm storybook        # Document components
   ```

4. **Pull Request**
   ```bash
   git add .
   git commit -m "feat: add new game mode for mathematics"
   git push origin feature/new-game-mode
   # Create PR to develop branch
   ```

### Code Standards

#### TypeScript Configuration
- Strict mode enabled
- No implicit any types
- Path aliases configured (`@/`, `@components/`, etc.)
- Comprehensive type definitions

#### Component Standards
```tsx
// Age-aware component template
interface Props extends AgeAwareComponentProps {
  title: string;
  onClick?: () => void;
}

export const ExampleComponent: React.FC<Props> = ({
  ageGroup,
  title,
  onClick,
  className
}) => {
  const touchTargetSize = TOUCH_TARGET_SIZES[ageGroup];

  return (
    <div
      className={cn(
        'rounded-lg transition-all',
        className
      )}
      style={{ minHeight: touchTargetSize }}
      onClick={onClick}
    >
      {title}
    </div>
  );
};
```

#### Service Layer Pattern
```typescript
// Singleton service with proper encapsulation
export class GameEngine {
  private static instance: GameEngine;
  private currentGame: GameState | null = null;

  public static getInstance(): GameEngine {
    if (!GameEngine.instance) {
      GameEngine.instance = new GameEngine();
    }
    return GameEngine.instance;
  }

  public async startGame(gameId: string, userId: string): Promise<void> {
    // Implementation
  }
}

// Usage
const gameEngine = GameEngine.getInstance();
await gameEngine.startGame('math-101', 'user-123');
```

### Database Design

#### Schema Philosophy
- Offline-first with IndexedDB
- Automatic encryption for sensitive data
- Conflict resolution for sync
- Age-appropriate data retention

#### Example Table Definition
```typescript
// Database schema with Dexie
export class StealthLearningDB extends Dexie {
  students!: Table<StudentModel>;
  sessions!: Table<LearningSession>;
  performance!: Table<PerformanceRecord>;

  constructor() {
    super('StealthLearningDB');
    this.version(1).stores({
      students: '++id, username, ageGroup, createdAt',
      sessions: '++id, studentId, startedAt, subject',
      performance: '++id, studentId, timestamp, skill, subject'
    });
  }
}
```

#### Data Encryption
```typescript
// Automatic encryption for sensitive fields
const encryptedProfile = await EncryptionService.encrypt(
  JSON.stringify(profileData)
);

await db.students.add({
  id: generateId(),
  encryptedProfile,
  ageGroup: '6-8',
  createdAt: new Date()
});
```

## Testing Strategy

### Test Pyramid
1. **Unit Tests (70%)**: Individual components and functions
2. **Integration Tests (20%)**: Service interactions
3. **E2E Tests (10%)**: Complete user journeys

### Unit Testing
```typescript
// Component testing with age groups
describe('Button Component', () => {
  it('should render with appropriate size for age group', () => {
    render(<Button ageGroup="3-5">Click me</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ minHeight: '64px' });
  });

  it('should have playful animations for young children', () => {
    render(<Button ageGroup="3-5">Play</Button>);

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);

    expect(button).toHaveClass('animate-bounce');
  });
});
```

### Integration Testing
```typescript
// Service integration testing
describe('GameEngine Integration', () => {
  it('should complete full game cycle', async () => {
    const gameEngine = GameEngine.getInstance();
    const userId = 'test-user';
    const gameId = 'math-addition';

    // Start game
    await gameEngine.startGame(gameId, userId);
    expect(gameEngine.getCurrentGame()).toBeDefined();

    // Process answers
    const result = await gameEngine.processAnswer('7', 2500, 0);
    expect(result.correct).toBe(true);

    // End game
    const summary = await gameEngine.endGame();
    expect(summary.score).toBeGreaterThan(0);
  });
});
```

### E2E Testing
```typescript
// Complete user journey testing
test('Child can complete math game successfully', async ({ page }) => {
  // Navigate to game
  await page.goto('/games/math-addition');

  // Select age group
  await page.click('[data-testid="age-6-8"]');

  // Start game
  await page.click('[data-testid="start-game"]');

  // Answer questions
  await page.click('[data-testid="answer-7"]');
  await page.click('[data-testid="submit-answer"]');

  // Verify success
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});
```

### Performance Testing
```typescript
// Performance benchmarks
describe('Performance Tests', () => {
  it('should render game within performance budget', async () => {
    const startTime = performance.now();

    render(<GamePlayPage ageGroup="6-8" gameId="math-101" />);

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(renderTime).toBeLessThan(100); // 100ms budget
  });
});
```

## Error Handling & Monitoring

### Error Categories
```typescript
enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  DATABASE = 'database',
  GAME_ENGINE = 'game_engine',
  UI_COMPONENT = 'ui_component',
  PERFORMANCE = 'performance'
}
```

### Error Tracking
```typescript
// Automatic error tracking with context
errorTracker.trackError(
  new Error('Game failed to load'),
  ErrorCategory.GAME_ENGINE,
  ErrorSeverity.HIGH,
  {
    gameId: 'math-101',
    userId: 'user-123',
    ageGroup: '6-8'
  }
);
```

### Performance Monitoring
```typescript
// Performance metrics collection
performanceMonitor.trackMetric('component_render', {
  component: 'GameCard',
  renderTime: 25,
  ageGroup: '6-8',
  complexity: 'high'
});
```

## Deployment

### Build Process
```bash
# Production build
pnpm build

# Verify build
pnpm preview

# Run production tests
pnpm test:e2e:prod
```

### Environment Configuration
```bash
# Development
VITE_NODE_ENV=development
VITE_API_URL=http://localhost:3001
VITE_ENABLE_DEV_TOOLS=true

# Production
VITE_NODE_ENV=production
VITE_API_URL=https://api.stealthlearning.com
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_SENTRY_DSN=your_production_dsn
```

### Performance Targets
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 2MB gzipped

### Security Checklist
- [ ] All sensitive data encrypted
- [ ] COPPA compliance verified
- [ ] No third-party tracking
- [ ] CSP headers configured
- [ ] Dependencies vulnerability scan passed

## Troubleshooting

### Common Issues

#### TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
pnpm install

# Check specific file
pnpm type-check -- --noEmit --skipLibCheck src/problematic-file.ts
```

#### Build Failures
```bash
# Clear all caches
rm -rf node_modules dist .vite
pnpm install
pnpm build
```

#### Test Failures
```bash
# Run tests in debug mode
pnpm test -- --reporter=verbose

# Clear test cache
pnpm test -- --clearCache
```

#### Performance Issues
```bash
# Analyze bundle size
pnpm build
npx vite-bundle-analyzer

# Profile in development
pnpm dev -- --profile
```

### Database Issues
```typescript
// Reset local database
await db.delete();
await db.open();
await db.students.clear();
```

### Age Group Testing
```bash
# Test all age groups
pnpm test -- --grep="age group"

# Visual regression testing
pnpm test:visual -- --age-groups=all
```

## Best Practices

### Component Development
1. Always accept `ageGroup` prop
2. Use age-appropriate sizing and animations
3. Include comprehensive Storybook stories
4. Write tests for all age group variations

### Service Development
1. Use singleton pattern for stateful services
2. Implement proper error handling
3. Add comprehensive logging
4. Design for offline-first usage

### Performance Optimization
1. Lazy load routes and heavy components
2. Optimize images with WebP format
3. Use service worker for caching
4. Monitor bundle size continuously

### Accessibility
1. Provide proper ARIA labels
2. Ensure keyboard navigation
3. Test with screen readers
4. Maintain color contrast ratios

## Getting Help

### Documentation Resources
- [API Documentation](./API.md)
- [Component Library](http://localhost:6006) (Storybook)
- [Architecture Decision Records](./architecture/)

### Development Tools
- **VSCode Extensions**: ESLint, Prettier, TypeScript
- **Browser Extensions**: React DevTools, Redux DevTools
- **Testing Tools**: Vitest UI, Playwright Test Runner

### Community
- Internal Slack: #stealth-learning-dev
- Code Reviews: All PRs require 2 approvals
- Architecture Reviews: Monthly tech sessions

This developer guide ensures consistent, high-quality development practices while maintaining the platform's core principles of age-adaptive design, offline functionality, and child privacy protection.