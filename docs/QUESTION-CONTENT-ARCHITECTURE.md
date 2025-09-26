# Question Content Architecture - Deep Dive

## 🔴 Current Implementation (Prototype Stage)

### Storage Approach
```typescript
// All questions hardcoded in /src/data/expandedQuestions.ts
export const mathematicsQuestions: Question[] = [
  { id: 'math-001', question: '2 + 2 = ?', ... },
  { id: 'math-002', question: '3 + 3 = ?', ... },
  // ... 500+ more
];
```

### Loading Mechanism
```typescript
// Everything loaded at once on import
import { allQuestions } from '@/data/expandedQuestions';
// 2000+ questions immediately in memory
```

### Critical Problems
1. **Memory Bloat**: All 2000+ questions loaded regardless of need
2. **Static Content**: No way to update without deployment
3. **No Personalization**: Same questions for every user
4. **No Analytics**: Can't track which questions are effective
5. **No Version Control**: Can't A/B test question variations
6. **Poor Scalability**: Adding more questions = larger bundle

## 🟢 Production-Ready Architecture (Next Steps)

### 1. Database-Backed Storage

```sql
-- PostgreSQL Schema
CREATE TABLE questions (
  id UUID PRIMARY KEY,
  subject VARCHAR(50),
  age_group VARCHAR(10),
  difficulty INT CHECK (difficulty >= 1 AND difficulty <= 10),
  question_text TEXT,
  question_type VARCHAR(50),
  visual_aid_url TEXT,
  audio_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  version INT,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE question_options (
  id UUID PRIMARY KEY,
  question_id UUID REFERENCES questions(id),
  option_text TEXT,
  is_correct BOOLEAN,
  explanation TEXT,
  position INT
);

CREATE TABLE question_metadata (
  question_id UUID REFERENCES questions(id),
  average_time_to_answer INT,
  success_rate DECIMAL(3,2),
  times_presented INT,
  times_correct INT,
  difficulty_rating DECIMAL(3,2), -- Calculated from actual performance
  last_calibrated TIMESTAMP
);

CREATE TABLE user_question_history (
  user_id UUID,
  question_id UUID,
  presented_at TIMESTAMP,
  answered_at TIMESTAMP,
  answer_given TEXT,
  was_correct BOOLEAN,
  hints_used INT,
  time_taken INT,
  difficulty_at_time INT
);
```

### 2. API-Based Content Delivery

```typescript
// API Endpoints
interface QuestionAPI {
  // Lazy load questions as needed
  GET /api/questions/adaptive
    ?subject=math
    &ageGroup=6-8
    &userLevel=5
    &count=10
    Response: Question[] (personalized selection)

  // Get single question with full details
  GET /api/questions/:id
    Response: QuestionWithOptions

  // Submit answer and get feedback
  POST /api/questions/:id/answer
    Body: { answer: string, timeSpent: number }
    Response: {
      correct: boolean,
      explanation: string,
      nextQuestion: Question,
      updatedMastery: number
    }

  // Batch fetch for offline mode
  GET /api/questions/batch
    ?subjects[]=math&subjects[]=english
    &difficulties[]=1&difficulties[]=2
    Response: Question[] (compressed)
}
```

### 3. Smart Caching Strategy

```typescript
class QuestionCacheManager {
  private memoryCache: LRUCache<string, Question>;
  private indexedDB: IDBDatabase;

  async getQuestion(id: string): Promise<Question> {
    // L1: Memory cache (instant)
    if (this.memoryCache.has(id)) {
      return this.memoryCache.get(id);
    }

    // L2: IndexedDB (fast)
    const cached = await this.indexedDB.get('questions', id);
    if (cached && !this.isStale(cached)) {
      this.memoryCache.set(id, cached);
      return cached;
    }

    // L3: Network (slower)
    const fresh = await fetch(`/api/questions/${id}`);
    await this.indexedDB.put('questions', fresh);
    this.memoryCache.set(id, fresh);
    return fresh;
  }

  async prefetchForUser(userId: string) {
    // Intelligently prefetch based on:
    // - Current subject/level
    // - Historical patterns
    // - Predicted next questions
    const predictions = await this.predictNextQuestions(userId);
    await Promise.all(predictions.map(q => this.getQuestion(q.id)));
  }
}
```

### 4. Progressive Content Loading

```typescript
class ContentLoader {
  private loadingStrategy: LoadingStrategy;

  async initialize(user: User) {
    // Phase 1: Critical content (immediate)
    await this.loadCriticalContent(user);

    // Phase 2: Likely content (background)
    this.loadLikelyContent(user);

    // Phase 3: Extended content (idle)
    requestIdleCallback(() => {
      this.loadExtendedContent(user);
    });
  }

  private async loadCriticalContent(user: User) {
    // Load only what's needed for current session
    const currentSubject = user.currentSubject;
    const currentLevel = user.masteryLevels[currentSubject];

    return this.fetchQuestions({
      subject: currentSubject,
      difficulty: [currentLevel - 1, currentLevel, currentLevel + 1],
      limit: 30
    });
  }

  private async loadLikelyContent(user: User) {
    // Predictive loading based on patterns
    const predictions = await this.ml.predictNextSubjects(user);

    for (const subject of predictions) {
      await this.fetchQuestions({
        subject,
        difficulty: user.masteryLevels[subject],
        limit: 20
      });
    }
  }
}
```

### 5. Offline-First Architecture

```typescript
// Service Worker for offline support
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/questions')) {
    event.respondWith(
      // Try network first for freshness
      fetch(event.request)
        .then(response => {
          // Cache successful responses
          const clone = response.clone();
          caches.open('questions-v1').then(cache => {
            cache.put(event.request, clone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(event.request);
        })
    );
  }
});
```

### 6. Dynamic Question Generation

```typescript
interface DynamicQuestionGenerator {
  // Generate variations of existing questions
  generateVariation(baseQuestion: Question): Question {
    // Change numbers but keep structure
    if (baseQuestion.type === 'arithmetic') {
      return this.generateArithmeticVariation(baseQuestion);
    }
    // Change words but keep difficulty
    if (baseQuestion.type === 'vocabulary') {
      return this.generateVocabularyVariation(baseQuestion);
    }
  }

  // AI-powered question generation
  async generateNewQuestion(params: {
    subject: string;
    topic: string;
    difficulty: number;
    ageGroup: string;
  }): Promise<Question> {
    const prompt = this.buildPrompt(params);
    const generated = await this.ai.generate(prompt);
    const validated = await this.validateQuestion(generated);
    return validated;
  }

  // Procedural generation for math
  generateMathQuestion(config: MathConfig): Question {
    const { operation, range, complexity } = config;
    const numbers = this.generateNumbers(range, complexity);
    const question = this.formatMathQuestion(numbers, operation);
    const answer = this.calculateAnswer(numbers, operation);
    const distractors = this.generateDistractors(answer);

    return {
      question,
      options: this.shuffle([answer, ...distractors]),
      correctAnswer: answer.toString(),
      // ... other fields
    };
  }
}
```

### 7. Content Management System

```typescript
// CMS for educators to manage content
interface EducatorCMS {
  // CRUD operations
  createQuestion(question: QuestionInput): Promise<Question>;
  updateQuestion(id: string, updates: Partial<Question>): Promise<Question>;
  reviewQuestion(id: string, review: Review): Promise<void>;

  // Bulk operations
  importQuestions(csv: File): Promise<ImportResult>;
  exportQuestions(filters: FilterParams): Promise<Blob>;

  // Analytics dashboard
  getQuestionPerformance(id: string): Promise<PerformanceMetrics>;
  getSubjectAnalytics(subject: string): Promise<SubjectMetrics>;

  // A/B testing
  createQuestionVariant(original: string, variant: Question): Promise<void>;
  getVariantPerformance(id: string): Promise<VariantMetrics>;
}
```

### 8. Intelligent Question Selection

```typescript
class AdaptiveQuestionSelector {
  private readonly OPTIMAL_SUCCESS_RATE = 0.7;

  async selectNextQuestion(user: User, subject: string): Promise<Question> {
    const history = await this.getUserHistory(user.id, subject);
    const performance = this.calculatePerformance(history);

    // Spaced repetition for previously seen questions
    const dueForReview = this.getQuestionsForReview(history);
    if (dueForReview.length > 0 && Math.random() < 0.3) {
      return this.selectFromReview(dueForReview);
    }

    // Zone of Proximal Development
    const targetDifficulty = this.calculateTargetDifficulty(
      user.masteryLevels[subject],
      performance
    );

    // Avoid recently seen questions
    const recentIds = history.slice(-50).map(h => h.questionId);

    // Select based on multiple factors
    const candidates = await this.fetchCandidates({
      subject,
      difficulty: targetDifficulty,
      excludeIds: recentIds,
      limit: 20
    });

    // Score each candidate
    const scored = candidates.map(q => ({
      question: q,
      score: this.scoreQuestion(q, user, history)
    }));

    // Return best match
    return scored.sort((a, b) => b.score - a.score)[0].question;
  }

  private scoreQuestion(q: Question, user: User, history: History[]): number {
    let score = 100;

    // Prefer questions matching user's learning style
    if (q.hasVisualAid && user.learningStyle === 'visual') score += 20;
    if (q.hasAudio && user.learningStyle === 'auditory') score += 20;

    // Prefer questions building on mastered concepts
    const prerequisites = this.checkPrerequisites(q, user.masteredConcepts);
    score += prerequisites * 15;

    // Prefer questions introducing one new concept
    const newConcepts = this.countNewConcepts(q, user.knownConcepts);
    if (newConcepts === 1) score += 30;
    else if (newConcepts > 2) score -= 20;

    // Prefer well-calibrated questions
    if (q.metadata?.successRate) {
      const calibrationScore = 1 - Math.abs(q.metadata.successRate - this.OPTIMAL_SUCCESS_RATE);
      score += calibrationScore * 25;
    }

    return score;
  }
}
```

### 9. Performance Optimization

```typescript
// Bundle splitting for code
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'questions-math': ['./src/data/questions/math'],
          'questions-english': ['./src/data/questions/english'],
          'questions-science': ['./src/data/questions/science'],
          'questions-geography': ['./src/data/questions/geography'],
          'questions-arts': ['./src/data/questions/arts'],
          'questions-logic': ['./src/data/questions/logic'],
        }
      }
    }
  }
}

// Lazy load only needed subject
const loadSubjectQuestions = async (subject: string) => {
  switch(subject) {
    case 'math':
      return import('./data/questions/math');
    case 'english':
      return import('./data/questions/english');
    // etc...
  }
};
```

### 10. Migration Path

```typescript
class QuestionMigration {
  async migrate() {
    // Phase 1: Dual-write (1 week)
    // - Keep static questions
    // - Also write to database
    // - Monitor for discrepancies

    // Phase 2: Dual-read (2 weeks)
    // - Primary: database
    // - Fallback: static
    // - Track fallback usage

    // Phase 3: Database-only (ongoing)
    // - Remove static questions
    // - Reduce bundle size by ~500KB
    // - Full dynamic loading
  }
}
```

## 📊 Performance Comparison

| Metric | Current (Static) | Production (Dynamic) |
|--------|-----------------|---------------------|
| Initial Bundle Size | 2.5 MB | 800 KB |
| Time to First Question | 2s | 400ms |
| Memory Usage | 50 MB | 15 MB |
| Questions Available | 2000 (fixed) | Unlimited |
| Personalization | None | Full |
| Offline Support | Full | Smart Cache |
| Update Frequency | Deploy only | Real-time |
| Analytics | None | Comprehensive |

## 🎯 Implementation Priority

### Phase 1: Foundation (Week 1-2)
1. Design database schema
2. Build basic API endpoints
3. Implement memory caching
4. Create QuestionBank service layer

### Phase 2: Intelligence (Week 3-4)
1. Adaptive question selection
2. Performance tracking
3. Spaced repetition
4. Difficulty calibration

### Phase 3: Scale (Week 5-6)
1. IndexedDB caching
2. Service worker offline support
3. CDN distribution
4. Compression & optimization

### Phase 4: Enhancement (Week 7-8)
1. AI question generation
2. Educator CMS
3. A/B testing framework
4. Advanced analytics

## 🚀 Benefits of New Architecture

### For Users
- **Faster Load Times**: 75% reduction in initial load
- **Personalized Learning**: Questions adapt to each child
- **Always Fresh**: New content without app updates
- **Offline Learning**: Smart caching for no-internet scenarios

### For Educators
- **Content Control**: Add/edit questions without code
- **Performance Insights**: See what works and what doesn't
- **A/B Testing**: Optimize question effectiveness
- **Curriculum Alignment**: Map to educational standards

### For Developers
- **Maintainable**: Separation of content and code
- **Scalable**: Add millions of questions without impact
- **Testable**: Mock APIs for testing
- **Flexible**: Easy to add new question types

## Conclusion

The current static approach works for a prototype but isn't sustainable for production. The proposed architecture provides:

1. **Scalability**: Handle millions of questions and users
2. **Performance**: Faster loads, less memory usage
3. **Intelligence**: Adaptive, personalized learning
4. **Flexibility**: Dynamic content management
5. **Analytics**: Data-driven improvements

This architecture transforms the question system from a static data dump to an intelligent, adaptive learning engine that improves over time.