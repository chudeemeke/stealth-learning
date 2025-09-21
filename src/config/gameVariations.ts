import { Subject, AgeGroup, DifficultyLevel } from '@/types';

export interface GameVariation {
  id: string;
  name: string;
  description: string;
  subject: Subject;
  ageGroup: AgeGroup;
  difficulty: DifficultyLevel;
  type: 'interactive' | 'quiz' | 'drag-drop' | 'drawing' | 'voice' | 'puzzle' | 'memory' | 'timing' | 'story' | 'simulation';
  features: string[];
  estimatedDuration: number; // minutes
  minQuestions: number;
  maxQuestions: number;
  icon: string;
  thumbnail: string;
  tags: string[];
  unlockConditions?: {
    level?: number;
    prerequisiteGames?: string[];
    accuracy?: number;
  };
}

// === MATHEMATICS GAME VARIATIONS ===

export const mathematicsVariations: GameVariation[] = [
  // 3-5 Age Group
  {
    id: 'math-counting-safari-3-5-easy',
    name: 'Counting Safari',
    description: 'Count animals in the safari and learn numbers!',
    subject: 'mathematics',
    ageGroup: '3-5',
    difficulty: 'easy',
    type: 'interactive',
    features: ['touch-friendly', 'animated-characters', 'sound-effects', 'visual-feedback'],
    estimatedDuration: 5,
    minQuestions: 5,
    maxQuestions: 10,
    icon: '🦁',
    thumbnail: '/images/games/math/counting-safari-thumb.png',
    tags: ['counting', 'animals', 'numbers', 'safari'],
  },
  {
    id: 'math-shape-hunt-3-5-easy',
    name: 'Shape Hunt',
    description: 'Find and match different shapes in the playground!',
    subject: 'mathematics',
    ageGroup: '3-5',
    difficulty: 'easy',
    type: 'drag-drop',
    features: ['shape-recognition', 'drag-drop', 'playground-theme', 'reward-stickers'],
    estimatedDuration: 6,
    minQuestions: 8,
    maxQuestions: 12,
    icon: '🔷',
    thumbnail: '/images/games/math/shape-hunt-thumb.png',
    tags: ['shapes', 'geometry', 'matching', 'playground'],
  },
  {
    id: 'math-number-garden-3-5-medium',
    name: 'Number Garden',
    description: 'Plant flowers and learn to add numbers together!',
    subject: 'mathematics',
    ageGroup: '3-5',
    difficulty: 'medium',
    type: 'puzzle',
    features: ['addition', 'gardening-theme', 'growth-animation', 'colorful-flowers'],
    estimatedDuration: 8,
    minQuestions: 6,
    maxQuestions: 10,
    icon: '🌻',
    thumbnail: '/images/games/math/number-garden-thumb.png',
    tags: ['addition', 'gardening', 'growth', 'flowers'],
  },
  {
    id: 'math-treasure-counting-3-5-medium',
    name: 'Treasure Counting',
    description: 'Count gold coins and jewels like a real pirate!',
    subject: 'mathematics',
    ageGroup: '3-5',
    difficulty: 'medium',
    type: 'interactive',
    features: ['pirate-theme', 'treasure-chest', 'gold-animation', 'adventure-story'],
    estimatedDuration: 7,
    minQuestions: 8,
    maxQuestions: 15,
    icon: '💰',
    thumbnail: '/images/games/math/treasure-counting-thumb.png',
    tags: ['counting', 'pirates', 'treasure', 'adventure'],
  },
  {
    id: 'math-kitchen-math-3-5-hard',
    name: 'Kitchen Math',
    description: 'Help chef cookie bake by measuring ingredients!',
    subject: 'mathematics',
    ageGroup: '3-5',
    difficulty: 'hard',
    type: 'simulation',
    features: ['cooking-theme', 'measurement', 'recipe-following', 'chef-character'],
    estimatedDuration: 10,
    minQuestions: 10,
    maxQuestions: 15,
    icon: '👨‍🍳',
    thumbnail: '/images/games/math/kitchen-math-thumb.png',
    tags: ['measurement', 'cooking', 'recipes', 'chef'],
    unlockConditions: { accuracy: 0.8 },
  },

  // 6-8 Age Group
  {
    id: 'math-space-addition-6-8-easy',
    name: 'Space Addition',
    description: 'Solve addition problems to fuel your rocket to space!',
    subject: 'mathematics',
    ageGroup: '6-8',
    difficulty: 'easy',
    type: 'quiz',
    features: ['space-theme', 'rocket-animation', 'planet-exploration', 'astronaut-guide'],
    estimatedDuration: 8,
    minQuestions: 10,
    maxQuestions: 15,
    icon: '🚀',
    thumbnail: '/images/games/math/space-addition-thumb.png',
    tags: ['addition', 'space', 'rockets', 'exploration'],
  },
  {
    id: 'math-time-detective-6-8-easy',
    name: 'Time Detective',
    description: 'Solve time mysteries by reading clocks and calendars!',
    subject: 'mathematics',
    ageGroup: '6-8',
    difficulty: 'easy',
    type: 'puzzle',
    features: ['time-reading', 'detective-theme', 'mystery-solving', 'clock-interactions'],
    estimatedDuration: 12,
    minQuestions: 8,
    maxQuestions: 12,
    icon: '🕵️',
    thumbnail: '/images/games/math/time-detective-thumb.png',
    tags: ['time', 'clocks', 'detective', 'mystery'],
  },
  {
    id: 'math-fraction-pizza-6-8-medium',
    name: 'Fraction Pizza Party',
    description: 'Share pizzas equally and learn about fractions!',
    subject: 'mathematics',
    ageGroup: '6-8',
    difficulty: 'medium',
    type: 'interactive',
    features: ['fractions', 'pizza-cutting', 'sharing-concept', 'party-theme'],
    estimatedDuration: 10,
    minQuestions: 12,
    maxQuestions: 18,
    icon: '🍕',
    thumbnail: '/images/games/math/fraction-pizza-thumb.png',
    tags: ['fractions', 'pizza', 'sharing', 'party'],
  },
  {
    id: 'math-multiplication-race-6-8-medium',
    name: 'Multiplication Race',
    description: 'Race cars by solving multiplication tables!',
    subject: 'mathematics',
    ageGroup: '6-8',
    difficulty: 'medium',
    type: 'timing',
    features: ['multiplication', 'racing-theme', 'speed-challenge', 'leaderboard'],
    estimatedDuration: 9,
    minQuestions: 15,
    maxQuestions: 25,
    icon: '🏎️',
    thumbnail: '/images/games/math/multiplication-race-thumb.png',
    tags: ['multiplication', 'racing', 'speed', 'competition'],
  },
  {
    id: 'math-geometry-builder-6-8-hard',
    name: 'Geometry Builder',
    description: 'Build houses and castles using geometric shapes!',
    subject: 'mathematics',
    ageGroup: '6-8',
    difficulty: 'hard',
    type: 'puzzle',
    features: ['geometry', 'building-simulation', 'shape-combinations', 'architecture'],
    estimatedDuration: 15,
    minQuestions: 10,
    maxQuestions: 15,
    icon: '🏰',
    thumbnail: '/images/games/math/geometry-builder-thumb.png',
    tags: ['geometry', 'building', 'shapes', 'architecture'],
    unlockConditions: { level: 5 },
  },

  // 9+ Age Group
  {
    id: 'math-algebra-adventure-9-easy',
    name: 'Algebra Adventure',
    description: 'Solve equations to unlock magical doors and treasures!',
    subject: 'mathematics',
    ageGroup: '9+',
    difficulty: 'easy',
    type: 'puzzle',
    features: ['algebra', 'fantasy-theme', 'equation-solving', 'magical-elements'],
    estimatedDuration: 12,
    minQuestions: 10,
    maxQuestions: 15,
    icon: '🔮',
    thumbnail: '/images/games/math/algebra-adventure-thumb.png',
    tags: ['algebra', 'equations', 'fantasy', 'magic'],
  },
  {
    id: 'math-data-scientist-9-medium',
    name: 'Data Scientist',
    description: 'Analyze charts and graphs to solve real-world problems!',
    subject: 'mathematics',
    ageGroup: '9+',
    difficulty: 'medium',
    type: 'simulation',
    features: ['statistics', 'data-analysis', 'chart-reading', 'real-world-scenarios'],
    estimatedDuration: 18,
    minQuestions: 8,
    maxQuestions: 12,
    icon: '📊',
    thumbnail: '/images/games/math/data-scientist-thumb.png',
    tags: ['statistics', 'data', 'charts', 'analysis'],
  },
  {
    id: 'math-probability-casino-9-medium',
    name: 'Probability Casino',
    description: 'Learn probability and statistics through fun casino games!',
    subject: 'mathematics',
    ageGroup: '9+',
    difficulty: 'medium',
    type: 'simulation',
    features: ['probability', 'statistics', 'casino-theme', 'risk-assessment'],
    estimatedDuration: 15,
    minQuestions: 12,
    maxQuestions: 20,
    icon: '🎲',
    thumbnail: '/images/games/math/probability-casino-thumb.png',
    tags: ['probability', 'statistics', 'casino', 'risk'],
  },
  {
    id: 'math-calculus-physics-9-hard',
    name: 'Calculus Physics Lab',
    description: 'Use calculus to solve physics problems and run experiments!',
    subject: 'mathematics',
    ageGroup: '9+',
    difficulty: 'hard',
    type: 'simulation',
    features: ['calculus', 'physics-integration', 'laboratory-setting', 'experiments'],
    estimatedDuration: 25,
    minQuestions: 8,
    maxQuestions: 12,
    icon: '⚗️',
    thumbnail: '/images/games/math/calculus-physics-thumb.png',
    tags: ['calculus', 'physics', 'laboratory', 'experiments'],
    unlockConditions: { level: 10, accuracy: 0.85 },
  },
  {
    id: 'math-financial-literacy-9-hard',
    name: 'Financial Wizard',
    description: 'Learn about money, investments, and financial planning!',
    subject: 'mathematics',
    ageGroup: '9+',
    difficulty: 'hard',
    type: 'simulation',
    features: ['financial-literacy', 'budgeting', 'investments', 'real-world-math'],
    estimatedDuration: 20,
    minQuestions: 15,
    maxQuestions: 25,
    icon: '💼',
    thumbnail: '/images/games/math/financial-wizard-thumb.png',
    tags: ['finance', 'money', 'investments', 'budgeting'],
    unlockConditions: { level: 8 },
  },
];

// === ENGLISH GAME VARIATIONS ===

export const englishVariations: GameVariation[] = [
  // 3-5 Age Group
  {
    id: 'english-alphabet-zoo-3-5-easy',
    name: 'Alphabet Zoo',
    description: 'Meet animals and learn the alphabet with fun sounds!',
    subject: 'english',
    ageGroup: '3-5',
    difficulty: 'easy',
    type: 'interactive',
    features: ['alphabet', 'animal-sounds', 'letter-tracing', 'phonics'],
    estimatedDuration: 6,
    minQuestions: 8,
    maxQuestions: 12,
    icon: '🦒',
    thumbnail: '/images/games/english/alphabet-zoo-thumb.png',
    tags: ['alphabet', 'animals', 'phonics', 'sounds'],
  },
  {
    id: 'english-rhyme-time-3-5-easy',
    name: 'Rhyme Time',
    description: 'Find words that rhyme and create silly songs!',
    subject: 'english',
    ageGroup: '3-5',
    difficulty: 'easy',
    type: 'interactive',
    features: ['rhyming', 'music', 'word-patterns', 'silly-songs'],
    estimatedDuration: 8,
    minQuestions: 6,
    maxQuestions: 10,
    icon: '🎵',
    thumbnail: '/images/games/english/rhyme-time-thumb.png',
    tags: ['rhyming', 'music', 'patterns', 'songs'],
  },
  {
    id: 'english-story-builder-3-5-medium',
    name: 'Story Builder',
    description: 'Create your own stories by choosing characters and actions!',
    subject: 'english',
    ageGroup: '3-5',
    difficulty: 'medium',
    type: 'story',
    features: ['storytelling', 'character-selection', 'plot-building', 'creativity'],
    estimatedDuration: 12,
    minQuestions: 8,
    maxQuestions: 12,
    icon: '📚',
    thumbnail: '/images/games/english/story-builder-thumb.png',
    tags: ['storytelling', 'creativity', 'characters', 'plots'],
  },
  {
    id: 'english-word-garden-3-5-medium',
    name: 'Word Garden',
    description: 'Plant word seeds and watch them grow into sentences!',
    subject: 'english',
    ageGroup: '3-5',
    difficulty: 'medium',
    type: 'puzzle',
    features: ['word-building', 'sentence-formation', 'garden-theme', 'growth-animation'],
    estimatedDuration: 10,
    minQuestions: 10,
    maxQuestions: 15,
    icon: '🌱',
    thumbnail: '/images/games/english/word-garden-thumb.png',
    tags: ['words', 'sentences', 'garden', 'growth'],
  },
  {
    id: 'english-reading-adventure-3-5-hard',
    name: 'Reading Adventure',
    description: 'Go on quests by reading simple stories and making choices!',
    subject: 'english',
    ageGroup: '3-5',
    difficulty: 'hard',
    type: 'story',
    features: ['reading-comprehension', 'adventure-theme', 'choice-based', 'interactive-stories'],
    estimatedDuration: 15,
    minQuestions: 6,
    maxQuestions: 10,
    icon: '⚔️',
    thumbnail: '/images/games/english/reading-adventure-thumb.png',
    tags: ['reading', 'adventure', 'comprehension', 'choices'],
    unlockConditions: { accuracy: 0.75 },
  },

  // 6-8 Age Group
  {
    id: 'english-spelling-bee-6-8-easy',
    name: 'Spelling Bee Championship',
    description: 'Compete in spelling contests and become the champion!',
    subject: 'english',
    ageGroup: '6-8',
    difficulty: 'easy',
    type: 'quiz',
    features: ['spelling', 'competition-theme', 'progressive-difficulty', 'championship'],
    estimatedDuration: 10,
    minQuestions: 15,
    maxQuestions: 25,
    icon: '🐝',
    thumbnail: '/images/games/english/spelling-bee-thumb.png',
    tags: ['spelling', 'competition', 'championship', 'words'],
  },
  {
    id: 'english-grammar-detective-6-8-easy',
    name: 'Grammar Detective',
    description: 'Solve mysteries by finding grammar mistakes and clues!',
    subject: 'english',
    ageGroup: '6-8',
    difficulty: 'easy',
    type: 'puzzle',
    features: ['grammar', 'detective-theme', 'error-finding', 'mystery-solving'],
    estimatedDuration: 12,
    minQuestions: 10,
    maxQuestions: 15,
    icon: '🔍',
    thumbnail: '/images/games/english/grammar-detective-thumb.png',
    tags: ['grammar', 'detective', 'errors', 'mystery'],
  },
  {
    id: 'english-poetry-cafe-6-8-medium',
    name: 'Poetry Café',
    description: 'Write poems and perform them at the cozy poetry café!',
    subject: 'english',
    ageGroup: '6-8',
    difficulty: 'medium',
    type: 'interactive',
    features: ['poetry', 'creative-writing', 'performance', 'café-theme'],
    estimatedDuration: 15,
    minQuestions: 8,
    maxQuestions: 12,
    icon: '☕',
    thumbnail: '/images/games/english/poetry-cafe-thumb.png',
    tags: ['poetry', 'writing', 'performance', 'café'],
  },
  {
    id: 'english-vocabulary-quest-6-8-medium',
    name: 'Vocabulary Quest',
    description: 'Embark on quests to discover new words and their meanings!',
    subject: 'english',
    ageGroup: '6-8',
    difficulty: 'medium',
    type: 'puzzle',
    features: ['vocabulary', 'word-meanings', 'quest-theme', 'treasure-hunting'],
    estimatedDuration: 14,
    minQuestions: 12,
    maxQuestions: 20,
    icon: '🗡️',
    thumbnail: '/images/games/english/vocabulary-quest-thumb.png',
    tags: ['vocabulary', 'meanings', 'quest', 'treasure'],
  },
  {
    id: 'english-debate-arena-6-8-hard',
    name: 'Debate Arena',
    description: 'Practice persuasive speaking and critical thinking!',
    subject: 'english',
    ageGroup: '6-8',
    difficulty: 'hard',
    type: 'voice',
    features: ['debate', 'persuasion', 'critical-thinking', 'public-speaking'],
    estimatedDuration: 18,
    minQuestions: 6,
    maxQuestions: 10,
    icon: '🎤',
    thumbnail: '/images/games/english/debate-arena-thumb.png',
    tags: ['debate', 'speaking', 'persuasion', 'thinking'],
    unlockConditions: { level: 6 },
  },

  // 9+ Age Group
  {
    id: 'english-journalism-newsroom-9-easy',
    name: 'Newsroom Journalist',
    description: 'Write news articles and interview characters for stories!',
    subject: 'english',
    ageGroup: '9+',
    difficulty: 'easy',
    type: 'simulation',
    features: ['journalism', 'article-writing', 'interviews', 'newsroom-simulation'],
    estimatedDuration: 20,
    minQuestions: 8,
    maxQuestions: 12,
    icon: '📰',
    thumbnail: '/images/games/english/journalism-newsroom-thumb.png',
    tags: ['journalism', 'writing', 'interviews', 'news'],
  },
  {
    id: 'english-shakespeare-theater-9-medium',
    name: 'Shakespeare Theater',
    description: 'Explore classic literature and perform famous scenes!',
    subject: 'english',
    ageGroup: '9+',
    difficulty: 'medium',
    type: 'story',
    features: ['classic-literature', 'shakespeare', 'theater', 'performance'],
    estimatedDuration: 25,
    minQuestions: 6,
    maxQuestions: 10,
    icon: '🎭',
    thumbnail: '/images/games/english/shakespeare-theater-thumb.png',
    tags: ['shakespeare', 'theater', 'literature', 'performance'],
  },
  {
    id: 'english-creative-writing-9-medium',
    name: 'Creative Writing Studio',
    description: 'Develop your writing skills with guided creative exercises!',
    subject: 'english',
    ageGroup: '9+',
    difficulty: 'medium',
    type: 'interactive',
    features: ['creative-writing', 'story-development', 'character-creation', 'plot-structure'],
    estimatedDuration: 22,
    minQuestions: 8,
    maxQuestions: 15,
    icon: '✍️',
    thumbnail: '/images/games/english/creative-writing-thumb.png',
    tags: ['writing', 'creativity', 'stories', 'characters'],
  },
  {
    id: 'english-etymology-explorer-9-hard',
    name: 'Etymology Explorer',
    description: 'Discover the origins and evolution of words!',
    subject: 'english',
    ageGroup: '9+',
    difficulty: 'hard',
    type: 'puzzle',
    features: ['etymology', 'word-origins', 'historical-linguistics', 'exploration'],
    estimatedDuration: 18,
    minQuestions: 10,
    maxQuestions: 15,
    icon: '🏛️',
    thumbnail: '/images/games/english/etymology-explorer-thumb.png',
    tags: ['etymology', 'word-origins', 'history', 'linguistics'],
    unlockConditions: { level: 12, accuracy: 0.9 },
  },
  {
    id: 'english-rhetoric-master-9-hard',
    name: 'Rhetoric Master',
    description: 'Master the art of persuasive speech and argumentation!',
    subject: 'english',
    ageGroup: '9+',
    difficulty: 'hard',
    type: 'voice',
    features: ['rhetoric', 'persuasion', 'argumentation', 'speech-analysis'],
    estimatedDuration: 20,
    minQuestions: 8,
    maxQuestions: 12,
    icon: '🏛️',
    thumbnail: '/images/games/english/rhetoric-master-thumb.png',
    tags: ['rhetoric', 'persuasion', 'arguments', 'speech'],
    unlockConditions: { level: 15, prerequisiteGames: ['english-debate-arena-6-8-hard'] },
  },
];

// === SCIENCE GAME VARIATIONS ===

export const scienceVariations: GameVariation[] = [
  // 3-5 Age Group
  {
    id: 'science-nature-walk-3-5-easy',
    name: 'Nature Walk',
    description: 'Explore the forest and learn about plants and animals!',
    subject: 'science',
    ageGroup: '3-5',
    difficulty: 'easy',
    type: 'interactive',
    features: ['nature-exploration', 'plant-identification', 'animal-spotting', 'outdoor-theme'],
    estimatedDuration: 8,
    minQuestions: 6,
    maxQuestions: 10,
    icon: '🌳',
    thumbnail: '/images/games/science/nature-walk-thumb.png',
    tags: ['nature', 'plants', 'animals', 'exploration'],
  },
  {
    id: 'science-weather-station-3-5-easy',
    name: 'Weather Station',
    description: 'Predict the weather and learn about different weather patterns!',
    subject: 'science',
    ageGroup: '3-5',
    difficulty: 'easy',
    type: 'simulation',
    features: ['weather-prediction', 'pattern-recognition', 'meteorology', 'interactive-tools'],
    estimatedDuration: 10,
    minQuestions: 8,
    maxQuestions: 12,
    icon: '🌤️',
    thumbnail: '/images/games/science/weather-station-thumb.png',
    tags: ['weather', 'patterns', 'meteorology', 'prediction'],
  },
  {
    id: 'science-my-body-3-5-medium',
    name: 'My Amazing Body',
    description: 'Learn about your body parts and how they work!',
    subject: 'science',
    ageGroup: '3-5',
    difficulty: 'medium',
    type: 'interactive',
    features: ['human-body', 'organ-systems', 'health-education', 'body-parts'],
    estimatedDuration: 12,
    minQuestions: 10,
    maxQuestions: 15,
    icon: '👶',
    thumbnail: '/images/games/science/my-body-thumb.png',
    tags: ['body', 'health', 'organs', 'systems'],
  },
  {
    id: 'science-simple-experiments-3-5-medium',
    name: 'Simple Experiments',
    description: 'Conduct safe science experiments with everyday materials!',
    subject: 'science',
    ageGroup: '3-5',
    difficulty: 'medium',
    type: 'simulation',
    features: ['experiments', 'scientific-method', 'observation', 'hypothesis'],
    estimatedDuration: 15,
    minQuestions: 6,
    maxQuestions: 10,
    icon: '🧪',
    thumbnail: '/images/games/science/simple-experiments-thumb.png',
    tags: ['experiments', 'observation', 'hypothesis', 'method'],
  },
  {
    id: 'science-space-explorer-3-5-hard',
    name: 'Space Explorer',
    description: 'Blast off to space and learn about planets and stars!',
    subject: 'science',
    ageGroup: '3-5',
    difficulty: 'hard',
    type: 'interactive',
    features: ['space-exploration', 'planets', 'solar-system', 'astronaut-simulation'],
    estimatedDuration: 12,
    minQuestions: 8,
    maxQuestions: 12,
    icon: '👨‍🚀',
    thumbnail: '/images/games/science/space-explorer-thumb.png',
    tags: ['space', 'planets', 'solar-system', 'astronaut'],
    unlockConditions: { accuracy: 0.8 },
  },

  // 6-8 Age Group
  {
    id: 'science-ecosystem-builder-6-8-easy',
    name: 'Ecosystem Builder',
    description: 'Build balanced ecosystems and learn about food chains!',
    subject: 'science',
    ageGroup: '6-8',
    difficulty: 'easy',
    type: 'simulation',
    features: ['ecosystems', 'food-chains', 'biodiversity', 'environmental-balance'],
    estimatedDuration: 15,
    minQuestions: 10,
    maxQuestions: 15,
    icon: '🌍',
    thumbnail: '/images/games/science/ecosystem-builder-thumb.png',
    tags: ['ecosystems', 'food-chains', 'environment', 'balance'],
  },
  {
    id: 'science-chemistry-lab-6-8-easy',
    name: 'Chemistry Lab',
    description: 'Mix safe chemicals and observe exciting reactions!',
    subject: 'science',
    ageGroup: '6-8',
    difficulty: 'easy',
    type: 'simulation',
    features: ['chemistry', 'reactions', 'laboratory-safety', 'molecular-interactions'],
    estimatedDuration: 18,
    minQuestions: 8,
    maxQuestions: 12,
    icon: '⚗️',
    thumbnail: '/images/games/science/chemistry-lab-thumb.png',
    tags: ['chemistry', 'reactions', 'laboratory', 'molecules'],
  },
  {
    id: 'science-physics-playground-6-8-medium',
    name: 'Physics Playground',
    description: 'Experiment with forces, motion, and simple machines!',
    subject: 'science',
    ageGroup: '6-8',
    difficulty: 'medium',
    type: 'interactive',
    features: ['physics', 'forces', 'motion', 'simple-machines'],
    estimatedDuration: 16,
    minQuestions: 12,
    maxQuestions: 18,
    icon: '⚙️',
    thumbnail: '/images/games/science/physics-playground-thumb.png',
    tags: ['physics', 'forces', 'motion', 'machines'],
  },
  {
    id: 'science-genetics-garden-6-8-medium',
    name: 'Genetics Garden',
    description: 'Breed plants and animals to learn about inheritance!',
    subject: 'science',
    ageGroup: '6-8',
    difficulty: 'medium',
    type: 'simulation',
    features: ['genetics', 'inheritance', 'breeding', 'traits'],
    estimatedDuration: 20,
    minQuestions: 10,
    maxQuestions: 15,
    icon: '🧬',
    thumbnail: '/images/games/science/genetics-garden-thumb.png',
    tags: ['genetics', 'inheritance', 'breeding', 'traits'],
  },
  {
    id: 'science-invention-workshop-6-8-hard',
    name: 'Invention Workshop',
    description: 'Design and build your own inventions to solve problems!',
    subject: 'science',
    ageGroup: '6-8',
    difficulty: 'hard',
    type: 'puzzle',
    features: ['invention', 'engineering-design', 'problem-solving', 'creativity'],
    estimatedDuration: 25,
    minQuestions: 8,
    maxQuestions: 12,
    icon: '🔧',
    thumbnail: '/images/games/science/invention-workshop-thumb.png',
    tags: ['invention', 'engineering', 'design', 'problem-solving'],
    unlockConditions: { level: 7 },
  },

  // 9+ Age Group
  {
    id: 'science-quantum-physics-9-easy',
    name: 'Quantum Physics Intro',
    description: 'Explore the weird and wonderful world of quantum mechanics!',
    subject: 'science',
    ageGroup: '9+',
    difficulty: 'easy',
    type: 'simulation',
    features: ['quantum-physics', 'particle-behavior', 'wave-particle-duality', 'quantum-concepts'],
    estimatedDuration: 22,
    minQuestions: 8,
    maxQuestions: 12,
    icon: '⚛️',
    thumbnail: '/images/games/science/quantum-physics-thumb.png',
    tags: ['quantum', 'physics', 'particles', 'mechanics'],
  },
  {
    id: 'science-biotechnology-9-medium',
    name: 'Biotechnology Lab',
    description: 'Use technology to solve biological problems and create solutions!',
    subject: 'science',
    ageGroup: '9+',
    difficulty: 'medium',
    type: 'simulation',
    features: ['biotechnology', 'genetic-engineering', 'bioethics', 'medical-applications'],
    estimatedDuration: 25,
    minQuestions: 10,
    maxQuestions: 15,
    icon: '🧬',
    thumbnail: '/images/games/science/biotechnology-thumb.png',
    tags: ['biotechnology', 'genetics', 'ethics', 'medicine'],
  },
  {
    id: 'science-climate-change-9-medium',
    name: 'Climate Change Simulator',
    description: 'Model climate systems and explore environmental solutions!',
    subject: 'science',
    ageGroup: '9+',
    difficulty: 'medium',
    type: 'simulation',
    features: ['climate-science', 'environmental-modeling', 'sustainability', 'global-systems'],
    estimatedDuration: 28,
    minQuestions: 12,
    maxQuestions: 18,
    icon: '🌡️',
    thumbnail: '/images/games/science/climate-change-thumb.png',
    tags: ['climate', 'environment', 'sustainability', 'modeling'],
  },
  {
    id: 'science-astrophysics-9-hard',
    name: 'Astrophysics Observatory',
    description: 'Study stars, galaxies, and the universe with advanced tools!',
    subject: 'science',
    ageGroup: '9+',
    difficulty: 'hard',
    type: 'simulation',
    features: ['astrophysics', 'stellar-evolution', 'cosmology', 'space-telescopes'],
    estimatedDuration: 30,
    minQuestions: 8,
    maxQuestions: 12,
    icon: '🔭',
    thumbnail: '/images/games/science/astrophysics-thumb.png',
    tags: ['astrophysics', 'stars', 'galaxies', 'universe'],
    unlockConditions: { level: 15, accuracy: 0.9 },
  },
  {
    id: 'science-research-scientist-9-hard',
    name: 'Research Scientist',
    description: 'Conduct advanced research and publish scientific papers!',
    subject: 'science',
    ageGroup: '9+',
    difficulty: 'hard',
    type: 'simulation',
    features: ['research-methods', 'peer-review', 'scientific-writing', 'data-analysis'],
    estimatedDuration: 35,
    minQuestions: 10,
    maxQuestions: 15,
    icon: '👨‍🔬',
    thumbnail: '/images/games/science/research-scientist-thumb.png',
    tags: ['research', 'scientific-method', 'writing', 'analysis'],
    unlockConditions: { level: 20, prerequisiteGames: ['science-quantum-physics-9-easy'] },
  },
];

// === COMBINED GAME VARIATIONS ===

export const allGameVariations: GameVariation[] = [
  ...mathematicsVariations,
  ...englishVariations,
  ...scienceVariations,
];

// === UTILITY FUNCTIONS ===

export function getGameVariationsBySubject(subject: Subject): GameVariation[] {
  return allGameVariations.filter(game => game.subject === subject);
}

export function getGameVariationsByAgeGroup(ageGroup: AgeGroup): GameVariation[] {
  return allGameVariations.filter(game => game.ageGroup === ageGroup);
}

export function getGameVariationsByDifficulty(difficulty: DifficultyLevel): GameVariation[] {
  return allGameVariations.filter(game => game.difficulty === difficulty);
}

export function getGameVariationsByType(type: GameVariation['type']): GameVariation[] {
  return allGameVariations.filter(game => game.type === type);
}

export function getAvailableGameVariations(
  subject: Subject,
  ageGroup: AgeGroup,
  playerLevel: number = 1,
  completedGames: string[] = [],
  playerAccuracy: number = 0
): GameVariation[] {
  return allGameVariations.filter(game => {
    // Basic filters
    if (game.subject !== subject || game.ageGroup !== ageGroup) {
      return false;
    }

    // Check unlock conditions
    if (game.unlockConditions) {
      const { level, prerequisiteGames, accuracy } = game.unlockConditions;

      // Level requirement
      if (level && playerLevel < level) {
        return false;
      }

      // Accuracy requirement
      if (accuracy && playerAccuracy < accuracy) {
        return false;
      }

      // Prerequisite games
      if (prerequisiteGames && prerequisiteGames.length > 0) {
        const hasAllPrerequisites = prerequisiteGames.every(prereq =>
          completedGames.includes(prereq)
        );
        if (!hasAllPrerequisites) {
          return false;
        }
      }
    }

    return true;
  });
}

export function getGameVariationById(id: string): GameVariation | undefined {
  return allGameVariations.find(game => game.id === id);
}

export function getRecommendedGames(
  subject: Subject,
  ageGroup: AgeGroup,
  playerLevel: number,
  recentPerformance: { accuracy: number; preferredDifficulty: DifficultyLevel },
  maxRecommendations: number = 5
): GameVariation[] {
  const availableGames = getAvailableGameVariations(subject, ageGroup, playerLevel, [], recentPerformance.accuracy);

  // Sort by difficulty preference and variety
  const sortedGames = availableGames.sort((a, b) => {
    // Prefer games matching current difficulty level
    const aDifficultyMatch = a.difficulty === recentPerformance.preferredDifficulty ? 1 : 0;
    const bDifficultyMatch = b.difficulty === recentPerformance.preferredDifficulty ? 1 : 0;

    if (aDifficultyMatch !== bDifficultyMatch) {
      return bDifficultyMatch - aDifficultyMatch;
    }

    // Then prefer variety in game types
    return Math.random() - 0.5; // Randomize for variety
  });

  return sortedGames.slice(0, maxRecommendations);
}

export function getGameStatistics(): {
  totalGames: number;
  gamesBySubject: Record<Subject, number>;
  gamesByAgeGroup: Record<AgeGroup, number>;
  gamesByDifficulty: Record<DifficultyLevel, number>;
  gamesByType: Record<GameVariation['type'], number>;
} {
  const gamesBySubject = allGameVariations.reduce((acc, game) => {
    acc[game.subject] = (acc[game.subject] || 0) + 1;
    return acc;
  }, {} as Record<Subject, number>);

  const gamesByAgeGroup = allGameVariations.reduce((acc, game) => {
    acc[game.ageGroup] = (acc[game.ageGroup] || 0) + 1;
    return acc;
  }, {} as Record<AgeGroup, number>);

  const gamesByDifficulty = allGameVariations.reduce((acc, game) => {
    acc[game.difficulty] = (acc[game.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<DifficultyLevel, number>);

  const gamesByType = allGameVariations.reduce((acc, game) => {
    acc[game.type] = (acc[game.type] || 0) + 1;
    return acc;
  }, {} as Record<GameVariation['type'], number>);

  return {
    totalGames: allGameVariations.length,
    gamesBySubject,
    gamesByAgeGroup,
    gamesByDifficulty,
    gamesByType,
  };
}

export default allGameVariations;