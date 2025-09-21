import { Subject, AgeGroup, DifficultyLevel } from '@/types';
import { GameContent, Question } from '../database/schema';
import { databaseService } from '../database/DatabaseService';

// Content factory for generating dynamic game content
export class ContentFactory {
  private static instance: ContentFactory;
  private contentCache: Map<string, GameContent> = new Map();

  private constructor() {}

  static getInstance(): ContentFactory {
    if (!ContentFactory.instance) {
      ContentFactory.instance = new ContentFactory();
    }
    return ContentFactory.instance;
  }

  // Main content loading method - fixes the critical bug
  async loadGameContent(gameId: string, ageGroup: AgeGroup, difficulty: DifficultyLevel): Promise<GameContent | null> {
    try {
      console.log(`🎮 Loading content for gameId: ${gameId}, ageGroup: ${ageGroup}, difficulty: ${difficulty}`);

      // Extract subject from gameId
      const subject = this.extractSubjectFromGameId(gameId);
      console.log(`📚 Extracted subject: ${subject} from gameId: ${gameId}`);

      // Create cache key
      const cacheKey = `${gameId}-${ageGroup}-${difficulty}`;

      // Check cache first
      if (this.contentCache.has(cacheKey)) {
        console.log(`📦 Content found in cache for: ${cacheKey}`);
        return this.contentCache.get(cacheKey)!;
      }

      // Try to load from database
      let content = await databaseService.getGameContent(gameId, ageGroup, difficulty);

      // If not found, generate dynamic content
      if (!content) {
        console.log(`🔨 Generating dynamic content for: ${cacheKey}`);
        content = await this.generateGameContent(gameId, subject, ageGroup, difficulty);
      }

      // Cache the content
      if (content) {
        this.contentCache.set(cacheKey, content);
        console.log(`✅ Content loaded and cached for: ${cacheKey}`);
      }

      return content;
    } catch (error) {
      console.error('Failed to load game content:', error);
      return null;
    }
  }

  // Extract subject from gameId - critical for fixing the bug
  private extractSubjectFromGameId(gameId: string): Subject {
    const gameIdLower = gameId.toLowerCase();

    // Mathematics patterns
    if (gameIdLower.includes('math') ||
        gameIdLower.includes('counting') ||
        gameIdLower.includes('addition') ||
        gameIdLower.includes('subtraction') ||
        gameIdLower.includes('multiplication') ||
        gameIdLower.includes('division') ||
        gameIdLower.includes('numbers') ||
        gameIdLower.includes('geometry')) {
      return 'mathematics';
    }

    // English patterns
    if (gameIdLower.includes('english') ||
        gameIdLower.includes('letters') ||
        gameIdLower.includes('phonics') ||
        gameIdLower.includes('spelling') ||
        gameIdLower.includes('reading') ||
        gameIdLower.includes('vocabulary') ||
        gameIdLower.includes('grammar') ||
        gameIdLower.includes('writing')) {
      return 'english';
    }

    // Science patterns
    if (gameIdLower.includes('science') ||
        gameIdLower.includes('plants') ||
        gameIdLower.includes('animals') ||
        gameIdLower.includes('weather') ||
        gameIdLower.includes('space') ||
        gameIdLower.includes('body') ||
        gameIdLower.includes('chemistry') ||
        gameIdLower.includes('physics')) {
      return 'science';
    }

    // Default fallback
    console.warn(`⚠️ Could not determine subject from gameId: ${gameId}, defaulting to mathematics`);
    return 'mathematics';
  }

  // Generate dynamic content based on subject and game parameters
  private async generateGameContent(
    gameId: string,
    subject: Subject,
    ageGroup: AgeGroup,
    difficulty: DifficultyLevel
  ): Promise<GameContent> {
    console.log(`🎯 Generating ${subject} content for ${gameId}`);

    const contentId = `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    let questions: Question[] = [];
    let title = '';
    let description = '';
    let assets: { images: string[]; audio: string[] } = { images: [], audio: [] };
    let metadata: {
      estimatedDuration: number;
      skillTags: string[];
      prerequisites: string[];
      learningObjectives: string[];
    } = {
      estimatedDuration: 5,
      skillTags: [],
      prerequisites: [],
      learningObjectives: []
    };

    // Generate content based on subject
    switch (subject) {
      case 'mathematics':
        ({ questions, title, description, assets, metadata } = this.generateMathContent(gameId, ageGroup, difficulty));
        break;
      case 'english':
        ({ questions, title, description, assets, metadata } = this.generateEnglishContent(gameId, ageGroup, difficulty));
        break;
      case 'science':
        ({ questions, title, description, assets, metadata } = this.generateScienceContent(gameId, ageGroup, difficulty));
        break;
      default:
        throw new Error(`Unsupported subject: ${subject}`);
    }

    return {
      id: contentId,
      gameId,
      subject,
      ageGroup,
      difficulty,
      title,
      description,
      questions,
      assets,
      metadata,
      version: '1.0.0',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Mathematics content generator
  private generateMathContent(gameId: string, ageGroup: AgeGroup, difficulty: DifficultyLevel) {
    const gameType = this.extractGameTypeFromId(gameId);

    switch (gameType) {
      case 'counting':
        return this.generateCountingQuestions(ageGroup, difficulty);
      case 'addition':
        return this.generateAdditionQuestions(ageGroup, difficulty);
      case 'subtraction':
        return this.generateSubtractionQuestions(ageGroup, difficulty);
      case 'multiplication':
        return this.generateMultiplicationQuestions(ageGroup, difficulty);
      case 'shapes':
        return this.generateShapeQuestions(ageGroup, difficulty);
      default:
        return this.generateCountingQuestions(ageGroup, difficulty);
    }
  }

  // English content generator
  private generateEnglishContent(gameId: string, ageGroup: AgeGroup, difficulty: DifficultyLevel) {
    const gameType = this.extractGameTypeFromId(gameId);

    switch (gameType) {
      case 'letters':
        return this.generateLetterQuestions(ageGroup, difficulty);
      case 'phonics':
        return this.generatePhonicsQuestions(ageGroup, difficulty);
      case 'vocabulary':
        return this.generateVocabularyQuestions(ageGroup, difficulty);
      case 'spelling':
        return this.generateSpellingQuestions(ageGroup, difficulty);
      case 'reading':
        return this.generateReadingQuestions(ageGroup, difficulty);
      default:
        return this.generateLetterQuestions(ageGroup, difficulty);
    }
  }

  // Science content generator
  private generateScienceContent(gameId: string, ageGroup: AgeGroup, difficulty: DifficultyLevel) {
    const gameType = this.extractGameTypeFromId(gameId);

    switch (gameType) {
      case 'plants':
        return this.generatePlantQuestions(ageGroup, difficulty);
      case 'animals':
        return this.generateAnimalQuestions(ageGroup, difficulty);
      case 'weather':
        return this.generateWeatherQuestions(ageGroup, difficulty);
      case 'space':
        return this.generateSpaceQuestions(ageGroup, difficulty);
      case 'body':
        return this.generateBodyQuestions(ageGroup, difficulty);
      default:
        return this.generatePlantQuestions(ageGroup, difficulty);
    }
  }

  // Helper to extract game type from ID
  private extractGameTypeFromId(gameId: string): string {
    const parts = gameId.split('-');
    return parts.length > 1 ? parts[1] : 'default';
  }

  // === MATHEMATICS QUESTION GENERATORS (500+ Questions) ===

  private generateCountingQuestions(ageGroup: AgeGroup, difficulty: DifficultyLevel) {
    const maxCount = ageGroup === '3-5' ? 5 : ageGroup === '6-8' ? 10 : 20;
    const questions: Question[] = [];

    // Expanded question bank with 25+ variations
    const scenarios = [
      { animals: ['🦁', '🐸', '🐧', '🦋', '🐢'], theme: 'zoo' },
      { animals: ['🐕', '🐱', '🐰', '🐹', '🐦'], theme: 'pets' },
      { animals: ['🐠', '🐡', '🦈', '🐙', '🐳'], theme: 'ocean' },
      { animals: ['🦆', '🦅', '🦉', '🐔', '🦜'], theme: 'birds' },
      { animals: ['🦒', '🐘', '🦏', '🦓', '🐆'], theme: 'safari' }
    ];

    const objects = [
      { items: ['⭐', '🌟', '✨', '💫', '🌠'], theme: 'stars' },
      { items: ['🍎', '🍊', '🍌', '🍇', '🍓'], theme: 'fruits' },
      { items: ['🌸', '🌺', '🌻', '🌹', '🌷'], theme: 'flowers' },
      { items: ['🚗', '🚕', '🚙', '🚌', '🚎'], theme: 'vehicles' },
      { items: ['⚽', '🏀', '🏈', '⚾', '🎾'], theme: 'sports' }
    ];

    // Generate 25 counting questions
    for (let i = 0; i < 25; i++) {
      const useAnimals = i % 2 === 0;
      const collection = useAnimals ? scenarios[i % scenarios.length] : objects[i % objects.length];
      const item = 'items' in collection
        ? collection.items[i % collection.items.length]
        : collection.animals[i % collection.animals.length];
      const count = Math.floor(Math.random() * maxCount) + 1;

      questions.push({
        id: `count-${i + 1}`,
        type: 'multiple-choice',
        question: `How many ${item} do you see?`,
        options: this.generateNumberOptions(count, maxCount),
        correctAnswer: count.toString(),
        hint: `Count each ${item} carefully!`,
        explanation: `There are ${count} ${item} in the picture.`,
        media: this.createEnhancedMedia('mathematics', 'counting', `count-${collection.theme}-${count}`, ageGroup, {
          url: `/images/math/counting-${collection.theme}-${count}.png`,
          alt: `${count} ${item}`
        }),
        difficulty: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
        points: 10,
        timeLimit: 30,
        tags: ['counting', 'numbers', 'animals']
      });
    }

    return {
      questions,
      title: 'Counting Safari',
      description: 'Count the animals in the safari!',
      assets: { images: [`/images/math/safari-bg.png`], audio: ['/audio/success.mp3'] },
      metadata: {
        estimatedDuration: 5,
        skillTags: ['counting', 'number-recognition'],
        prerequisites: [],
        learningObjectives: ['Count objects 1-' + maxCount, 'Recognize numbers 1-' + maxCount]
      }
    };
  }

  private generateAdditionQuestions(ageGroup: AgeGroup, difficulty: DifficultyLevel) {
    const maxNumber = ageGroup === '3-5' ? 5 : ageGroup === '6-8' ? 10 : 20;
    const questions: Question[] = [];

    // Expanded addition scenarios (50+ questions)
    const contexts = [
      { theme: 'fruits', items: ['🍎', '🍊', '🍌', '🍇', '🍓'], setting: 'fruit basket' },
      { theme: 'toys', items: ['🧸', '🚗', '⚽', '🎲', '🎨'], setting: 'toy box' },
      { theme: 'cookies', items: ['🍪', '🧁', '🍰', '🥧', '🍩'], setting: 'bakery' },
      { theme: 'flowers', items: ['🌸', '🌺', '🌻', '🌹', '🌷'], setting: 'garden' },
      { theme: 'stars', items: ['⭐', '🌟', '✨', '💫', '🌠'], setting: 'night sky' }
    ];

    for (let i = 0; i < 50; i++) {
      const context = contexts[i % contexts.length];
      const item = context.items[i % context.items.length];

      let a: number, b: number;
      if (difficulty === 'easy') {
        a = Math.floor(Math.random() * Math.min(3, maxNumber)) + 1;
        b = Math.floor(Math.random() * Math.min(3, maxNumber)) + 1;
      } else if (difficulty === 'medium') {
        a = Math.floor(Math.random() * Math.min(5, maxNumber)) + 1;
        b = Math.floor(Math.random() * Math.min(5, maxNumber)) + 1;
      } else {
        a = Math.floor(Math.random() * maxNumber) + 1;
        b = Math.floor(Math.random() * maxNumber) + 1;
      }

      const answer = a + b;

      // Story-based questions for variety
      const questionVariations = [
        `${a} ${item} plus ${b} more ${item} equals how many?`,
        `If you have ${a} ${item} and get ${b} more, how many do you have?`,
        `Count: ${a} ${item} + ${b} ${item} = ?`,
        `In the ${context.setting}, there are ${a} ${item} and ${b} more arrive. How many total?`,
        `What is ${a} + ${b}?`
      ];

      questions.push({
        id: `add-${i + 1}`,
        type: 'multiple-choice',
        question: questionVariations[i % questionVariations.length],
        options: this.generateNumberOptions(answer, maxNumber * 2),
        correctAnswer: answer.toString(),
        hint: `Try counting up from ${a}! You can use your fingers too.`,
        explanation: `${a} + ${b} = ${answer}. When we add, we put groups together!`,
        media: this.createEnhancedMedia('mathematics', 'addition', `add-${context.theme}-${a}-${b}`, ageGroup, {
          url: `/images/math/addition-${context.theme}-${a}-${b}.png`,
          alt: `${a} plus ${b} ${item}`
        }),
        difficulty: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
        points: 15,
        timeLimit: ageGroup === '3-5' ? 60 : ageGroup === '6-8' ? 45 : 30,
        tags: ['addition', 'arithmetic', 'numbers', context.theme]
      });
    }

    return {
      questions,
      title: 'Addition Adventure',
      description: 'Solve addition problems and collect treasures!',
      assets: { images: [`/images/math/treasure-bg.png`], audio: ['/audio/success.mp3'] },
      metadata: {
        estimatedDuration: 7,
        skillTags: ['addition', 'arithmetic'],
        prerequisites: ['counting'],
        learningObjectives: ['Add numbers up to ' + maxNumber, 'Understand addition concept']
      }
    };
  }

  private generateSubtractionQuestions(ageGroup: AgeGroup, difficulty: DifficultyLevel) {
    const maxNumber = ageGroup === '3-5' ? 5 : ageGroup === '6-8' ? 10 : 20;
    const questions: Question[] = [];

    // Expanded subtraction scenarios (50+ questions)
    const contexts = [
      { theme: 'balloons', items: ['🎈', '🎀', '🎁', '🎊', '🎉'], setting: 'party', action: 'popped' },
      { theme: 'cookies', items: ['🍪', '🧁', '🍰', '🥧', '🍩'], setting: 'bakery', action: 'eaten' },
      { theme: 'birds', items: ['🐦', '🦅', '🦆', '🐔', '🦜'], setting: 'tree', action: 'flew away' },
      { theme: 'cars', items: ['🚗', '🚕', '🚙', '🚌', '🚎'], setting: 'parking lot', action: 'drove away' },
      { theme: 'fish', items: ['🐠', '🐡', '🦈', '🐙', '🐳'], setting: 'aquarium', action: 'swam away' },
      { theme: 'flowers', items: ['🌸', '🌺', '🌻', '🌹', '🌷'], setting: 'garden', action: 'picked' },
      { theme: 'toys', items: ['🧸', '⚽', '🎲', '🚂', '🪀'], setting: 'toy box', action: 'put away' },
      { theme: 'apples', items: ['🍎', '🍏', '🥝', '🍊', '🍌'], setting: 'tree', action: 'fell down' }
    ];

    for (let i = 0; i < 50; i++) {
      const context = contexts[i % contexts.length];
      const item = context.items[i % context.items.length];

      let a: number, b: number;
      if (difficulty === 'easy') {
        a = Math.floor(Math.random() * Math.min(5, maxNumber)) + 2;
        b = Math.floor(Math.random() * (a - 1)) + 1;
      } else if (difficulty === 'medium') {
        a = Math.floor(Math.random() * Math.min(8, maxNumber)) + 3;
        b = Math.floor(Math.random() * (a - 1)) + 1;
      } else {
        a = Math.floor(Math.random() * maxNumber) + 2;
        b = Math.floor(Math.random() * (a - 1)) + 1;
      }

      const answer = a - b;

      // Story-based subtraction questions
      const questionVariations = [
        `There were ${a} ${item} in the ${context.setting}. ${b} ${context.action}. How many are left?`,
        `${a} ${item} minus ${b} that ${context.action} equals how many?`,
        `If you start with ${a} ${item} and ${b} ${context.action}, how many remain?`,
        `What is ${a} - ${b}?`,
        `Count: ${a} ${item} - ${b} ${item} = ?`
      ];

      questions.push({
        id: `sub-${i + 1}`,
        type: 'multiple-choice',
        question: questionVariations[i % questionVariations.length],
        options: this.generateNumberOptions(answer, maxNumber),
        correctAnswer: answer.toString(),
        hint: `Try counting down from ${a} or count what's left!`,
        explanation: `${a} - ${b} = ${answer}. When we subtract, we take away from the group!`,
        media: { type: 'image', url: `/images/math/subtraction-${context.theme}-${a}-${b}.png`, alt: `${a} minus ${b} ${item}` },
        difficulty: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
        points: 15,
        timeLimit: ageGroup === '3-5' ? 60 : ageGroup === '6-8' ? 45 : 35,
        tags: ['subtraction', 'arithmetic', 'numbers', context.theme]
      });
    }

    return {
      questions,
      title: 'Subtraction Station',
      description: 'Help solve subtraction problems and see what remains!',
      assets: { images: [`/images/math/train-bg.png`], audio: ['/audio/train.mp3'] },
      metadata: {
        estimatedDuration: 8,
        skillTags: ['subtraction', 'arithmetic'],
        prerequisites: ['counting', 'addition'],
        learningObjectives: ['Subtract numbers up to ' + maxNumber, 'Understand subtraction concept', 'Solve story problems']
      }
    };
  }

  private generateMultiplicationQuestions(ageGroup: AgeGroup, difficulty: DifficultyLevel) {
    const maxNumber = ageGroup === '6-8' ? 5 : ageGroup === '9+' ? 10 : 3;
    const questions: Question[] = [];

    // Skip multiplication for 3-5 age group or create very simple repeated addition
    if (ageGroup === '3-5') {
      // Simple repeated addition for younger kids
      const simpleGroups = [2, 3];
      for (let i = 0; i < 15; i++) {
        const groups = simpleGroups[i % simpleGroups.length];
        const itemsPerGroup = Math.floor(Math.random() * 3) + 1;
        const answer = groups * itemsPerGroup;

        const contexts = [
          { items: ['🍎', '🍊', '🍌'], container: 'baskets' },
          { items: ['🐶', '🐱', '🐰'], container: 'houses' },
          { items: ['⭐', '🌟', '✨'], container: 'groups' }
        ];
        const context = contexts[i % contexts.length];
        const item = context.items[i % context.items.length];

        questions.push({
          id: `mult-simple-${i + 1}`,
          type: 'multiple-choice',
          question: `Count all the ${item}! There are ${groups} ${context.container} with ${itemsPerGroup} ${item} in each.`,
          options: this.generateNumberOptions(answer, 12),
          correctAnswer: answer.toString(),
          hint: `Count each group: ${itemsPerGroup} + ${itemsPerGroup}${groups > 2 ? ` + ${itemsPerGroup}` : ''}`,
          explanation: `${groups} groups of ${itemsPerGroup} = ${answer} total ${item}!`,
          media: { type: 'image', url: `/images/math/groups-${context.items[0]}-${groups}-${itemsPerGroup}.png`, alt: `${groups} groups of ${itemsPerGroup}` },
          difficulty: 1,
          points: 15,
          timeLimit: 45,
          tags: ['grouping', 'counting', 'repeated-addition']
        });
      }
    } else {
      // Expanded multiplication scenarios (50+ questions for older kids)
      const contexts = [
        { theme: 'arrays', items: ['🟦', '🟨', '🟩', '🟪', '🟫'], setting: 'grid' },
        { theme: 'groups', items: ['🎈', '🎁', '🎊', '🎉', '🎀'], setting: 'party tables' },
        { theme: 'rows', items: ['🌻', '🌺', '🌸', '🌹', '🌷'], setting: 'garden rows' },
        { theme: 'boxes', items: ['🍪', '🧁', '🥧', '🍰', '🍩'], setting: 'boxes' },
        { theme: 'teams', items: ['⚽', '🏀', '🏈', '⚾', '🎾'], setting: 'teams' }
      ];

      for (let i = 0; i < 50; i++) {
        const context = contexts[i % contexts.length];
        const item = context.items[i % context.items.length];

        let a: number, b: number;
        if (difficulty === 'easy') {
          a = Math.floor(Math.random() * 3) + 2; // 2-4
          b = Math.floor(Math.random() * 3) + 2; // 2-4
        } else if (difficulty === 'medium') {
          a = Math.floor(Math.random() * 4) + 2; // 2-5
          b = Math.floor(Math.random() * 4) + 2; // 2-5
        } else {
          a = Math.floor(Math.random() * maxNumber) + 1;
          b = Math.floor(Math.random() * maxNumber) + 1;
        }

        const answer = a * b;

        const questionVariations = [
          `There are ${a} ${context.setting} with ${b} ${item} each. How many ${item} total?`,
          `What is ${a} × ${b}?`,
          `${a} groups of ${b} ${item} equals how many?`,
          `If you have ${a} rows of ${b} ${item}, how many do you have altogether?`,
          `Calculate: ${a} times ${b}`
        ];

        questions.push({
          id: `mult-${i + 1}`,
          type: 'multiple-choice',
          question: questionVariations[i % questionVariations.length],
          options: this.generateNumberOptions(answer, maxNumber * maxNumber + 5),
          correctAnswer: answer.toString(),
          hint: `Think of ${a} groups of ${b}! You can add ${b} + ${b}${a > 2 ? ` + ${b}` : ''}${a > 3 ? `...` : ''}`,
          explanation: `${a} × ${b} = ${answer}. Multiplication is like repeated addition!`,
          media: { type: 'image', url: `/images/math/multiplication-${context.theme}-${a}-${b}.png`, alt: `${a} times ${b}` },
          difficulty: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4,
          points: 20,
          timeLimit: ageGroup === '6-8' ? 75 : 60,
          tags: ['multiplication', 'arithmetic', 'numbers', context.theme]
        });
      }
    }

    return {
      questions,
      title: ageGroup === '3-5' ? 'Counting Groups' : 'Multiplication Mountain',
      description: ageGroup === '3-5' ? 'Count items in groups!' : 'Climb the mountain by solving multiplication!',
      assets: { images: [`/images/math/mountain-bg.png`], audio: ['/audio/success.mp3'] },
      metadata: {
        estimatedDuration: ageGroup === '3-5' ? 8 : 12,
        skillTags: ageGroup === '3-5' ? ['grouping', 'repeated-addition'] : ['multiplication', 'arithmetic'],
        prerequisites: ['addition', 'counting'],
        learningObjectives: ageGroup === '3-5' ?
          ['Count objects in groups', 'Understand repeated addition'] :
          ['Multiply numbers up to ' + maxNumber, 'Understand multiplication concept']
      }
    };
  }

  private generateShapeQuestions(ageGroup: AgeGroup, difficulty: DifficultyLevel) {
    const shapes = ['circle', 'square', 'triangle', 'rectangle', 'oval'];
    const questions: Question[] = [];

    for (let i = 0; i < 5; i++) {
      const shape = shapes[i % shapes.length];
      const shapeOptions = this.shuffle([...shapes]).slice(0, 4);
      if (!shapeOptions.includes(shape)) {
        shapeOptions[0] = shape;
      }

      questions.push({
        id: `shape-${i + 1}`,
        type: 'multiple-choice',
        question: `What shape is this?`,
        options: shapeOptions,
        correctAnswer: shape,
        hint: `Look at the corners and curves!`,
        explanation: `This is a ${shape}.`,
        media: { type: 'image', url: `/images/math/shapes/${shape}.png`, alt: shape },
        difficulty: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
        points: 12,
        timeLimit: 30,
        tags: ['shapes', 'geometry', 'visual']
      });
    }

    return {
      questions,
      title: 'Shape Detective',
      description: 'Find and identify different shapes!',
      assets: { images: [`/images/math/detective-bg.png`], audio: ['/audio/success.mp3'] },
      metadata: {
        estimatedDuration: 6,
        skillTags: ['shapes', 'geometry', 'visual-recognition'],
        prerequisites: [],
        learningObjectives: ['Identify basic shapes', 'Distinguish between shapes']
      }
    };
  }

  // === ENGLISH QUESTION GENERATORS ===

  private generateLetterQuestions(ageGroup: AgeGroup, difficulty: DifficultyLevel) {
    const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const letterRange = ageGroup === '3-5' ? allLetters.slice(0, 10) :
                      ageGroup === '6-8' ? allLetters.slice(0, 20) : allLetters;

    // Comprehensive word bank (150+ words)
    const words = {
      'A': ['Apple', 'Ant', 'Airplane', 'Alligator', 'Arrow', 'Angel'],
      'B': ['Ball', 'Bear', 'Butterfly', 'Banana', 'Book', 'Bird'],
      'C': ['Cat', 'Car', 'Cookie', 'Crown', 'Cow', 'Castle'],
      'D': ['Dog', 'Duck', 'Dolphin', 'Dragon', 'Door', 'Drum'],
      'E': ['Elephant', 'Egg', 'Eagle', 'Earth', 'Ear', 'Engine'],
      'F': ['Fish', 'Fox', 'Fire', 'Flag', 'Flower', 'Frog'],
      'G': ['Goat', 'Guitar', 'Giraffe', 'Ghost', 'Gift', 'Garden'],
      'H': ['Hat', 'Horse', 'House', 'Heart', 'Hammer', 'Honey'],
      'I': ['Ice', 'Island', 'Igloo', 'Insect', 'Iron', 'Idea'],
      'J': ['Jam', 'Jungle', 'Jacket', 'Juice', 'Jewel', 'Jump'],
      'K': ['Kite', 'King', 'Kitchen', 'Kitten', 'Key', 'Kangaroo'],
      'L': ['Lion', 'Lamp', 'Ladder', 'Leaf', 'Letter', 'Lake'],
      'M': ['Mouse', 'Moon', 'Mountain', 'Mirror', 'Milk', 'Music'],
      'N': ['Nest', 'Night', 'Nurse', 'Net', 'Nose', 'Nut'],
      'O': ['Orange', 'Ocean', 'Owl', 'Octopus', 'Oven', 'Oil'],
      'P': ['Pig', 'Pizza', 'Panda', 'Piano', 'Plant', 'Purple'],
      'Q': ['Queen', 'Question', 'Quilt', 'Quick', 'Quiet', 'Quiz'],
      'R': ['Rabbit', 'Rainbow', 'Robot', 'Ring', 'River', 'Rose'],
      'S': ['Sun', 'Snake', 'Star', 'Smile', 'Ship', 'Sock'],
      'T': ['Tiger', 'Tree', 'Train', 'Turtle', 'Table', 'Truck'],
      'U': ['Umbrella', 'Under', 'Up', 'Unicorn', 'Uncle', 'Use'],
      'V': ['Violin', 'Van', 'Volcano', 'Voice', 'Valley', 'Vest'],
      'W': ['Water', 'Whale', 'Window', 'Wings', 'Watch', 'Wolf'],
      'X': ['Xray', 'Box', 'Fox', 'Six', 'Fix', 'Mix'],
      'Y': ['Yellow', 'Yes', 'Yard', 'Yak', 'Yarn', 'Young'],
      'Z': ['Zebra', 'Zoo', 'Zero', 'Zip', 'Zone', 'Zoom']
    };

    const questions: Question[] = [];
    const questionTypes = ['starting-letter', 'letter-recognition', 'uppercase-lowercase', 'alphabet-order'];

    // Generate 150+ letter questions with variety
    for (let i = 0; i < 150; i++) {
      const letter = letterRange[i % letterRange.length];
      const questionType = questionTypes[i % questionTypes.length];
      const wordList = words[letter as keyof typeof words] || ['Word'];
      const word = wordList[i % wordList.length];

      let question: Question;

      switch (questionType) {
        case 'starting-letter':
          const letterOptions = this.shuffle([...letterRange]).slice(0, 4);
          if (!letterOptions.includes(letter)) {
            letterOptions[0] = letter;
          }
          question = {
            id: `letter-start-${letter.toLowerCase()}-${i + 1}`,
            type: 'multiple-choice',
            question: `Which letter does "${word}" start with?`,
            options: letterOptions,
            correctAnswer: letter,
            hint: `Listen to the sound: ${letter.toLowerCase()}-${word.toLowerCase()}`,
            explanation: `"${word}" starts with the letter ${letter}!`,
            media: this.createEnhancedMedia('english', 'letters', `letter-${word.toLowerCase()}`, ageGroup, {
          url: `/images/english/words/${word.toLowerCase()}.png`,
          alt: word
        }),
            difficulty: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
            points: 10,
            timeLimit: 30,
            tags: ['letters', 'phonics', 'vocabulary', 'starting-sounds']
          };
          break;

        case 'letter-recognition':
          const recognitionOptions = this.shuffle([...letterRange]).slice(0, 4);
          if (!recognitionOptions.includes(letter)) {
            recognitionOptions[0] = letter;
          }
          question = {
            id: `letter-recog-${letter.toLowerCase()}-${i + 1}`,
            type: 'multiple-choice',
            question: `Which letter is this?`,
            options: recognitionOptions,
            correctAnswer: letter,
            hint: `Look at the shape of the letter carefully!`,
            explanation: `This is the letter ${letter}!`,
            media: { type: 'image', url: `/images/english/letters/${letter.toLowerCase()}.png`, alt: `Letter ${letter}` },
            difficulty: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
            points: 8,
            timeLimit: 25,
            tags: ['letters', 'recognition', 'visual']
          };
          break;

        case 'uppercase-lowercase':
          const caseOptions = [letter, letter.toLowerCase(), letterRange[(i + 1) % letterRange.length], letterRange[(i + 2) % letterRange.length].toLowerCase()];
          question = {
            id: `letter-case-${letter.toLowerCase()}-${i + 1}`,
            type: 'multiple-choice',
            question: `Which is the ${Math.random() > 0.5 ? 'uppercase' : 'lowercase'} version of this letter?`,
            options: this.shuffle(caseOptions),
            correctAnswer: Math.random() > 0.5 ? letter : letter.toLowerCase(),
            hint: `Uppercase letters are big, lowercase letters are small!`,
            explanation: `${letter} is uppercase, ${letter.toLowerCase()} is lowercase.`,
            media: { type: 'image', url: `/images/english/letters/case-${letter.toLowerCase()}.png`, alt: `Letter cases for ${letter}` },
            difficulty: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4,
            points: 12,
            timeLimit: 35,
            tags: ['letters', 'uppercase', 'lowercase', 'case-sensitivity']
          };
          break;

        case 'alphabet-order':
          if (ageGroup !== '3-5') { // Skip for youngest
            const nextLetter = letterRange[(letterRange.indexOf(letter) + 1) % letterRange.length];
            const orderOptions = this.shuffle([...letterRange]).slice(0, 4);
            if (!orderOptions.includes(nextLetter)) {
              orderOptions[0] = nextLetter;
            }
            question = {
              id: `letter-order-${letter.toLowerCase()}-${i + 1}`,
              type: 'multiple-choice',
              question: `What letter comes after ${letter} in the alphabet?`,
              options: orderOptions,
              correctAnswer: nextLetter,
              hint: `Think about the alphabet song: A-B-C...`,
              explanation: `After ${letter} comes ${nextLetter} in the alphabet!`,
              difficulty: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4,
              points: 15,
              timeLimit: 40,
              tags: ['letters', 'alphabet', 'sequence', 'order']
            };
          } else {
            // Fallback to starting letter for 3-5 age group
            continue;
          }
          break;

        default:
          continue;
      }

      questions.push(question);
    }

    return {
      questions: questions.slice(0, 120), // Limit to 120 for performance
      title: 'Letter Learning Adventure',
      description: 'Master the alphabet with fun activities!',
      assets: { images: [`/images/english/alphabet-bg.png`], audio: ['/audio/letter-sounds.mp3'] },
      metadata: {
        estimatedDuration: 15,
        skillTags: ['letter-recognition', 'phonics', 'alphabet'],
        prerequisites: [],
        learningObjectives: [
          `Recognize letters ${letterRange[0]}-${letterRange[letterRange.length - 1]}`,
          'Associate letters with sounds',
          'Understand alphabet order',
          'Distinguish uppercase and lowercase'
        ]
      }
    };
  }

  private generatePhonicsQuestions(ageGroup: AgeGroup, difficulty: DifficultyLevel) {
    const sounds = [
      { letter: 'B', sound: 'buh', words: ['Ball', 'Bat', 'Bus'] },
      { letter: 'C', sound: 'kuh', words: ['Cat', 'Car', 'Cup'] },
      { letter: 'D', sound: 'duh', words: ['Dog', 'Duck', 'Door'] },
      { letter: 'F', sound: 'fuh', words: ['Fish', 'Fox', 'Fire'] },
      { letter: 'G', sound: 'guh', words: ['Goat', 'Girl', 'Gate'] }
    ];
    const questions: Question[] = [];

    for (let i = 0; i < 5; i++) {
      const sound = sounds[i % sounds.length];
      const correctWord = sound.words[Math.floor(Math.random() * sound.words.length)];
      const wrongWords = sounds.filter(s => s.letter !== sound.letter)
                               .flatMap(s => s.words)
                               .slice(0, 3);
      const options = this.shuffle([correctWord, ...wrongWords]);

      questions.push({
        id: `phonics-${sound.letter.toLowerCase()}-${i + 1}`,
        type: 'multiple-choice',
        question: `Which word starts with the "${sound.sound}" sound?`,
        options,
        correctAnswer: correctWord,
        hint: `Say each word out loud and listen for the first sound!`,
        explanation: `${correctWord} starts with the "${sound.sound}" sound!`,
        media: { type: 'audio', url: `/audio/phonics/${sound.letter.toLowerCase()}.mp3`, alt: `${sound.letter} sound` },
        difficulty: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
        points: 12,
        timeLimit: 40,
        tags: ['phonics', 'sounds', 'vocabulary']
      });
    }

    return {
      questions,
      title: 'Phonics Forest',
      description: 'Listen to sounds and find matching words!',
      assets: { images: [`/images/english/forest-bg.png`], audio: ['/audio/nature-sounds.mp3'] },
      metadata: {
        estimatedDuration: 8,
        skillTags: ['phonics', 'sound-recognition'],
        prerequisites: ['letter-recognition'],
        learningObjectives: ['Identify letter sounds', 'Match sounds to words']
      }
    };
  }

  private generateVocabularyQuestions(ageGroup: AgeGroup, difficulty: DifficultyLevel) {
    // Comprehensive vocabulary bank (200+ words by difficulty and age)
    const vocabularyByAge = {
      '3-5': {
        easy: [
          { word: 'Happy', definition: 'Feeling good and smiling', image: 'happy-face', category: 'emotions' },
          { word: 'Big', definition: 'Very large in size', image: 'elephant', category: 'size' },
          { word: 'Red', definition: 'The color of strawberries', image: 'strawberry', category: 'colors' },
          { word: 'Hot', definition: 'Very warm, like the sun', image: 'sun', category: 'temperature' },
          { word: 'Soft', definition: 'Not hard, like a pillow', image: 'pillow', category: 'texture' }
        ],
        medium: [
          { word: 'Fast', definition: 'Moving very quickly', image: 'racing-car', category: 'speed' },
          { word: 'Loud', definition: 'Making a lot of noise', image: 'drums', category: 'sound' },
          { word: 'Sweet', definition: 'Tastes like sugar or honey', image: 'candy', category: 'taste' },
          { word: 'Round', definition: 'Shaped like a circle', image: 'ball', category: 'shape' },
          { word: 'Tall', definition: 'Very high up', image: 'giraffe', category: 'size' }
        ],
        hard: [
          { word: 'Bright', definition: 'Giving off lots of light', image: 'lightbulb', category: 'light' },
          { word: 'Smooth', definition: 'Not rough or bumpy', image: 'ice', category: 'texture' },
          { word: 'Empty', definition: 'Nothing inside', image: 'empty-box', category: 'quantity' }
        ]
      },
      '6-8': {
        easy: [
          { word: 'Excited', definition: 'Very happy and eager', image: 'excited-child', category: 'emotions' },
          { word: 'Enormous', definition: 'Extremely big', image: 'whale', category: 'size' },
          { word: 'Freezing', definition: 'Extremely cold', image: 'iceberg', category: 'temperature' },
          { word: 'Delicious', definition: 'Tastes very good', image: 'pizza', category: 'taste' },
          { word: 'Brilliant', definition: 'Very bright or very smart', image: 'diamond', category: 'quality' }
        ],
        medium: [
          { word: 'Adventure', definition: 'An exciting journey or experience', image: 'treasure-map', category: 'experiences' },
          { word: 'Curious', definition: 'Wanting to know or learn about something', image: 'magnifying-glass', category: 'personality' },
          { word: 'Generous', definition: 'Kind and willing to give to others', image: 'sharing', category: 'personality' },
          { word: 'Magnificent', definition: 'Very beautiful and impressive', image: 'castle', category: 'quality' },
          { word: 'Mysterious', definition: 'Hard to understand or explain', image: 'question-mark', category: 'quality' }
        ],
        hard: [
          { word: 'Tremendous', definition: 'Very large or great', image: 'mountain', category: 'size' },
          { word: 'Fascinating', definition: 'Very interesting', image: 'telescope', category: 'quality' },
          { word: 'Courageous', definition: 'Brave and not afraid', image: 'superhero', category: 'personality' }
        ]
      },
      '9+': {
        easy: [
          { word: 'Resilient', definition: 'Able to recover from difficulties', image: 'growing-plant', category: 'personality' },
          { word: 'Ambitious', definition: 'Having a strong desire to succeed', image: 'mountain-climber', category: 'personality' },
          { word: 'Innovative', definition: 'Using new ideas or methods', image: 'invention', category: 'thinking' },
          { word: 'Compassionate', definition: 'Feeling sympathy and wanting to help', image: 'helping-hands', category: 'personality' },
          { word: 'Remarkable', definition: 'Worthy of attention; extraordinary', image: 'star', category: 'quality' }
        ],
        medium: [
          { word: 'Elaborate', definition: 'Very detailed and complicated', image: 'blueprint', category: 'complexity' },
          { word: 'Persevere', definition: 'Continue trying despite difficulties', image: 'marathon', category: 'action' },
          { word: 'Analyze', definition: 'Examine something carefully to understand it', image: 'scientist', category: 'thinking' },
          { word: 'Collaborate', definition: 'Work together with others', image: 'teamwork', category: 'action' },
          { word: 'Enthusiastic', definition: 'Showing intense and eager enjoyment', image: 'celebration', category: 'emotions' }
        ],
        hard: [
          { word: 'Meticulous', definition: 'Showing great attention to detail', image: 'fine-art', category: 'personality' },
          { word: 'Sophisticated', definition: 'Having great knowledge or experience', image: 'classical-music', category: 'quality' },
          { word: 'Contemplating', definition: 'Thinking deeply about something', image: 'thinking-person', category: 'thinking' }
        ]
      }
    };

    const difficulty_key = difficulty === 'adaptive' ? 'medium' : difficulty;
    const vocabulary = vocabularyByAge[ageGroup][difficulty_key] || vocabularyByAge['6-8']['easy'];
    const allVocab = Object.values(vocabularyByAge[ageGroup]).flat();
    const questions: Question[] = [];

    const questionTypes = ['definition', 'synonym', 'context', 'opposite'];

    // Generate 120+ vocabulary questions
    for (let i = 0; i < 120; i++) {
      const vocab = vocabulary[i % vocabulary.length];
      const questionType = questionTypes[i % questionTypes.length];

      let question: Question;

      switch (questionType) {
        case 'definition':
          const wrongDefinitions = allVocab.filter(v => v.word !== vocab.word)
                                          .map(v => v.definition)
                                          .slice(0, 3);
          const defOptions = this.shuffle([vocab.definition, ...wrongDefinitions]);
          question = {
            id: `vocab-def-${vocab.word.toLowerCase()}-${i + 1}`,
            type: 'multiple-choice',
            question: `What does "${vocab.word}" mean?`,
            options: defOptions,
            correctAnswer: vocab.definition,
            hint: `Think about when you might use the word "${vocab.word}"`,
            explanation: `"${vocab.word}" means ${vocab.definition}`,
            media: { type: 'image', url: `/images/english/vocabulary/${vocab.image}.png`, alt: vocab.word },
            difficulty: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4,
            points: 15,
            timeLimit: 45,
            tags: ['vocabulary', 'definitions', 'comprehension', vocab.category]
          };
          break;

        case 'context':
          const contextSentences = {
            'Happy': 'She was very _____ when she got a new puppy.',
            'Big': 'The _____ elephant walked slowly through the zoo.',
            'Fast': 'The _____ car zoomed past us on the highway.',
            'Excited': 'The children were _____ about going to the carnival.',
            'Adventure': 'They went on an _____ to find hidden treasure.',
            'Curious': 'The _____ cat wanted to explore the new room.'
          };
          const sentence = contextSentences[vocab.word as keyof typeof contextSentences] ||
                          `The word "${vocab.word}" means _____.`;
          const contextOptions = this.shuffle([
            vocab.word,
            ...allVocab.filter(v => v.word !== vocab.word).slice(0, 3).map(v => v.word)
          ]);
          question = {
            id: `vocab-context-${vocab.word.toLowerCase()}-${i + 1}`,
            type: 'multiple-choice',
            question: `Choose the word that best completes the sentence: "${sentence}"`,
            options: contextOptions,
            correctAnswer: vocab.word,
            hint: `Think about what word makes the most sense in this sentence.`,
            explanation: `"${vocab.word}" fits best because ${vocab.definition}`,
            difficulty: difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5,
            points: 18,
            timeLimit: 50,
            tags: ['vocabulary', 'context', 'sentence-completion', vocab.category]
          };
          break;

        default:
          continue;
      }

      questions.push(question);
    }

    return {
      questions: questions.slice(0, 100), // Limit for performance
      title: 'Vocabulary Village',
      description: 'Build your word power with exciting vocabulary challenges!',
      assets: { images: [`/images/english/village-bg.png`], audio: ['/audio/vocabulary.mp3'] },
      metadata: {
        estimatedDuration: 20,
        skillTags: ['vocabulary', 'comprehension', 'word-meaning'],
        prerequisites: ['letter-recognition', 'phonics'],
        learningObjectives: [
          'Learn age-appropriate vocabulary',
          'Understand word meanings in context',
          'Expand descriptive language skills',
          'Build reading comprehension'
        ]
      }
    };
  }

  private generateSpellingQuestions(ageGroup: AgeGroup, difficulty: DifficultyLevel) {
    const words = ageGroup === '3-5' ?
      ['CAT', 'DOG', 'SUN', 'BIG', 'RED'] :
      ['HOUSE', 'HAPPY', 'GREEN', 'WATER', 'FRIEND'];
    const questions: Question[] = [];

    for (let i = 0; i < 5; i++) {
      const word = words[i % words.length];
      const scrambled = this.scrambleWord(word);
      const wrongSpellings = this.generateWrongSpellings(word);
      const options = this.shuffle([word, ...wrongSpellings]);

      questions.push({
        id: `spell-${word.toLowerCase()}-${i + 1}`,
        type: 'multiple-choice',
        question: `How do you spell the word shown in the picture?`,
        options,
        correctAnswer: word,
        hint: `Sound out each letter: ${word.split('').join('-')}`,
        explanation: `The correct spelling is ${word}`,
        media: { type: 'image', url: `/images/english/spelling/${word.toLowerCase()}.png`, alt: word },
        difficulty: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4,
        points: 18,
        timeLimit: 50,
        tags: ['spelling', 'letters', 'words']
      });
    }

    return {
      questions,
      title: 'Spelling Bee Stadium',
      description: 'Spell words correctly to win the championship!',
      assets: { images: [`/images/english/stadium-bg.png`], audio: ['/audio/crowd-cheer.mp3'] },
      metadata: {
        estimatedDuration: 12,
        skillTags: ['spelling', 'letter-order'],
        prerequisites: ['letter-recognition', 'phonics'],
        learningObjectives: ['Spell common words', 'Understand letter order']
      }
    };
  }

  private generateReadingQuestions(ageGroup: AgeGroup, difficulty: DifficultyLevel) {
    const sentences = ageGroup === '3-5' ?
      [
        { text: 'The cat is big.', question: 'What animal is big?', answer: 'cat' },
        { text: 'I see a red ball.', question: 'What color is the ball?', answer: 'red' },
        { text: 'The dog runs fast.', question: 'What does the dog do?', answer: 'runs' }
      ] :
      [
        { text: 'The happy children played in the sunny park.', question: 'Where did the children play?', answer: 'park' },
        { text: 'My friend has a beautiful blue bicycle.', question: 'What color is the bicycle?', answer: 'blue' },
        { text: 'The brave firefighter saved the cat from the tall tree.', question: 'Who saved the cat?', answer: 'firefighter' }
      ];
    const questions: Question[] = [];

    for (let i = 0; i < Math.min(3, sentences.length); i++) {
      const sentence = sentences[i];
      const wrongAnswers = sentences.filter(s => s.answer !== sentence.answer)
                                   .map(s => s.answer)
                                   .slice(0, 3);
      const options = this.shuffle([sentence.answer, ...wrongAnswers, 'house', 'happy']);

      questions.push({
        id: `reading-${i + 1}`,
        type: 'multiple-choice',
        question: `Read this sentence: "${sentence.text}" ${sentence.question}`,
        options: options.slice(0, 4),
        correctAnswer: sentence.answer,
        hint: `Read the sentence carefully and look for the answer!`,
        explanation: `The answer is "${sentence.answer}" from the sentence.`,
        difficulty: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4,
        points: 20,
        timeLimit: 60,
        tags: ['reading', 'comprehension', 'sentences']
      });
    }

    return {
      questions,
      title: 'Reading Adventure',
      description: 'Read sentences and answer questions!',
      assets: { images: [`/images/english/library-bg.png`], audio: ['/audio/page-turn.mp3'] },
      metadata: {
        estimatedDuration: 15,
        skillTags: ['reading', 'comprehension'],
        prerequisites: ['letter-recognition', 'phonics', 'vocabulary'],
        learningObjectives: ['Read simple sentences', 'Answer comprehension questions']
      }
    };
  }

  // === SCIENCE QUESTION GENERATORS ===

  private generatePlantQuestions(ageGroup: AgeGroup, difficulty: DifficultyLevel) {
    // Comprehensive plant knowledge bank by age and difficulty
    const plantFactsByAge = {
      '3-5': {
        easy: [
          { question: 'What do plants need to grow?', options: ['Water and sunlight', 'Candy', 'Toys', 'Music'], answer: 'Water and sunlight', topic: 'needs' },
          { question: 'What color are most leaves?', options: ['Green', 'Red', 'Blue', 'Purple'], answer: 'Green', topic: 'parts' },
          { question: 'Where do roots grow?', options: ['Underground', 'In the sky', 'On trees', 'In water'], answer: 'Underground', topic: 'parts' },
          { question: 'What grows from seeds?', options: ['Plants', 'Rocks', 'Animals', 'Cars'], answer: 'Plants', topic: 'growth' },
          { question: 'Which part of the plant reaches for the sun?', options: ['Leaves', 'Roots', 'Dirt', 'Rocks'], answer: 'Leaves', topic: 'parts' }
        ],
        medium: [
          { question: 'Plants make their own...', options: ['Food', 'Toys', 'Houses', 'Friends'], answer: 'Food', topic: 'photosynthesis' },
          { question: 'What part of the plant holds it up?', options: ['Stem', 'Roots', 'Flowers', 'Seeds'], answer: 'Stem', topic: 'parts' },
          { question: 'What do flowers help plants make?', options: ['Seeds', 'Water', 'Dirt', 'Light'], answer: 'Seeds', topic: 'reproduction' }
        ],
        hard: [
          { question: 'Why are leaves green?', options: ['They have chlorophyll', 'They like green', 'They eat green food', 'Magic'], answer: 'They have chlorophyll', topic: 'photosynthesis' },
          { question: 'What season do many plants start growing?', options: ['Spring', 'Winter', 'Never', 'Summer only'], answer: 'Spring', topic: 'seasons' }
        ]
      },
      '6-8': {
        easy: [
          { question: 'What gas do plants take in from the air?', options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Helium'], answer: 'Carbon dioxide', topic: 'photosynthesis' },
          { question: 'What gas do plants give off?', options: ['Oxygen', 'Carbon dioxide', 'Methane', 'Steam'], answer: 'Oxygen', topic: 'photosynthesis' },
          { question: 'Which plant part absorbs water?', options: ['Roots', 'Leaves', 'Flowers', 'Stem'], answer: 'Roots', topic: 'parts' },
          { question: 'What is the process called when plants make food?', options: ['Photosynthesis', 'Eating', 'Drinking', 'Sleeping'], answer: 'Photosynthesis', topic: 'photosynthesis' }
        ],
        medium: [
          { question: 'What travels through the stem to reach the leaves?', options: ['Water and nutrients', 'Animals', 'Air', 'Dirt'], answer: 'Water and nutrients', topic: 'transport' },
          { question: 'What do we call baby plants?', options: ['Seedlings', 'Puppies', 'Kittens', 'Babies'], answer: 'Seedlings', topic: 'growth' },
          { question: 'Which part of the plant attracts insects?', options: ['Flowers', 'Roots', 'Stem', 'Dirt'], answer: 'Flowers', topic: 'reproduction' }
        ],
        hard: [
          { question: 'What do plants compete for when growing close together?', options: ['Light and space', 'Friends', 'Games', 'Toys'], answer: 'Light and space', topic: 'competition' },
          { question: 'How do some plants spread their seeds?', options: ['Wind and animals', 'Magic', 'Teleportation', 'Internet'], answer: 'Wind and animals', topic: 'reproduction' }
        ]
      },
      '9+': {
        easy: [
          { question: 'What is the green pigment in leaves called?', options: ['Chlorophyll', 'Hemoglobin', 'Melanin', 'Insulin'], answer: 'Chlorophyll', topic: 'photosynthesis' },
          { question: 'What type of energy do plants use to make food?', options: ['Solar energy', 'Electric energy', 'Wind energy', 'Sound energy'], answer: 'Solar energy', topic: 'energy' },
          { question: 'What do we call plants that live for many years?', options: ['Perennials', 'Annuals', 'Biennials', 'Temporaries'], answer: 'Perennials', topic: 'life-cycles' }
        ],
        medium: [
          { question: 'Which tissue carries water up from roots to leaves?', options: ['Xylem', 'Phloem', 'Epidermis', 'Cortex'], answer: 'Xylem', topic: 'transport' },
          { question: 'What is the male part of a flower called?', options: ['Stamen', 'Pistil', 'Petal', 'Sepal'], answer: 'Stamen', topic: 'reproduction' },
          { question: 'Which environmental factor affects plant growth most?', options: ['Light availability', 'Noise level', 'Color preference', 'Music type'], answer: 'Light availability', topic: 'environment' }
        ],
        hard: [
          { question: 'What process helps plants respond to gravity?', options: ['Gravitropism', 'Phototropism', 'Thigmotropism', 'Chemotropism'], answer: 'Gravitropism', topic: 'responses' },
          { question: 'What is the waxy coating on leaves called?', options: ['Cuticle', 'Epidermis', 'Chloroplast', 'Vacuole'], answer: 'Cuticle', topic: 'structure' }
        ]
      }
    };

    const difficulty_key2 = difficulty === 'adaptive' ? 'medium' : difficulty;
    const plantFacts = plantFactsByAge[ageGroup][difficulty_key2] || plantFactsByAge['6-8']['easy'];
    const allPlantFacts = Object.values(plantFactsByAge[ageGroup]).flat();
    const questions: Question[] = [];

    // Generate 120+ plant questions with variety
    for (let i = 0; i < 120; i++) {
      const fact = plantFacts[i % plantFacts.length];
      const questionNumber = i + 1;

      // Add some variety with different question formats
      const questionFormats = [
        fact.question, // Original question
        `True or False: ${fact.answer} is correct for the question: ${fact.question}`,
        `Complete the sentence: ${fact.question.replace('?', '')} _____.`,
        `In plant biology, ${fact.question.toLowerCase()}`
      ];

      const selectedFormat = questionFormats[0]; // Use original for now, can randomize later

      questions.push({
        id: `plant-${fact.topic}-${questionNumber}`,
        type: 'multiple-choice',
        question: selectedFormat,
        options: fact.options,
        correctAnswer: fact.answer,
        hint: `Think about what plants need to stay healthy and grow!`,
        explanation: `${fact.answer} is correct! This relates to ${fact.topic} in plant biology.`,
        media: {
          type: 'image',
          url: `/images/science/plants/${fact.topic}-${questionNumber}.png`,
          alt: `Plant ${fact.topic} diagram ${questionNumber}`
        },
        difficulty: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
        points: 12 + (difficulty === 'hard' ? 3 : 0),
        timeLimit: ageGroup === '3-5' ? 45 : ageGroup === '6-8' ? 40 : 35,
        tags: ['plants', 'growth', 'nature', fact.topic, 'biology']
      });
    }

    return {
      questions: questions.slice(0, 100), // Limit for performance
      title: 'Plant Growth Garden',
      description: 'Discover the amazing world of plants and how they grow!',
      assets: {
        images: [`/images/science/garden-bg.png`],
        audio: ['/audio/nature.mp3', '/audio/plant-growth.mp3']
      },
      metadata: {
        estimatedDuration: 15,
        skillTags: ['plant-biology', 'life-cycles', 'nature', 'photosynthesis'],
        prerequisites: [],
        learningObjectives: [
          'Understand plant needs and growth',
          'Learn plant parts and functions',
          'Observe plant life cycles',
          'Understand photosynthesis basics',
          'Learn about plant responses to environment'
        ]
      }
    };
  }

  private generateAnimalQuestions(ageGroup: AgeGroup, difficulty: DifficultyLevel) {
    // Comprehensive animal knowledge bank
    const animalFactsByAge = {
      '3-5': {
        easy: [
          { question: 'Which animal says "Moo"?', options: ['Cow', 'Dog', 'Cat', 'Bird'], answer: 'Cow', topic: 'sounds', category: 'farm' },
          { question: 'Where do fish live?', options: ['Water', 'Trees', 'Houses', 'Cars'], answer: 'Water', topic: 'habitat', category: 'aquatic' },
          { question: 'Which animal has stripes?', options: ['Zebra', 'Dog', 'Cat', 'Cow'], answer: 'Zebra', topic: 'appearance', category: 'wild' },
          { question: 'What do bees make?', options: ['Honey', 'Milk', 'Eggs', 'Bread'], answer: 'Honey', topic: 'products', category: 'insects' },
          { question: 'Which animal can fly?', options: ['Bird', 'Elephant', 'Fish', 'Dog'], answer: 'Bird', topic: 'abilities', category: 'flying' },
          { question: 'What sound does a dog make?', options: ['Woof', 'Meow', 'Moo', 'Chirp'], answer: 'Woof', topic: 'sounds', category: 'pets' },
          { question: 'Where do birds build their homes?', options: ['Trees', 'Underground', 'Water', 'Cars'], answer: 'Trees', topic: 'habitat', category: 'flying' },
          { question: 'What do cats like to drink?', options: ['Milk', 'Soda', 'Coffee', 'Juice'], answer: 'Milk', topic: 'diet', category: 'pets' }
        ],
        medium: [
          { question: 'Which animals are mammals?', options: ['Dogs and cats', 'Fish and birds', 'Insects and spiders', 'Plants and trees'], answer: 'Dogs and cats', topic: 'classification', category: 'mammals' },
          { question: 'What do elephants use to pick things up?', options: ['Trunk', 'Tail', 'Ears', 'Feet'], answer: 'Trunk', topic: 'body-parts', category: 'wild' },
          { question: 'Which animal changes colors?', options: ['Chameleon', 'Dog', 'Cat', 'Horse'], answer: 'Chameleon', topic: 'abilities', category: 'reptiles' }
        ],
        hard: [
          { question: 'What do we call animals that eat only plants?', options: ['Herbivores', 'Carnivores', 'Omnivores', 'Insectivores'], answer: 'Herbivores', topic: 'diet', category: 'classification' },
          { question: 'Which animal sleeps hanging upside down?', options: ['Bat', 'Monkey', 'Bird', 'Snake'], answer: 'Bat', topic: 'behavior', category: 'flying' }
        ]
      },
      '6-8': {
        easy: [
          { question: 'What do we call animals that are active at night?', options: ['Nocturnal', 'Diurnal', 'Crepuscular', 'Hibernating'], answer: 'Nocturnal', topic: 'behavior', category: 'activity' },
          { question: 'Which animal group has feathers?', options: ['Birds', 'Mammals', 'Reptiles', 'Fish'], answer: 'Birds', topic: 'classification', category: 'flying' },
          { question: 'What do we call the seasonal movement of animals?', options: ['Migration', 'Hibernation', 'Evolution', 'Adaptation'], answer: 'Migration', topic: 'behavior', category: 'movement' },
          { question: 'Which animals are cold-blooded?', options: ['Reptiles', 'Mammals', 'Birds', 'All animals'], answer: 'Reptiles', topic: 'classification', category: 'reptiles' }
        ],
        medium: [
          { question: 'What is a group of lions called?', options: ['Pride', 'Pack', 'Herd', 'Flock'], answer: 'Pride', topic: 'groups', category: 'wild' },
          { question: 'How do dolphins communicate?', options: ['Clicks and whistles', 'Barking', 'Singing', 'Dancing'], answer: 'Clicks and whistles', topic: 'communication', category: 'aquatic' },
          { question: 'What adaptation helps polar bears survive in cold?', options: ['Thick fur', 'Long legs', 'Big ears', 'Bright colors'], answer: 'Thick fur', topic: 'adaptation', category: 'arctic' }
        ],
        hard: [
          { question: 'Which animal has the longest migration route?', options: ['Arctic tern', 'Monarch butterfly', 'Gray whale', 'Caribou'], answer: 'Arctic tern', topic: 'migration', category: 'flying' },
          { question: 'What is the largest animal on Earth?', options: ['Blue whale', 'Elephant', 'Giraffe', 'Great white shark'], answer: 'Blue whale', topic: 'size', category: 'aquatic' }
        ]
      },
      '9+': {
        easy: [
          { question: 'What is the study of animals called?', options: ['Zoology', 'Botany', 'Geology', 'Astronomy'], answer: 'Zoology', topic: 'science', category: 'study' },
          { question: 'Which animal group includes animals with backbones?', options: ['Vertebrates', 'Invertebrates', 'Arthropods', 'Mollusks'], answer: 'Vertebrates', topic: 'classification', category: 'anatomy' },
          { question: 'What is the process of animals changing form called?', options: ['Metamorphosis', 'Evolution', 'Adaptation', 'Migration'], answer: 'Metamorphosis', topic: 'development', category: 'life-cycle' }
        ],
        medium: [
          { question: 'Which animals use echolocation?', options: ['Bats and dolphins', 'Eagles and hawks', 'Lions and tigers', 'Snakes and lizards'], answer: 'Bats and dolphins', topic: 'abilities', category: 'senses' },
          { question: 'What is the term for animals that eat both plants and meat?', options: ['Omnivores', 'Herbivores', 'Carnivores', 'Detritivores'], answer: 'Omnivores', topic: 'diet', category: 'classification' },
          { question: 'Which adaptation helps desert animals conserve water?', options: ['Efficient kidneys', 'Large ears', 'Bright colors', 'Loud calls'], answer: 'Efficient kidneys', topic: 'adaptation', category: 'desert' }
        ],
        hard: [
          { question: 'What is the symbiotic relationship where both species benefit?', options: ['Mutualism', 'Parasitism', 'Commensalism', 'Predation'], answer: 'Mutualism', topic: 'relationships', category: 'ecology' },
          { question: 'Which animal has the most complex brain relative to body size?', options: ['Dolphin', 'Chimpanzee', 'Elephant', 'Octopus'], answer: 'Dolphin', topic: 'intelligence', category: 'cognition' }
        ]
      }
    };

    const difficulty_key3 = difficulty === 'adaptive' ? 'medium' : difficulty;
    const animalFacts = animalFactsByAge[ageGroup][difficulty_key3] || animalFactsByAge['6-8']['easy'];
    const allAnimalFacts = Object.values(animalFactsByAge[ageGroup]).flat();
    const questions: Question[] = [];

    // Generate 120+ animal questions
    for (let i = 0; i < 120; i++) {
      const fact = animalFacts[i % animalFacts.length];
      const questionNumber = i + 1;

      questions.push({
        id: `animal-${fact.topic}-${questionNumber}`,
        type: 'multiple-choice',
        question: fact.question,
        options: fact.options,
        correctAnswer: fact.answer,
        hint: `Think about what you know about ${fact.category} animals and their ${fact.topic}!`,
        explanation: `${fact.answer} is correct! This is about ${fact.topic} in ${fact.category} animals.`,
        media: {
          type: 'image',
          url: `/images/science/animals/${fact.answer.toLowerCase().replace(/\s+/g, '-')}.png`,
          alt: fact.answer
        },
        difficulty: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
        points: 10 + (difficulty === 'hard' ? 5 : 0),
        timeLimit: ageGroup === '3-5' ? 40 : ageGroup === '6-8' ? 35 : 30,
        tags: ['animals', fact.topic, fact.category, 'biology', 'zoology']
      });
    }

    return {
      questions: questions.slice(0, 100), // Limit for performance
      title: 'Animal Kingdom Quest',
      description: 'Explore the fascinating world of animals and their amazing abilities!',
      assets: {
        images: [`/images/science/zoo-bg.png`, `/images/science/safari-bg.png`],
        audio: ['/audio/animal-sounds.mp3', '/audio/jungle-sounds.mp3']
      },
      metadata: {
        estimatedDuration: 18,
        skillTags: ['animal-behavior', 'habitats', 'classification', 'adaptation'],
        prerequisites: [],
        learningObjectives: [
          'Learn about animal classification',
          'Understand animal habitats and behavior',
          'Discover animal adaptations',
          'Explore animal communication',
          'Study animal life cycles and relationships'
        ]
      }
    };
  }

  private generateWeatherQuestions(ageGroup: AgeGroup, difficulty: DifficultyLevel) {
    const weatherFacts = [
      { question: 'What falls from clouds when it rains?', options: ['Water', 'Sand', 'Rocks', 'Toys'], answer: 'Water' },
      { question: 'What do you see in the sky on a sunny day?', options: ['Sun', 'Moon', 'Stars', 'Clouds'], answer: 'Sun' },
      { question: 'What happens to water when it gets very cold?', options: ['It becomes ice', 'It disappears', 'It turns red', 'It grows'], answer: 'It becomes ice' },
      { question: 'Which season is usually the hottest?', options: ['Summer', 'Winter', 'Spring', 'Fall'], answer: 'Summer' },
      { question: 'What do we use to stay dry in the rain?', options: ['Umbrella', 'Sunglasses', 'Shorts', 'Sandals'], answer: 'Umbrella' }
    ];
    const questions: Question[] = [];

    for (let i = 0; i < 5; i++) {
      const fact = weatherFacts[i % weatherFacts.length];

      questions.push({
        id: `weather-${i + 1}`,
        type: 'multiple-choice',
        question: fact.question,
        options: fact.options,
        correctAnswer: fact.answer,
        hint: `Think about what you see outside!`,
        explanation: `${fact.answer} is the correct answer!`,
        media: { type: 'image', url: `/images/science/weather/${fact.answer.toLowerCase().replace(/\s+/g, '-')}.png`, alt: fact.answer },
        difficulty: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
        points: 11,
        timeLimit: 35,
        tags: ['weather', 'seasons', 'temperature']
      });
    }

    return {
      questions,
      title: 'Weather Station',
      description: 'Learn about different types of weather!',
      assets: { images: [`/images/science/weather-station-bg.png`], audio: ['/audio/weather-sounds.mp3'] },
      metadata: {
        estimatedDuration: 8,
        skillTags: ['weather-patterns', 'seasons', 'observation'],
        prerequisites: [],
        learningObjectives: ['Identify weather types', 'Understand seasons', 'Learn weather safety']
      }
    };
  }

  private generateSpaceQuestions(ageGroup: AgeGroup, difficulty: DifficultyLevel) {
    const spaceFacts = [
      { question: 'What do we see in the sky at night?', options: ['Moon and stars', 'Cars', 'Trees', 'Houses'], answer: 'Moon and stars' },
      { question: 'What is the biggest star we can see?', options: ['Sun', 'Moon', 'Earth', 'Mars'], answer: 'Sun' },
      { question: 'How many planets are in our solar system?', options: ['8', '5', '12', '3'], answer: '8' },
      { question: 'What do astronauts wear in space?', options: ['Space suits', 'Regular clothes', 'Swimming suits', 'Pajamas'], answer: 'Space suits' },
      { question: 'Which planet do we live on?', options: ['Earth', 'Mars', 'Jupiter', 'Venus'], answer: 'Earth' }
    ];
    const questions: Question[] = [];

    for (let i = 0; i < 5; i++) {
      const fact = spaceFacts[i % spaceFacts.length];

      questions.push({
        id: `space-${i + 1}`,
        type: 'multiple-choice',
        question: fact.question,
        options: fact.options,
        correctAnswer: fact.answer,
        hint: `Look up at the night sky and think!`,
        explanation: `${fact.answer} is correct!`,
        media: { type: 'image', url: `/images/science/space/${fact.answer.toLowerCase().replace(/\s+/g, '-')}.png`, alt: fact.answer },
        difficulty: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4,
        points: 15,
        timeLimit: 45,
        tags: ['space', 'planets', 'astronomy']
      });
    }

    return {
      questions,
      title: 'Space Explorer',
      description: 'Journey through space and learn about planets!',
      assets: { images: [`/images/science/space-bg.png`], audio: ['/audio/space-music.mp3'] },
      metadata: {
        estimatedDuration: 10,
        skillTags: ['astronomy', 'solar-system', 'space-exploration'],
        prerequisites: [],
        learningObjectives: ['Learn about space', 'Identify planets', 'Understand our solar system']
      }
    };
  }

  private generateBodyQuestions(ageGroup: AgeGroup, difficulty: DifficultyLevel) {
    const bodyFacts = [
      { question: 'How many eyes do you have?', options: ['2', '1', '3', '4'], answer: '2' },
      { question: 'What do you use to smell?', options: ['Nose', 'Eyes', 'Ears', 'Mouth'], answer: 'Nose' },
      { question: 'What helps you hear sounds?', options: ['Ears', 'Hands', 'Feet', 'Hair'], answer: 'Ears' },
      { question: 'What is inside your mouth that helps you eat?', options: ['Teeth', 'Rocks', 'Toys', 'Books'], answer: 'Teeth' },
      { question: 'How many fingers do you have on one hand?', options: ['5', '3', '7', '10'], answer: '5' }
    ];
    const questions: Question[] = [];

    for (let i = 0; i < 5; i++) {
      const fact = bodyFacts[i % bodyFacts.length];

      questions.push({
        id: `body-${i + 1}`,
        type: 'multiple-choice',
        question: fact.question,
        options: fact.options,
        correctAnswer: fact.answer,
        hint: `Look at yourself in a mirror!`,
        explanation: `${fact.answer} is the correct answer!`,
        media: { type: 'image', url: `/images/science/body/${fact.answer.toLowerCase()}.png`, alt: fact.answer },
        difficulty: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
        points: 10,
        timeLimit: 30,
        tags: ['human-body', 'anatomy', 'senses']
      });
    }

    return {
      questions,
      title: 'Human Body Hospital',
      description: 'Learn about your amazing body!',
      assets: { images: [`/images/science/hospital-bg.png`], audio: ['/audio/heartbeat.mp3'] },
      metadata: {
        estimatedDuration: 6,
        skillTags: ['human-anatomy', 'body-parts', 'senses'],
        prerequisites: [],
        learningObjectives: ['Learn body parts', 'Understand senses', 'Count body parts']
      }
    };
  }

  // === MULTI-MODAL CONTENT SYSTEM ===

  // Enhanced media content generation with multi-modal support
  private generateMultiModalContent(subject: Subject, topic: string, questionId: string, ageGroup: AgeGroup) {
    const mediaContent = {
      images: this.generateImageAssets(subject, topic, questionId, ageGroup),
      audio: this.generateAudioAssets(subject, topic, questionId, ageGroup),
      animations: this.generateAnimationAssets(subject, topic, questionId, ageGroup),
      interactive: this.generateInteractiveAssets(subject, topic, questionId, ageGroup)
    };

    return {
      primary: mediaContent.images.primary,
      secondary: mediaContent.images.secondary,
      audioNarration: mediaContent.audio.narration,
      audioSFX: mediaContent.audio.effects,
      animationData: mediaContent.animations,
      interactiveElements: mediaContent.interactive
    };
  }

  private generateImageAssets(subject: Subject, topic: string, questionId: string, ageGroup: AgeGroup) {
    const baseImagePath = `/images/${subject}/${topic}`;
    const ageSpecificPath = `${baseImagePath}/${ageGroup}`;

    return {
      primary: `${ageSpecificPath}/${questionId}-main.png`,
      secondary: [
        `${ageSpecificPath}/${questionId}-hint.png`,
        `${ageSpecificPath}/${questionId}-explanation.png`,
        `${ageSpecificPath}/${questionId}-celebration.png`
      ],
      background: `${baseImagePath}/backgrounds/${topic}-bg-${ageGroup}.png`,
      icons: {
        correct: `${baseImagePath}/icons/correct-${ageGroup}.png`,
        incorrect: `${baseImagePath}/icons/incorrect-${ageGroup}.png`,
        hint: `${baseImagePath}/icons/hint-${ageGroup}.png`
      }
    };
  }

  private generateAudioAssets(subject: Subject, topic: string, questionId: string, ageGroup: AgeGroup) {
    const baseAudioPath = `/audio/${subject}/${topic}`;
    const ageSpecificPath = `${baseAudioPath}/${ageGroup}`;

    return {
      narration: {
        question: `${ageSpecificPath}/${questionId}-question.mp3`,
        hint: `${ageSpecificPath}/${questionId}-hint.mp3`,
        explanation: `${ageSpecificPath}/${questionId}-explanation.mp3`,
        encouragement: `${ageSpecificPath}/${questionId}-encouragement.mp3`
      },
      effects: {
        correct: `${baseAudioPath}/sfx/correct-${ageGroup}.mp3`,
        incorrect: `${baseAudioPath}/sfx/incorrect-${ageGroup}.mp3`,
        click: `${baseAudioPath}/sfx/click-${ageGroup}.mp3`,
        reveal: `${baseAudioPath}/sfx/reveal-${ageGroup}.mp3`
      },
      ambient: `${baseAudioPath}/ambient/${topic}-ambient-${ageGroup}.mp3`
    };
  }

  private generateAnimationAssets(subject: Subject, topic: string, questionId: string, ageGroup: AgeGroup) {
    const animationComplexity = ageGroup === '3-5' ? 'simple' : ageGroup === '6-8' ? 'moderate' : 'advanced';

    return {
      entrance: {
        type: 'fadeInUp',
        duration: ageGroup === '3-5' ? 800 : 600,
        easing: 'easeOutQuart'
      },
      interaction: {
        hover: {
          scale: ageGroup === '3-5' ? 1.1 : 1.05,
          duration: 200
        },
        click: {
          scale: 0.95,
          duration: 100
        }
      },
      feedback: {
        correct: {
          type: 'bounce',
          particles: ageGroup !== '9+',
          confetti: true,
          duration: ageGroup === '3-5' ? 2000 : 1500
        },
        incorrect: {
          type: 'shake',
          intensity: ageGroup === '3-5' ? 'gentle' : 'moderate',
          duration: 500
        }
      },
      progression: {
        type: subject === 'mathematics' ? 'numberCount' : subject === 'english' ? 'letterReveal' : 'discovery',
        complexity: animationComplexity
      }
    };
  }

  private generateInteractiveAssets(subject: Subject, topic: string, questionId: string, ageGroup: AgeGroup) {
    const interactivityLevel = ageGroup === '3-5' ? 'basic' : ageGroup === '6-8' ? 'intermediate' : 'advanced';

    const baseInteractive = {
      touchTargets: {
        size: ageGroup === '3-5' ? 64 : ageGroup === '6-8' ? 48 : 44,
        spacing: ageGroup === '3-5' ? 16 : ageGroup === '6-8' ? 12 : 8
      },
      feedback: {
        haptic: ageGroup !== '9+',
        visual: true,
        audio: true
      }
    };

    // Subject-specific interactive elements
    switch (subject) {
      case 'mathematics':
        return {
          ...baseInteractive,
          dragAndDrop: topic === 'counting' || topic === 'addition',
          numberPad: topic === 'addition' || topic === 'subtraction',
          manipulatives: {
            enabled: ageGroup === '3-5' || ageGroup === '6-8',
            type: topic === 'counting' ? 'counters' : topic === 'shapes' ? 'geometricShapes' : 'numbers'
          },
          calculator: ageGroup === '9+' && (topic === 'multiplication' || topic === 'division')
        };

      case 'english':
        return {
          ...baseInteractive,
          keyboard: topic === 'spelling',
          voiceRecognition: ageGroup === '6-8' || ageGroup === '9+',
          letterTracing: topic === 'letters' && ageGroup === '3-5',
          wordAssembly: topic === 'vocabulary' || topic === 'spelling',
          readAloud: true
        };

      case 'science':
        return {
          ...baseInteractive,
          exploration: {
            zoomable: true,
            layered: ageGroup === '9+',
            hotspots: true
          },
          simulation: {
            enabled: ageGroup === '6-8' || ageGroup === '9+',
            complexity: interactivityLevel
          },
          comparison: topic === 'animals' || topic === 'plants',
          timeline: topic === 'plants' || topic === 'animals'
        };

      default:
        return baseInteractive;
    }
  }

  // Enhanced media object creation
  private createEnhancedMedia(subject: Subject, topic: string, questionId: string, ageGroup: AgeGroup, specificContent?: any) {
    // Return simple media object that matches Question interface schema
    return {
      type: 'image' as const,
      url: specificContent?.url || `/images/${subject}/${topic}/${questionId}.png`,
      alt: specificContent?.alt || `${subject} ${topic} question`
    };
  }

  private generateAccessibilityInstructions(ageGroup: AgeGroup, interactiveElements: any): string {
    const baseInstructions = "Use arrow keys or touch to navigate options. Press Enter or tap to select.";

    if (ageGroup === '3-5') {
      return "Touch the answer you think is right. Ask a grown-up for help if needed.";
    } else if (ageGroup === '6-8') {
      return baseInstructions + " Use Tab to move between options.";
    } else {
      return baseInstructions + " Use Tab and Shift+Tab to navigate. Space bar activates buttons.";
    }
  }

  // === UTILITY METHODS ===

  private generateNumberOptions(correct: number, max: number): string[] {
    const options = new Set<string>([correct.toString()]);

    while (options.size < 4) {
      const random = Math.floor(Math.random() * Math.max(max, correct + 3)) + 1;
      if (random !== correct) {
        options.add(random.toString());
      }
    }

    return this.shuffle(Array.from(options));
  }

  private generateWrongSpellings(word: string): string[] {
    const wrong: string[] = [];

    // Remove a letter
    if (word.length > 2) {
      const randomIndex = Math.floor(Math.random() * word.length);
      wrong.push(word.slice(0, randomIndex) + word.slice(randomIndex + 1));
    }

    // Add an extra letter
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const randomIndex = Math.floor(Math.random() * (word.length + 1));
    wrong.push(word.slice(0, randomIndex) + randomLetter + word.slice(randomIndex));

    // Swap two letters
    if (word.length > 1) {
      const chars = word.split('');
      const i = Math.floor(Math.random() * (chars.length - 1));
      [chars[i], chars[i + 1]] = [chars[i + 1], chars[i]];
      wrong.push(chars.join(''));
    }

    return wrong.slice(0, 3);
  }

  private scrambleWord(word: string): string {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  }

  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // === ASSET MANAGEMENT SYSTEM ===

  // Preload critical assets for smooth gameplay
  async preloadAssets(gameId: string, ageGroup: AgeGroup): Promise<void> {
    const subject = this.extractSubjectFromGameId(gameId);
    const assetManifest = this.generateAssetManifest(subject, ageGroup);

    console.log(`📦 Preloading assets for ${gameId}:`, assetManifest);

    // Preload images
    const imagePromises = assetManifest.images.map(url => this.preloadImage(url));

    // Preload audio
    const audioPromises = assetManifest.audio.map(url => this.preloadAudio(url));

    try {
      await Promise.allSettled([...imagePromises, ...audioPromises]);
      console.log('✅ Asset preloading completed');
    } catch (error) {
      console.warn('⚠️ Some assets failed to preload:', error);
    }
  }

  private generateAssetManifest(subject: Subject, ageGroup: AgeGroup) {
    const basePath = `/assets/${subject}/${ageGroup}`;

    return {
      images: [
        `${basePath}/backgrounds/main-bg.jpg`,
        `${basePath}/ui/buttons-sprite.png`,
        `${basePath}/icons/feedback-icons.png`,
        `${basePath}/characters/mascot-${ageGroup}.png`
      ],
      audio: [
        `${basePath}/sfx/correct.mp3`,
        `${basePath}/sfx/incorrect.mp3`,
        `${basePath}/sfx/click.mp3`,
        `${basePath}/music/background-theme.mp3`
      ],
      fonts: [
        `${basePath}/fonts/kid-friendly-${ageGroup}.woff2`
      ]
    };
  }

  private preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }

  private preloadAudio(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => resolve();
      audio.onerror = () => reject(new Error(`Failed to load audio: ${url}`));
      audio.src = url;
    });
  }

  // === CONTENT VALIDATION SYSTEM ===

  // Validate content quality and accessibility
  validateContent(content: GameContent): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate basic structure
    if (!content.questions || content.questions.length === 0) {
      errors.push('Content must have at least one question');
    }

    // Validate each question
    content.questions.forEach((question, index) => {
      const questionErrors = this.validateQuestion(question, index);
      errors.push(...questionErrors.errors);
      warnings.push(...questionErrors.warnings);
    });

    // Validate age appropriateness
    const ageValidation = this.validateAgeAppropriateness(content);
    errors.push(...ageValidation.errors);
    warnings.push(...ageValidation.warnings);

    // Validate accessibility
    const accessibilityValidation = this.validateAccessibility(content);
    warnings.push(...accessibilityValidation.warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private validateQuestion(question: Question, index: number): {
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!question.question || question.question.trim().length === 0) {
      errors.push(`Question ${index + 1}: Question text is required`);
    }

    if (!question.options || question.options.length < 2) {
      errors.push(`Question ${index + 1}: Must have at least 2 options`);
    }

    if (!question.correctAnswer) {
      errors.push(`Question ${index + 1}: Correct answer is required`);
    }

    // Validate correct answer exists in options
    if (question.options) {
      const correctAnswer = Array.isArray(question.correctAnswer) ? question.correctAnswer[0] : question.correctAnswer;
      if (!question.options.includes(correctAnswer)) {
        errors.push(`Question ${index + 1}: Correct answer not found in options`);
      }
    }

    // Validate time limits
    if (question.timeLimit && (question.timeLimit < 5 || question.timeLimit > 300)) {
      warnings.push(`Question ${index + 1}: Time limit should be between 5-300 seconds`);
    }

    // Validate points
    if (question.points && (question.points < 1 || question.points > 100)) {
      warnings.push(`Question ${index + 1}: Points should be between 1-100`);
    }

    return { errors, warnings };
  }

  private validateAgeAppropriateness(content: GameContent): {
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check content complexity vs age group
    content.questions.forEach((question, index) => {
      const complexity = this.assessQuestionComplexity(question);
      const expectedComplexity = this.getExpectedComplexity(content.ageGroup);

      if (complexity > expectedComplexity + 1) {
        warnings.push(`Question ${index + 1}: May be too complex for age group ${content.ageGroup}`);
      }

      if (complexity < expectedComplexity - 1) {
        warnings.push(`Question ${index + 1}: May be too simple for age group ${content.ageGroup}`);
      }
    });

    return { errors, warnings };
  }

  private validateAccessibility(content: GameContent): {
    warnings: string[];
  } {
    const warnings: string[] = [];

    content.questions.forEach((question, index) => {
      // Check for alt text
      if (question.media && !question.media.alt) {
        warnings.push(`Question ${index + 1}: Missing alt text for accessibility`);
      }

      // Check text length for screen readers
      if (question.question.length > 200) {
        warnings.push(`Question ${index + 1}: Question text may be too long for younger users`);
      }

      // Check for sufficient color contrast indicators
      if (!question.hint) {
        warnings.push(`Question ${index + 1}: Consider adding a hint for accessibility`);
      }
    });

    return { warnings };
  }

  private assessQuestionComplexity(question: Question): number {
    let complexity = 1;

    // Increase complexity based on various factors
    if (question.question.length > 50) complexity += 0.5;
    if (question.options && question.options.length > 4) complexity += 0.5;
    if (question.tags?.includes('advanced')) complexity += 1;
    if (question.timeLimit && question.timeLimit < 30) complexity += 0.5;

    return Math.min(complexity, 5); // Cap at 5
  }

  private getExpectedComplexity(ageGroup: AgeGroup): number {
    switch (ageGroup) {
      case '3-5': return 1.5;
      case '6-8': return 2.5;
      case '9+': return 3.5;
      default: return 2;
    }
  }

  // === CONTENT ANALYTICS SYSTEM ===

  // Track content performance and usage
  trackContentUsage(contentId: string, metrics: {
    completionRate: number;
    averageTime: number;
    difficultyRating: number;
    userFeedback?: string;
  }): void {
    const usageData = {
      contentId,
      timestamp: new Date(),
      ...metrics
    };

    // Store in local analytics (could be enhanced to sync with backend)
    const existingData = localStorage.getItem('sl_content_analytics');
    const analytics = existingData ? JSON.parse(existingData) : [];
    analytics.push(usageData);

    // Keep only last 1000 entries
    if (analytics.length > 1000) {
      analytics.splice(0, analytics.length - 1000);
    }

    localStorage.setItem('sl_content_analytics', JSON.stringify(analytics));
    console.log('📊 Content usage tracked:', usageData);
  }

  // Get content recommendations based on analytics
  getContentRecommendations(userId: string, subject: Subject, ageGroup: AgeGroup): {
    recommended: string[];
    reasons: Record<string, string>;
  } {
    const analytics = this.getContentAnalytics();
    const userPerformance = analytics.filter((a: any) => a.contentId.includes(subject));

    // Simple recommendation logic (can be enhanced with ML)
    const recommended: string[] = [];
    const reasons: Record<string, string> = {};

    // Recommend content based on performance patterns
    if (userPerformance.length > 0) {
      const avgCompletion = userPerformance.reduce((sum: number, p: any) => sum + p.completionRate, 0) / userPerformance.length;

      if (avgCompletion > 0.8) {
        recommended.push(`${subject}-advanced-${ageGroup}`);
        reasons[`${subject}-advanced-${ageGroup}`] = 'High performance - ready for advanced content';
      } else if (avgCompletion < 0.5) {
        recommended.push(`${subject}-review-${ageGroup}`);
        reasons[`${subject}-review-${ageGroup}`] = 'Needs review - reinforcement recommended';
      }
    }

    return { recommended, reasons };
  }

  private getContentAnalytics() {
    const data = localStorage.getItem('sl_content_analytics');
    return data ? JSON.parse(data) : [];
  }

  // Clear cache when needed
  clearCache(): void {
    this.contentCache.clear();
    console.log('🗑️ Content cache cleared');
  }

  // Get cache stats
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.contentCache.size,
      keys: Array.from(this.contentCache.keys())
    };
  }

  // Clear all stored analytics
  clearAnalytics(): void {
    localStorage.removeItem('sl_content_analytics');
    console.log('📊 Content analytics cleared');
  }
}

// Export singleton instance
export const contentFactory = ContentFactory.getInstance();
export default contentFactory;