# API Documentation - Stealth Learning Platform

## Overview
Complete API documentation for the educational gaming platform designed for children ages 3-9.

## Core Services

### DatabaseService
Singleton service managing all data persistence and retrieval operations.

#### Methods

##### User Management
```typescript
// Create new parent account
createParent(email: string, password: string, profile: Partial<ParentProfile>): Promise<string>

// Create child profile
createChild(parentId: string, profile: ChildProfile): Promise<string>

// Authentication
authenticateParent(email: string, password: string): Promise<User | null>
verifyChildPIN(profileId: string, pin: string): Promise<boolean>
```

##### Game Sessions
```typescript
// Start new game session
startGameSession(userId: string, gameId: string, ageGroup: AgeGroup): Promise<string>

// Update session progress
updateGameSession(sessionId: string, updates: Partial<GameSession>): Promise<void>

// End session and save results
endGameSession(sessionId: string, finalData: GameSessionResult): Promise<void>
```

##### Progress Tracking
```typescript
// Save performance data
savePerformanceRecord(record: PerformanceRecord): Promise<string>

// Get learning analytics
getPerformanceHistory(userId: string, timeframe?: string): Promise<PerformanceRecord[]>

// Achievement system
updateAchievement(achievement: Achievement): Promise<string>
getStudentAchievements(userId: string): Promise<Achievement[]>
```

##### Content Management
```typescript
// Search game content
searchGameContent(query: string, ageGroup?: AgeGroup): Promise<GameContent[]>

// Get adaptive content
getAdaptiveContent(userId: string, subject: Subject, difficulty: DifficultyLevel): Promise<Content[]>
```

### GameEngine
Core game logic and content delivery system.

#### Initialization
```typescript
const gameEngine = new GameEngine({
  ageGroup: '6-8',
  subject: 'mathematics',
  adaptiveDifficulty: true,
  enableVoice: true,
  enableDrawing: true
});
```

#### Game Flow
```typescript
// Start game with content
await gameEngine.startGame(gameId, userId);

// Process player answer
const result = await gameEngine.processAnswer(answer, timeSpent, hintsUsed);

// Get next question
const question = await gameEngine.getNextQuestion();

// End game and get results
const summary = await gameEngine.endGame();
```

#### Adaptive Learning
```typescript
// Adjust difficulty based on performance
gameEngine.adjustDifficulty(performance: PerformanceMetrics);

// Get personalized content recommendations
const content = await gameEngine.getPersonalizedContent(userId, preferences);
```

### ContentFactory
Dynamic content generation and management.

#### Question Generation
```typescript
// Generate age-appropriate questions
const questions = ContentFactory.generateQuestions({
  subject: 'mathematics',
  ageGroup: '6-8',
  difficulty: 'medium',
  count: 10,
  topics: ['addition', 'subtraction']
});

// Generate multimedia content
const mediaContent = ContentFactory.generateMultimediaContent({
  type: 'enhanced-media',
  ageGroup: '3-5',
  subject: 'science',
  topic: 'animals'
});
```

#### Content Customization
```typescript
// Customize for specific learning needs
const adaptiveContent = ContentFactory.generateAdaptiveContent({
  userId: 'user-123',
  weakAreas: ['counting', 'patterns'],
  strengths: ['colors', 'shapes'],
  preferredStyle: 'visual'
});
```

### VoiceRecognitionEngine
Speech recognition and voice interaction capabilities.

#### Setup
```typescript
const voiceEngine = new VoiceRecognitionEngine({
  language: 'en-US',
  ageGroup: '6-8',
  noiseReduction: true,
  continuous: false
});
```

#### Voice Commands
```typescript
// Start listening
await voiceEngine.start();

// Add custom commands
voiceEngine.addCommand({
  phrases: ['next question', 'skip'],
  callback: () => gameEngine.nextQuestion(),
  ageGroup: '6-8'
});

// Handle voice input
voiceEngine.onResult((result) => {
  if (result.confidence > 0.8) {
    processVoiceAnswer(result.transcript);
  }
});
```

### LearningAnalyticsEngine
Performance tracking and learning insights.

#### Analytics Collection
```typescript
// Track learning events
analyticsEngine.trackEvent('question_answered', {
  gameId: 'math-101',
  questionId: 'q-456',
  isCorrect: true,
  timeSpent: 15000,
  hintsUsed: 1
});

// Track engagement metrics
analyticsEngine.trackEngagement({
  sessionDuration: 1800000, // 30 minutes
  questionsAttempted: 12,
  completionRate: 0.85
});
```

#### Performance Metrics
```typescript
// Get comprehensive performance analysis
const metrics = await analyticsEngine.calculatePerformanceMetrics(
  userId,
  'weekly',
  'mathematics'
);

// Generate learning trends
const trends = analyticsEngine.calculateTrends(userId, 'monthly');

// Get improvement recommendations
const recommendations = analyticsEngine.generateRecommendations(userId, metrics);
```

### DataSyncEngine
Offline-first data synchronization with conflict resolution.

#### Sync Operations
```typescript
// Sync local changes to server
const syncResult = await dataSyncEngine.syncToServer();

// Pull latest data from server
await dataSyncEngine.syncFromServer();

// Handle sync conflicts
dataSyncEngine.onConflict((conflict) => {
  // Custom conflict resolution logic
  return resolveConflict(conflict);
});
```

#### Offline Support
```typescript
// Queue operations for later sync
dataSyncEngine.queueOperation('updateProgress', progressData);

// Check sync status
const status = dataSyncEngine.getSyncStatus();

// Force sync when online
if (navigator.onLine) {
  await dataSyncEngine.forcSync();
}
```

## Component Library

### Card System
Polymorphic card components with age-appropriate styling.

#### BaseCard
```typescript
<BaseCard
  ageGroup="6-8"
  title="Math Adventure"
  description="Learn addition through fun games"
  variant="elevated"
  interactive={true}
  animation={{ type: 'bounce', delay: 0.2 }}
  effects={{ hover: true, shadow: 'lg' }}
/>
```

#### Specialized Cards
```typescript
// Game Card
<Card
  cardType="game"
  difficulty="medium"
  progress={75}
  gameType="math"
  estimatedTime={15}
  rewards={{ xp: 100, badges: ['math-master'] }}
/>

// Metric Card
<Card
  cardType="metric"
  value={85}
  label="Accuracy"
  unit="%"
  trend="up"
  colorScheme="green"
/>

// Achievement Card
<Card
  cardType="achievement"
  achievementType="badge"
  isUnlocked={true}
  rarity="rare"
  title="Math Wizard"
/>
```

### Interactive Components

#### QuestionCard
```typescript
<Card
  cardType="question"
  questionType="multiple-choice"
  options={['5', '6', '7', '8']}
  correctAnswer="7"
  onAnswer={(answer) => handleAnswer(answer)}
  timeLimit={30000}
  hint="Count the objects carefully"
/>
```

#### DrawingCanvas
```typescript
<DrawingCanvas
  width={400}
  height={300}
  brushSize={5}
  color="#2563eb"
  ageGroup="6-8"
  onDrawingComplete={(imageData) => processDrawing(imageData)}
  enableShapes={true}
  enableUndo={true}
/>
```

## State Management

### Redux Store Structure
```typescript
interface RootState {
  session: SessionState;      // User session and authentication
  game: GameSliceState;       // Current game state and progress
  settings: SettingsState;    // User preferences and configuration
  analytics: AnalyticsState;  // Learning analytics and metrics
  adaptive: AdaptiveState;    // Adaptive learning algorithms
  student: StudentState;      // Student profile and progress
}
```

### Session Management
```typescript
// Start user session
dispatch(startSession({ userId, ageGroup, preferences }));

// Update game state
dispatch(updateGameState({ currentQuestion, score, timeElapsed }));

// Save progress
dispatch(saveProgress({ sessionId, performance, achievements }));
```

### Adaptive Learning State
```typescript
// Update difficulty based on performance
dispatch(updateDifficulty({
  newLevel: adaptiveDifficulty,
  reason: 'performance_improvement'
}));

// Track learning patterns
dispatch(trackLearningPattern({
  pattern: 'visual_learner',
  confidence: 0.85,
  evidence: ['prefers_images', 'struggles_with_text']
}));
```

## Error Handling

### Error Categories
- `AUTHENTICATION`: Login/logout related errors
- `DATABASE`: Data persistence failures
- `NETWORK`: Connectivity issues
- `GAME_ENGINE`: Game logic errors
- `ANALYTICS`: Tracking and metrics errors
- `UI_COMPONENT`: Component rendering issues
- `PERFORMANCE`: Performance bottlenecks
- `VALIDATION`: Input validation failures

### Error Tracking
```typescript
// Track errors with context
errorTracker.trackError(
  error,
  ErrorCategory.GAME_ENGINE,
  ErrorSeverity.HIGH,
  {
    gameId: 'math-101',
    userId: 'user-123',
    ageGroup: '6-8',
    context: 'question_processing'
  }
);

// Performance monitoring
errorTracker.trackPerformance('component_render', {
  component: 'GameCard',
  renderTime: 25,
  complexity: 'high'
});
```

## Configuration

### Environment Variables
```bash
# Database Configuration
VITE_DB_NAME=stealth_learning_db
VITE_DB_VERSION=1

# Authentication
VITE_JWT_SECRET=your_jwt_secret_key
VITE_JWT_EXPIRES_IN=24h

# Monitoring
VITE_SENTRY_DSN=your_sentry_dsn
VITE_ENABLE_PERFORMANCE_MONITORING=true

# Features
VITE_ENABLE_VOICE_RECOGNITION=true
VITE_ENABLE_DRAWING_CANVAS=true
VITE_ENABLE_ADAPTIVE_LEARNING=true
```

### Age Group Configuration
```typescript
interface AgeGroupConfig {
  '3-5': {
    touchTargetSize: 64;      // Large touch targets
    animationSpeed: 'slow';   // Slower animations
    voiceEnabled: true;       // Voice interaction
    timeouts: {
      question: 60000;        // 1 minute per question
      session: 900000;        // 15 minute sessions
    };
  };
  '6-8': {
    touchTargetSize: 48;      // Medium touch targets
    animationSpeed: 'normal'; // Normal animations
    voiceEnabled: true;       // Voice interaction
    timeouts: {
      question: 45000;        // 45 seconds per question
      session: 1800000;       // 30 minute sessions
    };
  };
  '9+': {
    touchTargetSize: 44;      // Standard touch targets
    animationSpeed: 'fast';   // Faster animations
    voiceEnabled: false;      // Less voice dependency
    timeouts: {
      question: 30000;        // 30 seconds per question
      session: 2700000;       // 45 minute sessions
    };
  };
}
```

## Privacy & Security

### COPPA Compliance
- No collection of personal information from children under 13
- Parental consent required for all child accounts
- Data anonymization in error tracking
- Secure PIN-based child authentication

### Data Protection
```typescript
// Anonymize sensitive data
const anonymizedData = {
  userId: `user_${userId.slice(-4)}`,
  timestamp: Date.now(),
  metrics: performanceMetrics,
  // Personal information removed
};

// Encrypt sensitive storage
const encryptedData = await EncryptionService.encrypt(
  JSON.stringify(sensitiveData)
);
```

## Performance Optimization

### Recommended Settings
- **Bundle splitting**: Automatic code splitting by route and feature
- **Image optimization**: WebP format with fallbacks
- **Caching strategy**: Service worker with offline support
- **Memory management**: Automatic cleanup of game resources
- **Performance monitoring**: Real-time metrics with Sentry

### Memory Management
```typescript
// Clean up game resources
gameEngine.cleanup();

// Clear analytics cache
analyticsEngine.clearCache();

// Reset drawing canvas
drawingCanvas.clear();
```

## Testing

### Unit Testing
```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run specific test file
pnpm test DatabaseService.test.ts
```

### Integration Testing
```bash
# Test game flow
pnpm test integration/game-flow.test.ts

# Test data synchronization
pnpm test integration/data-sync.test.ts
```

### E2E Testing
```bash
# Run Playwright tests
pnpm test:e2e

# Test specific user journey
pnpm test:e2e -- --grep "Complete math game session"
```

## Development

### Getting Started
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm type-check
```

### Code Quality
```bash
# Lint code
pnpm lint

# Format code
pnpm format

# Type checking
pnpm type-check
```

## Deployment

### Production Build
```bash
# Build optimized bundle
pnpm build

# Preview production build
pnpm preview

# Deploy to CDN
pnpm deploy
```

### Performance Metrics
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.0s
- **Bundle size**: < 2MB gzipped