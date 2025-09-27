/**
 * AI-Powered Question Generator Service
 * Dynamically generates educational questions based on student performance
 * AAA+ quality procedural content generation
 */

import { StoredQuestion } from '@/services/storage/QuestionStorageService';

export type Subject = 'math' | 'english' | 'science' | 'logic' | 'geography' | 'arts';
export type AgeGroup = '3-5' | '6-8' | '9+';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'adaptive';

interface GenerationConfig {
  subject: Subject;
  ageGroup: AgeGroup;
  difficulty: Difficulty;
  topic?: string;
  count?: number;
  studentPerformance?: {
    successRate: number;
    avgResponseTime: number;
    recentMistakes: string[];
  };
}

interface QuestionTemplate {
  pattern: string;
  variables: Record<string, any>;
  constraints?: Record<string, any>;
  explanationPattern?: string;
}

export class QuestionGeneratorService {
  private static instance: QuestionGeneratorService;
  private templates: Map<string, QuestionTemplate[]> = new Map();
  private difficultyModifiers: Map<string, number> = new Map();

  private constructor() {
    this.initializeTemplates();
    this.initializeDifficultyModifiers();
  }

  public static getInstance(): QuestionGeneratorService {
    if (!QuestionGeneratorService.instance) {
      QuestionGeneratorService.instance = new QuestionGeneratorService();
    }
    return QuestionGeneratorService.instance;
  }

  private initializeTemplates(): void {
    // Math templates
    this.templates.set('math_3-5_addition', [
      {
        pattern: '{a} + {b} = ?',
        variables: { a: [1, 10], b: [1, 10] },
        explanationPattern: 'If you have {a} items and get {b} more, you have {answer} total!'
      },
      {
        pattern: 'What is {a} plus {b}?',
        variables: { a: [1, 5], b: [1, 5] },
        explanationPattern: 'Count {a} fingers, then {b} more. That makes {answer}!'
      }
    ]);

    this.templates.set('math_6-8_multiplication', [
      {
        pattern: '{a} × {b} = ?',
        variables: { a: [2, 12], b: [2, 12] },
        explanationPattern: '{a} groups of {b} equals {answer}'
      },
      {
        pattern: 'If you have {a} boxes with {b} items each, how many items total?',
        variables: { a: [2, 10], b: [2, 10] },
        explanationPattern: '{a} × {b} = {answer} items'
      }
    ]);

    this.templates.set('math_9+_algebra', [
      {
        pattern: 'Solve for x: {a}x + {b} = {c}',
        variables: { a: [1, 10], b: [-20, 20], c: [-50, 50] },
        explanationPattern: 'x = ({c} - {b}) / {a} = {answer}'
      },
      {
        pattern: 'Find the value: {a}² + {b}',
        variables: { a: [1, 15], b: [-10, 10] },
        explanationPattern: '{a}² = {a_squared}, then add {b} to get {answer}'
      }
    ]);

    // English templates
    this.templates.set('english_3-5_spelling', [
      {
        pattern: 'Which word is spelled correctly?',
        variables: { word: ['cat', 'dog', 'sun', 'moon', 'star', 'tree'] },
        explanationPattern: 'The correct spelling is {answer}'
      }
    ]);

    this.templates.set('english_6-8_grammar', [
      {
        pattern: 'Choose the correct verb: She ___ to school yesterday.',
        variables: { options: ['go', 'goes', 'went', 'going'] },
        explanationPattern: 'Past tense of "go" is "went"'
      }
    ]);

    // Science templates
    this.templates.set('science_3-5_nature', [
      {
        pattern: 'What do plants need to grow?',
        variables: { options: ['water', 'fire', 'ice', 'sand'] },
        explanationPattern: 'Plants need {answer} to grow healthy!'
      }
    ]);

    this.templates.set('science_6-8_physics', [
      {
        pattern: 'What happens when you heat water to {temp}°C?',
        variables: { temp: [100, 100], options: ['freezes', 'boils', 'disappears', 'turns solid'] },
        explanationPattern: 'Water {answer} at {temp}°C'
      }
    ]);

    // Logic templates
    this.templates.set('logic_3-5_patterns', [
      {
        pattern: 'What comes next: {sequence} ?',
        variables: { sequence: ['🔴🔵🔴🔵🔴', '⭐🌙⭐🌙⭐', '1️⃣2️⃣1️⃣2️⃣1️⃣'] },
        explanationPattern: 'The pattern repeats, so next is {answer}'
      }
    ]);

    this.templates.set('logic_6-8_sequences', [
      {
        pattern: 'Complete the sequence: {a}, {b}, {c}, ?',
        variables: { a: [1, 20], b: 'a+diff', c: 'b+diff', diff: [1, 5] },
        explanationPattern: 'Each number increases by {diff}, so next is {answer}'
      }
    ]);

    // Geography templates
    this.templates.set('geography_3-5_basics', [
      {
        pattern: 'Which is the biggest: {options}?',
        variables: { options: ['house', 'city', 'country', 'planet'] },
        explanationPattern: 'A {answer} is the biggest!'
      }
    ]);

    this.templates.set('geography_6-8_countries', [
      {
        pattern: 'What is the capital of {country}?',
        variables: {
          country: ['France', 'Germany', 'Spain', 'Italy'],
          capitals: { France: 'Paris', Germany: 'Berlin', Spain: 'Madrid', Italy: 'Rome' }
        },
        explanationPattern: 'The capital of {country} is {answer}'
      }
    ]);

    // Arts templates
    this.templates.set('arts_3-5_colors', [
      {
        pattern: 'What color do you get when you mix {color1} and {color2}?',
        variables: {
          pairs: [
            { color1: 'red', color2: 'blue', answer: 'purple' },
            { color1: 'yellow', color2: 'blue', answer: 'green' },
            { color1: 'red', color2: 'yellow', answer: 'orange' }
          ]
        },
        explanationPattern: '{color1} + {color2} = {answer}!'
      }
    ]);

    this.templates.set('arts_6-8_artists', [
      {
        pattern: 'Who painted {painting}?',
        variables: {
          paintings: {
            'Mona Lisa': 'Leonardo da Vinci',
            'Starry Night': 'Vincent van Gogh',
            'The Scream': 'Edvard Munch'
          }
        },
        explanationPattern: '{painting} was painted by {answer}'
      }
    ]);
  }

  private initializeDifficultyModifiers(): void {
    // Difficulty scaling factors
    this.difficultyModifiers.set('easy', 0.7);
    this.difficultyModifiers.set('medium', 1.0);
    this.difficultyModifiers.set('hard', 1.3);
    this.difficultyModifiers.set('adaptive', 1.0); // Adjusts based on performance
  }

  /**
   * Generate questions based on configuration
   */
  public async generateQuestions(config: GenerationConfig): Promise<StoredQuestion[]> {
    const questions: StoredQuestion[] = [];
    const count = config.count || 10;

    for (let i = 0; i < count; i++) {
      const question = await this.generateSingleQuestion(config);
      if (question) {
        questions.push(question);
      }
    }

    return questions;
  }

  /**
   * Generate a single question
   */
  private async generateSingleQuestion(config: GenerationConfig): Promise<StoredQuestion | null> {
    const templateKey = `${config.subject}_${config.ageGroup}_${config.topic || 'default'}`;
    let templates = this.templates.get(templateKey);

    // Fallback to subject+ageGroup if specific topic not found
    if (!templates) {
      const fallbackKeys = Array.from(this.templates.keys()).filter(key =>
        key.startsWith(`${config.subject}_${config.ageGroup}`)
      );
      if (fallbackKeys.length > 0) {
        const randomKey = fallbackKeys[Math.floor(Math.random() * fallbackKeys.length)];
        templates = this.templates.get(randomKey);
      }
    }

    if (!templates || templates.length === 0) {
      console.warn(`No templates found for ${templateKey}`);
      return null;
    }

    // Select random template
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Generate question based on template
    const generated = this.instantiateTemplate(template, config);

    const question: StoredQuestion = {
      id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      subject: config.subject,
      ageGroup: config.ageGroup,
      difficulty: config.difficulty,
      question: generated.question,
      options: generated.options,
      correctAnswer: generated.correctAnswer,
      explanation: generated.explanation,
      hints: this.generateHints(generated, config),
      metadata: {
        created: new Date(),
        timesUsed: 0,
        successRate: 0
      },
      tags: this.generateTags(config, template),
      prerequisites: this.getPrerequisites(config)
    };

    return question;
  }

  /**
   * Instantiate a template with actual values
   */
  private instantiateTemplate(
    template: QuestionTemplate,
    config: GenerationConfig
  ): {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  } {
    const values: Record<string, any> = {};
    const difficulty = this.difficultyModifiers.get(config.difficulty) || 1.0;

    // Generate values based on template variables
    for (const [key, constraint] of Object.entries(template.variables)) {
      if (Array.isArray(constraint) && constraint.length === 2 && typeof constraint[0] === 'number') {
        // Range constraint
        const [min, max] = constraint;
        const range = max - min;
        const adjustedMin = Math.floor(min * difficulty);
        const adjustedMax = Math.floor(max * difficulty);
        values[key] = Math.floor(Math.random() * (adjustedMax - adjustedMin + 1)) + adjustedMin;
      } else if (Array.isArray(constraint)) {
        // Choice constraint
        values[key] = constraint[Math.floor(Math.random() * constraint.length)];
      } else if (typeof constraint === 'object') {
        // Complex constraint
        const keys = Object.keys(constraint);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        values[key] = randomKey;
        values.answer = constraint[randomKey];
      }
    }

    // Calculate derived values
    if (template.pattern.includes('{a} + {b}')) {
      values.answer = values.a + values.b;
    } else if (template.pattern.includes('{a} × {b}') || template.pattern.includes('{a} boxes')) {
      values.answer = values.a * values.b;
    } else if (template.pattern.includes('{a}²')) {
      values.a_squared = values.a * values.a;
      values.answer = values.a_squared + values.b;
    } else if (template.pattern.includes('Solve for x')) {
      values.answer = ((values.c - values.b) / values.a).toFixed(2);
    }

    // Generate question text
    let questionText = template.pattern;
    for (const [key, value] of Object.entries(values)) {
      questionText = questionText.replace(new RegExp(`\\{${key}\\}`, 'g'), value.toString());
    }

    // Generate options
    const options = this.generateOptions(values.answer, config);

    // Generate explanation
    let explanation = template.explanationPattern || '';
    for (const [key, value] of Object.entries(values)) {
      explanation = explanation.replace(new RegExp(`\\{${key}\\}`, 'g'), value.toString());
    }

    return {
      question: questionText,
      options,
      correctAnswer: values.answer?.toString() || options[0],
      explanation
    };
  }

  /**
   * Generate multiple choice options
   */
  private generateOptions(correctAnswer: any, config: GenerationConfig): string[] {
    const options: string[] = [correctAnswer.toString()];
    const isNumeric = !isNaN(correctAnswer);

    if (isNumeric) {
      const value = parseFloat(correctAnswer);
      const variance = config.ageGroup === '3-5' ? 2 :
                      config.ageGroup === '6-8' ? 5 : 10;

      // Generate plausible wrong answers
      while (options.length < 4) {
        let wrong: number;
        if (Math.random() < 0.5) {
          // Close to correct answer
          wrong = value + (Math.random() < 0.5 ? -1 : 1) * Math.ceil(Math.random() * variance);
        } else {
          // Common mistakes
          if (config.subject === 'math') {
            const mistakes = [value - 1, value + 1, value * 2, Math.floor(value / 2)];
            wrong = mistakes[Math.floor(Math.random() * mistakes.length)];
          } else {
            wrong = value + Math.floor(Math.random() * variance * 2) - variance;
          }
        }

        const wrongStr = Number.isInteger(wrong) ? wrong.toString() : wrong.toFixed(2);
        if (!options.includes(wrongStr) && wrong >= 0) {
          options.push(wrongStr);
        }
      }
    } else {
      // For non-numeric answers, use predefined distractors
      const distractors = this.getDistracters(correctAnswer, config);
      options.push(...distractors.slice(0, 3));
    }

    // Shuffle options
    return this.shuffleArray(options);
  }

  /**
   * Get distractors for non-numeric questions
   */
  private getDistracters(correctAnswer: string, config: GenerationConfig): string[] {
    const distractorMap: Record<string, string[]> = {
      // Colors
      'purple': ['blue', 'red', 'pink'],
      'green': ['blue', 'yellow', 'turquoise'],
      'orange': ['red', 'yellow', 'pink'],

      // Capitals
      'Paris': ['London', 'Rome', 'Berlin'],
      'Berlin': ['Munich', 'Hamburg', 'Paris'],
      'Madrid': ['Barcelona', 'Valencia', 'Lisbon'],
      'Rome': ['Milan', 'Venice', 'Florence'],

      // Artists
      'Leonardo da Vinci': ['Michelangelo', 'Raphael', 'Donatello'],
      'Vincent van Gogh': ['Claude Monet', 'Paul Cézanne', 'Pablo Picasso'],
      'Edvard Munch': ['Gustav Klimt', 'Wassily Kandinsky', 'Henri Matisse'],

      // Grammar
      'went': ['go', 'goes', 'going'],
      'boils': ['freezes', 'melts', 'evaporates'],

      // Default
      'default': ['Option A', 'Option B', 'Option C']
    };

    return distractorMap[correctAnswer] || distractorMap['default'];
  }

  /**
   * Generate hints for a question
   */
  private generateHints(
    generated: { question: string; correctAnswer: string },
    config: GenerationConfig
  ): string[] {
    const hints: string[] = [];

    if (config.subject === 'math') {
      if (config.ageGroup === '3-5') {
        hints.push('Try counting on your fingers!');
        hints.push('Draw circles to help you count');
      } else if (config.ageGroup === '6-8') {
        hints.push('Break it down into smaller parts');
        hints.push('Think about what operation to use');
      } else {
        hints.push('Check your calculations step by step');
        hints.push('What formula applies here?');
      }
    } else if (config.subject === 'english') {
      hints.push('Sound it out slowly');
      hints.push('Think about the rules you learned');
    } else if (config.subject === 'science') {
      hints.push('Think about cause and effect');
      hints.push('What happens in nature?');
    }

    // Add specific hint based on answer
    const answerLength = generated.correctAnswer.toString().length;
    if (answerLength <= 3) {
      hints.push(`The answer has ${answerLength} characters`);
    }

    return hints;
  }

  /**
   * Generate tags for categorization
   */
  private generateTags(config: GenerationConfig, template: QuestionTemplate): string[] {
    const tags: string[] = [config.subject, config.ageGroup, config.difficulty];

    if (config.topic) {
      tags.push(config.topic);
    }

    // Add specific tags based on pattern
    if (template.pattern.includes('+')) tags.push('addition');
    if (template.pattern.includes('×') || template.pattern.includes('multiplication')) tags.push('multiplication');
    if (template.pattern.includes('Solve for')) tags.push('algebra');
    if (template.pattern.includes('spell')) tags.push('spelling');
    if (template.pattern.includes('grammar')) tags.push('grammar');
    if (template.pattern.includes('pattern')) tags.push('patterns');
    if (template.pattern.includes('capital')) tags.push('geography-capitals');
    if (template.pattern.includes('color')) tags.push('color-theory');

    return tags;
  }

  /**
   * Get prerequisites for a question
   */
  private getPrerequisites(config: GenerationConfig): string[] {
    const prereqs: string[] = [];

    if (config.subject === 'math') {
      if (config.ageGroup === '6-8' && config.topic === 'multiplication') {
        prereqs.push('addition', 'counting');
      } else if (config.ageGroup === '9+' && config.topic === 'algebra') {
        prereqs.push('arithmetic', 'variables');
      }
    }

    return prereqs;
  }

  /**
   * Adapt difficulty based on student performance
   */
  public adaptDifficulty(
    currentDifficulty: Difficulty,
    performance: { successRate: number; avgResponseTime: number }
  ): Difficulty {
    if (performance.successRate > 0.9 && performance.avgResponseTime < 10) {
      // Student is doing very well, increase difficulty
      if (currentDifficulty === 'easy') return 'medium';
      if (currentDifficulty === 'medium') return 'hard';
    } else if (performance.successRate < 0.5 || performance.avgResponseTime > 30) {
      // Student is struggling, decrease difficulty
      if (currentDifficulty === 'hard') return 'medium';
      if (currentDifficulty === 'medium') return 'easy';
    }

    return currentDifficulty;
  }

  /**
   * Generate personalized questions based on student's weak areas
   */
  public async generateRemedialQuestions(
    studentMistakes: Array<{ topic: string; errorType: string }>,
    config: Omit<GenerationConfig, 'topic'>
  ): Promise<StoredQuestion[]> {
    const questions: StoredQuestion[] = [];

    // Group mistakes by topic
    const mistakesByTopic = new Map<string, number>();
    studentMistakes.forEach(mistake => {
      const count = mistakesByTopic.get(mistake.topic) || 0;
      mistakesByTopic.set(mistake.topic, count + 1);
    });

    // Generate questions for each problem area
    for (const [topic, errorCount] of mistakesByTopic.entries()) {
      const questionsNeeded = Math.min(3, Math.ceil(errorCount / 2));

      for (let i = 0; i < questionsNeeded; i++) {
        const question = await this.generateSingleQuestion({
          ...config,
          topic,
          difficulty: 'easy' // Start with easier versions
        });

        if (question) {
          question.tags.push('remedial', 'practice');
          questions.push(question);
        }
      }
    }

    return questions;
  }

  /**
   * Generate challenge questions for advanced students
   */
  public async generateChallengeQuestions(
    config: GenerationConfig
  ): Promise<StoredQuestion[]> {
    const enhancedConfig = {
      ...config,
      difficulty: 'hard' as Difficulty,
      count: config.count || 5
    };

    const questions = await this.generateQuestions(enhancedConfig);

    // Add challenge tags
    questions.forEach(q => {
      q.tags.push('challenge', 'advanced');
      q.metadata.successRate = 0; // Reset for tracking
    });

    return questions;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// Export singleton instance
export const questionGenerator = QuestionGeneratorService.getInstance();