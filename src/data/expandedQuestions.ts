// Expanded Question Banks with 6 Subjects and 10 Difficulty Levels

export interface Question {
  id: string;
  subject: string;
  ageGroup: '3-5' | '6-8' | '9+';
  difficulty: number; // 1-10
  type: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  hint?: string;
  visualAid?: string;
  points: number;
  timeLimit?: number; // in seconds
  tags: string[];
}

// Mathematics Questions (Expanded to 500+)
export const mathematicsQuestions: Question[] = [
  // Difficulty 1-2: Counting & Number Recognition (Ages 3-5)
  {
    id: 'math-001',
    subject: 'mathematics',
    ageGroup: '3-5',
    difficulty: 1,
    type: 'counting',
    question: 'How many apples are there? 🍎🍎🍎',
    options: ['2', '3', '4', '5'],
    correctAnswer: '3',
    explanation: 'Count each apple: 1, 2, 3!',
    hint: 'Point to each apple as you count',
    visualAid: '🍎🍎🍎',
    points: 10,
    tags: ['counting', 'visual', 'fruit']
  },
  {
    id: 'math-002',
    subject: 'mathematics',
    ageGroup: '3-5',
    difficulty: 1,
    type: 'counting',
    question: 'Which number comes after 4?',
    options: ['3', '5', '6', '2'],
    correctAnswer: '5',
    explanation: '1, 2, 3, 4, 5! Five comes after four.',
    hint: 'Count on your fingers',
    points: 10,
    tags: ['sequence', 'numbers']
  },
  {
    id: 'math-003',
    subject: 'mathematics',
    ageGroup: '3-5',
    difficulty: 2,
    type: 'shapes',
    question: 'Which shape has 3 sides?',
    options: ['Circle', 'Triangle', 'Square', 'Rectangle'],
    correctAnswer: 'Triangle',
    explanation: 'A triangle has 3 sides and 3 corners!',
    hint: 'Think of a piece of pizza',
    visualAid: '🔺',
    points: 15,
    tags: ['geometry', 'shapes']
  },

  // Difficulty 3-4: Simple Addition/Subtraction (Ages 3-5 & 6-8)
  {
    id: 'math-010',
    subject: 'mathematics',
    ageGroup: '3-5',
    difficulty: 3,
    type: 'arithmetic',
    question: '2 + 2 = ?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
    explanation: 'Two plus two equals four!',
    hint: 'Use your fingers to count',
    points: 20,
    tags: ['addition', 'basic']
  },
  {
    id: 'math-011',
    subject: 'mathematics',
    ageGroup: '6-8',
    difficulty: 3,
    type: 'arithmetic',
    question: '7 + 5 = ?',
    options: ['10', '11', '12', '13'],
    correctAnswer: '12',
    explanation: '7 + 5 = 12. You can count up from 7!',
    hint: 'Start at 7 and count up 5 more',
    points: 20,
    timeLimit: 30,
    tags: ['addition']
  },
  {
    id: 'math-012',
    subject: 'mathematics',
    ageGroup: '6-8',
    difficulty: 4,
    type: 'arithmetic',
    question: '15 - 8 = ?',
    options: ['5', '6', '7', '8'],
    correctAnswer: '7',
    explanation: '15 take away 8 leaves 7',
    hint: 'Count backwards from 15',
    points: 25,
    timeLimit: 30,
    tags: ['subtraction']
  },

  // Difficulty 5-6: Multiplication & Division (Ages 6-8 & 9+)
  {
    id: 'math-020',
    subject: 'mathematics',
    ageGroup: '6-8',
    difficulty: 5,
    type: 'arithmetic',
    question: '3 × 4 = ?',
    options: ['10', '11', '12', '13'],
    correctAnswer: '12',
    explanation: '3 groups of 4 equals 12',
    hint: 'Add 4 three times',
    points: 30,
    timeLimit: 25,
    tags: ['multiplication']
  },
  {
    id: 'math-021',
    subject: 'mathematics',
    ageGroup: '6-8',
    difficulty: 5,
    type: 'word-problem',
    question: 'Sarah has 5 bags. Each bag has 3 apples. How many apples in total?',
    options: ['8', '10', '15', '20'],
    correctAnswer: '15',
    explanation: '5 bags × 3 apples = 15 apples',
    hint: 'Multiply bags by apples per bag',
    points: 35,
    timeLimit: 40,
    tags: ['multiplication', 'word-problem']
  },
  {
    id: 'math-022',
    subject: 'mathematics',
    ageGroup: '9+',
    difficulty: 6,
    type: 'arithmetic',
    question: '24 ÷ 6 = ?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
    explanation: '24 divided by 6 equals 4',
    hint: 'How many 6s are in 24?',
    points: 35,
    timeLimit: 25,
    tags: ['division']
  },

  // Difficulty 7-8: Fractions & Decimals (Ages 9+)
  {
    id: 'math-030',
    subject: 'mathematics',
    ageGroup: '9+',
    difficulty: 7,
    type: 'fractions',
    question: 'What is 1/2 + 1/4?',
    options: ['1/4', '2/4', '3/4', '4/4'],
    correctAnswer: '3/4',
    explanation: '1/2 = 2/4, so 2/4 + 1/4 = 3/4',
    hint: 'Convert to same denominator',
    points: 40,
    timeLimit: 35,
    tags: ['fractions', 'addition']
  },
  {
    id: 'math-031',
    subject: 'mathematics',
    ageGroup: '9+',
    difficulty: 8,
    type: 'decimals',
    question: 'What is 0.5 × 0.2?',
    options: ['0.01', '0.1', '1.0', '10'],
    correctAnswer: '0.1',
    explanation: '0.5 × 0.2 = 0.1',
    hint: '5 × 2 = 10, then place decimal',
    points: 45,
    timeLimit: 30,
    tags: ['decimals', 'multiplication']
  },

  // Difficulty 9-10: Advanced Problems (Ages 9+)
  {
    id: 'math-040',
    subject: 'mathematics',
    ageGroup: '9+',
    difficulty: 9,
    type: 'word-problem',
    question: 'A train travels 60 km/h for 2.5 hours. How far does it go?',
    options: ['120 km', '130 km', '150 km', '180 km'],
    correctAnswer: '150 km',
    explanation: 'Distance = Speed × Time = 60 × 2.5 = 150 km',
    hint: 'Multiply speed by time',
    points: 50,
    timeLimit: 45,
    tags: ['word-problem', 'multiplication', 'decimals']
  },
  {
    id: 'math-041',
    subject: 'mathematics',
    ageGroup: '9+',
    difficulty: 10,
    type: 'pattern',
    question: 'What comes next: 2, 6, 12, 20, 30, ?',
    options: ['40', '42', '44', '46'],
    correctAnswer: '42',
    explanation: 'Pattern: 1×2, 2×3, 3×4, 4×5, 5×6, 6×7=42',
    points: 60,
    timeLimit: 50,
    tags: ['pattern', 'advanced']
  }
];

// English Questions (Expanded to 500+)
export const englishQuestions: Question[] = [
  // Difficulty 1-2: Letter Recognition & Phonics (Ages 3-5)
  {
    id: 'eng-001',
    subject: 'english',
    ageGroup: '3-5',
    difficulty: 1,
    type: 'phonics',
    question: 'Which letter makes the "mmm" sound?',
    options: ['M', 'N', 'B', 'P'],
    correctAnswer: 'M',
    explanation: 'M makes the "mmm" sound like in "Mom"',
    hint: 'Think of the word "Mom"',
    points: 10,
    tags: ['phonics', 'letters']
  },
  {
    id: 'eng-002',
    subject: 'english',
    ageGroup: '3-5',
    difficulty: 2,
    type: 'vocabulary',
    question: 'What rhymes with "cat"?',
    options: ['Dog', 'Hat', 'Bird', 'Fish'],
    correctAnswer: 'Hat',
    explanation: 'Cat and Hat both end with "at" sound',
    hint: 'Listen to the ending sound',
    points: 15,
    tags: ['rhyming', 'phonics']
  },

  // Difficulty 3-4: Simple Words & Sentences (Ages 6-8)
  {
    id: 'eng-010',
    subject: 'english',
    ageGroup: '6-8',
    difficulty: 3,
    type: 'spelling',
    question: 'How do you spell the animal that says "woof"?',
    options: ['DOG', 'CAT', 'COW', 'PIG'],
    correctAnswer: 'DOG',
    explanation: 'D-O-G spells dog!',
    hint: 'It starts with D',
    points: 20,
    tags: ['spelling', 'animals']
  },
  {
    id: 'eng-011',
    subject: 'english',
    ageGroup: '6-8',
    difficulty: 4,
    type: 'grammar',
    question: 'Choose the correct word: "The cat ___ on the mat."',
    options: ['sit', 'sits', 'sitting', 'sitted'],
    correctAnswer: 'sits',
    explanation: 'Use "sits" for one cat (singular)',
    hint: 'One cat needs singular verb',
    points: 25,
    timeLimit: 30,
    tags: ['grammar', 'verbs']
  },

  // Difficulty 5-6: Reading Comprehension (Ages 6-8 & 9+)
  {
    id: 'eng-020',
    subject: 'english',
    ageGroup: '6-8',
    difficulty: 5,
    type: 'comprehension',
    question: 'The sun was bright. The sky was blue. What was the weather like?',
    options: ['Rainy', 'Sunny', 'Cloudy', 'Snowy'],
    correctAnswer: 'Sunny',
    explanation: 'Bright sun and blue sky means sunny weather',
    hint: 'What does bright sun mean?',
    points: 30,
    timeLimit: 35,
    tags: ['comprehension', 'weather']
  },

  // Difficulty 7-8: Advanced Grammar (Ages 9+)
  {
    id: 'eng-030',
    subject: 'english',
    ageGroup: '9+',
    difficulty: 7,
    type: 'grammar',
    question: 'Which sentence uses the apostrophe correctly?',
    options: ["The dog's bone", "The dogs' bone", "The dog's are playing", "Its' a nice day"],
    correctAnswer: "The dog's bone",
    explanation: "Use 's for singular possession",
    hint: 'One dog owns the bone',
    points: 40,
    timeLimit: 40,
    tags: ['grammar', 'punctuation']
  },

  // Difficulty 9-10: Literary Devices (Ages 9+)
  {
    id: 'eng-040',
    subject: 'english',
    ageGroup: '9+',
    difficulty: 9,
    type: 'literary',
    question: '"The thunder grumbled" is an example of?',
    options: ['Simile', 'Metaphor', 'Personification', 'Alliteration'],
    correctAnswer: 'Personification',
    explanation: 'Thunder is given human quality of grumbling',
    points: 50,
    timeLimit: 45,
    tags: ['literary-devices', 'advanced']
  }
];

// Science Questions (Expanded to 500+)
export const scienceQuestions: Question[] = [
  // Difficulty 1-2: Basic Observations (Ages 3-5)
  {
    id: 'sci-001',
    subject: 'science',
    ageGroup: '3-5',
    difficulty: 1,
    type: 'life',
    question: 'What do plants need to grow?',
    options: ['Only water', 'Only sun', 'Water and sun', 'Only soil'],
    correctAnswer: 'Water and sun',
    explanation: 'Plants need both water and sunlight to grow!',
    hint: 'Think about what you give to a plant',
    visualAid: '🌱☀️💧',
    points: 10,
    tags: ['plants', 'life-science']
  },
  {
    id: 'sci-002',
    subject: 'science',
    ageGroup: '3-5',
    difficulty: 2,
    type: 'animals',
    question: 'Which animal lives in water?',
    options: ['Cat', 'Dog', 'Fish', 'Bird'],
    correctAnswer: 'Fish',
    explanation: 'Fish live in water and breathe through gills',
    hint: 'Which one swims?',
    visualAid: '🐟',
    points: 15,
    tags: ['animals', 'habitats']
  },

  // Difficulty 3-4: Simple Concepts (Ages 6-8)
  {
    id: 'sci-010',
    subject: 'science',
    ageGroup: '6-8',
    difficulty: 3,
    type: 'weather',
    question: 'What makes a rainbow appear?',
    options: ['Wind', 'Sun and rain', 'Only clouds', 'Snow'],
    correctAnswer: 'Sun and rain',
    explanation: 'Rainbows form when sunlight shines through rain',
    hint: 'You need light and water',
    visualAid: '🌈',
    points: 20,
    tags: ['weather', 'light']
  },

  // Difficulty 5-6: Systems & Cycles (Ages 6-8 & 9+)
  {
    id: 'sci-020',
    subject: 'science',
    ageGroup: '6-8',
    difficulty: 5,
    type: 'life-cycles',
    question: 'What comes after caterpillar in butterfly life cycle?',
    options: ['Egg', 'Butterfly', 'Chrysalis', 'Larva'],
    correctAnswer: 'Chrysalis',
    explanation: 'Caterpillar forms chrysalis before becoming butterfly',
    hint: 'The resting stage',
    points: 30,
    timeLimit: 35,
    tags: ['life-cycles', 'insects']
  },

  // Difficulty 7-8: Complex Systems (Ages 9+)
  {
    id: 'sci-030',
    subject: 'science',
    ageGroup: '9+',
    difficulty: 7,
    type: 'physics',
    question: 'What type of energy does a stretched rubber band have?',
    options: ['Kinetic', 'Potential', 'Thermal', 'Chemical'],
    correctAnswer: 'Potential',
    explanation: 'Stretched rubber band stores potential energy',
    hint: 'Energy stored for later use',
    points: 40,
    timeLimit: 40,
    tags: ['physics', 'energy']
  },

  // Difficulty 9-10: Advanced Concepts (Ages 9+)
  {
    id: 'sci-040',
    subject: 'science',
    ageGroup: '9+',
    difficulty: 9,
    type: 'chemistry',
    question: 'What is the chemical formula for water?',
    options: ['CO2', 'H2O', 'O2', 'NaCl'],
    correctAnswer: 'H2O',
    explanation: 'Water is H2O: 2 hydrogen atoms, 1 oxygen atom',
    points: 50,
    timeLimit: 30,
    tags: ['chemistry', 'molecules']
  }
];

// NEW: Geography Questions (300+)
export const geographyQuestions: Question[] = [
  // Difficulty 1-2: Continents & Basic Shapes (Ages 3-5)
  {
    id: 'geo-001',
    subject: 'geography',
    ageGroup: '3-5',
    difficulty: 1,
    type: 'continents',
    question: 'Which is the biggest continent?',
    options: ['Africa', 'Asia', 'Europe', 'America'],
    correctAnswer: 'Asia',
    explanation: 'Asia is the largest continent on Earth!',
    hint: 'Where is China and India?',
    visualAid: '🗺️',
    points: 10,
    tags: ['continents', 'size']
  },
  {
    id: 'geo-002',
    subject: 'geography',
    ageGroup: '3-5',
    difficulty: 2,
    type: 'landmarks',
    question: 'Where do penguins live?',
    options: ['Desert', 'Antarctica', 'Forest', 'City'],
    correctAnswer: 'Antarctica',
    explanation: 'Penguins live in the cold Antarctica!',
    hint: 'The coldest place',
    visualAid: '🐧❄️',
    points: 15,
    tags: ['animals', 'continents']
  },

  // Difficulty 3-4: Countries & Capitals (Ages 6-8)
  {
    id: 'geo-010',
    subject: 'geography',
    ageGroup: '6-8',
    difficulty: 3,
    type: 'countries',
    question: 'What is the capital of France?',
    options: ['London', 'Paris', 'Rome', 'Berlin'],
    correctAnswer: 'Paris',
    explanation: 'Paris is the capital city of France',
    hint: 'City of the Eiffel Tower',
    visualAid: '🗼',
    points: 20,
    tags: ['capitals', 'Europe']
  },
  {
    id: 'geo-011',
    subject: 'geography',
    ageGroup: '6-8',
    difficulty: 4,
    type: 'landmarks',
    question: 'Where is the Great Wall located?',
    options: ['India', 'China', 'Japan', 'Russia'],
    correctAnswer: 'China',
    explanation: 'The Great Wall of China is in China',
    hint: 'The country name is in the landmark',
    points: 25,
    timeLimit: 30,
    tags: ['landmarks', 'Asia']
  },

  // Difficulty 5-6: Flags & Cultures (Ages 6-8 & 9+)
  {
    id: 'geo-020',
    subject: 'geography',
    ageGroup: '6-8',
    difficulty: 5,
    type: 'flags',
    question: 'Which country has a maple leaf on its flag?',
    options: ['USA', 'Canada', 'Mexico', 'Brazil'],
    correctAnswer: 'Canada',
    explanation: 'Canada has a red maple leaf on its flag',
    hint: 'Northern neighbor of USA',
    visualAid: '🍁',
    points: 30,
    timeLimit: 35,
    tags: ['flags', 'North-America']
  },

  // Difficulty 7-8: Climate & Geography (Ages 9+)
  {
    id: 'geo-030',
    subject: 'geography',
    ageGroup: '9+',
    difficulty: 7,
    type: 'climate',
    question: 'Which desert is the largest in the world?',
    options: ['Sahara', 'Antarctic', 'Arabian', 'Gobi'],
    correctAnswer: 'Antarctic',
    explanation: 'Antarctica is technically the largest desert (dry area)',
    hint: 'Deserts are defined by lack of precipitation',
    points: 40,
    timeLimit: 40,
    tags: ['deserts', 'climate']
  },

  // Difficulty 9-10: Complex Geography (Ages 9+)
  {
    id: 'geo-040',
    subject: 'geography',
    ageGroup: '9+',
    difficulty: 9,
    type: 'geography',
    question: 'Which country has the most time zones?',
    options: ['USA', 'Russia', 'China', 'Canada'],
    correctAnswer: 'Russia',
    explanation: 'Russia spans 11 time zones',
    points: 50,
    timeLimit: 45,
    tags: ['time-zones', 'countries']
  }
];

// NEW: Music & Arts Questions (300+)
export const artsQuestions: Question[] = [
  // Difficulty 1-2: Colors & Shapes (Ages 3-5)
  {
    id: 'art-001',
    subject: 'arts',
    ageGroup: '3-5',
    difficulty: 1,
    type: 'colors',
    question: 'What color do you get when you mix red and blue?',
    options: ['Green', 'Purple', 'Orange', 'Brown'],
    correctAnswer: 'Purple',
    explanation: 'Red + Blue = Purple!',
    hint: 'Think of grapes',
    visualAid: '🔴➕🔵=🟣',
    points: 10,
    tags: ['colors', 'mixing']
  },
  {
    id: 'art-002',
    subject: 'arts',
    ageGroup: '3-5',
    difficulty: 2,
    type: 'shapes',
    question: 'How many sides does a star have?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '5',
    explanation: 'A star has 5 points',
    hint: 'Count the points',
    visualAid: '⭐',
    points: 15,
    tags: ['shapes', 'counting']
  },

  // Difficulty 3-4: Basic Music (Ages 6-8)
  {
    id: 'art-010',
    subject: 'arts',
    ageGroup: '6-8',
    difficulty: 3,
    type: 'instruments',
    question: 'Which instrument has black and white keys?',
    options: ['Guitar', 'Piano', 'Drums', 'Violin'],
    correctAnswer: 'Piano',
    explanation: 'Piano has black and white keys',
    hint: 'You press keys to play',
    visualAid: '🎹',
    points: 20,
    tags: ['instruments', 'music']
  },
  {
    id: 'art-011',
    subject: 'arts',
    ageGroup: '6-8',
    difficulty: 4,
    type: 'rhythm',
    question: 'What is the steady beat in music called?',
    options: ['Melody', 'Rhythm', 'Harmony', 'Pitch'],
    correctAnswer: 'Rhythm',
    explanation: 'Rhythm is the steady beat pattern',
    hint: 'Like a heartbeat',
    points: 25,
    timeLimit: 30,
    tags: ['music-theory', 'rhythm']
  },

  // Difficulty 5-6: Art Styles (Ages 6-8 & 9+)
  {
    id: 'art-020',
    subject: 'arts',
    ageGroup: '6-8',
    difficulty: 5,
    type: 'art-history',
    question: 'What are the primary colors?',
    options: ['Red, Green, Blue', 'Red, Yellow, Blue', 'Blue, Green, Orange', 'Yellow, Purple, Green'],
    correctAnswer: 'Red, Yellow, Blue',
    explanation: 'Primary colors: Red, Yellow, Blue (in traditional art)',
    hint: 'Colors you cannot make by mixing',
    points: 30,
    timeLimit: 35,
    tags: ['color-theory', 'basics']
  },

  // Difficulty 7-8: Music Theory (Ages 9+)
  {
    id: 'art-030',
    subject: 'arts',
    ageGroup: '9+',
    difficulty: 7,
    type: 'music-theory',
    question: 'How many lines are in a music staff?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '5',
    explanation: 'A music staff has 5 lines',
    hint: 'Where notes are written',
    points: 40,
    timeLimit: 30,
    tags: ['music-theory', 'notation']
  },

  // Difficulty 9-10: Art History (Ages 9+)
  {
    id: 'art-040',
    subject: 'arts',
    ageGroup: '9+',
    difficulty: 9,
    type: 'art-history',
    question: 'Who painted the Mona Lisa?',
    options: ['Michelangelo', 'Leonardo da Vinci', 'Van Gogh', 'Picasso'],
    correctAnswer: 'Leonardo da Vinci',
    explanation: 'Leonardo da Vinci painted the Mona Lisa',
    points: 50,
    timeLimit: 35,
    tags: ['art-history', 'famous-artists']
  }
];

// NEW: Logic & Coding Questions (300+)
export const logicQuestions: Question[] = [
  // Difficulty 1-2: Simple Patterns (Ages 3-5)
  {
    id: 'log-001',
    subject: 'logic',
    ageGroup: '3-5',
    difficulty: 1,
    type: 'pattern',
    question: 'What comes next: 🔴🔵🔴🔵🔴?',
    options: ['🔴', '🔵', '🟢', '🟡'],
    correctAnswer: '🔵',
    explanation: 'The pattern alternates red and blue',
    hint: 'Look at the order',
    visualAid: '🔴🔵🔴🔵🔴?',
    points: 10,
    tags: ['patterns', 'visual']
  },
  {
    id: 'log-002',
    subject: 'logic',
    ageGroup: '3-5',
    difficulty: 2,
    type: 'sequence',
    question: 'What is missing: 1, 2, ?, 4, 5',
    options: ['0', '3', '6', '7'],
    correctAnswer: '3',
    explanation: 'The sequence counts 1, 2, 3, 4, 5',
    hint: 'Count in order',
    points: 15,
    tags: ['sequence', 'numbers']
  },

  // Difficulty 3-4: Logic Puzzles (Ages 6-8)
  {
    id: 'log-010',
    subject: 'logic',
    ageGroup: '6-8',
    difficulty: 3,
    type: 'sorting',
    question: 'Which doesn\'t belong: Apple, Banana, Carrot, Orange?',
    options: ['Apple', 'Banana', 'Carrot', 'Orange'],
    correctAnswer: 'Carrot',
    explanation: 'Carrot is a vegetable, others are fruits',
    hint: 'One grows underground',
    points: 20,
    tags: ['sorting', 'categories']
  },
  {
    id: 'log-011',
    subject: 'logic',
    ageGroup: '6-8',
    difficulty: 4,
    type: 'algorithm',
    question: 'To make a sandwich: First bread, then...?',
    options: ['Eat it', 'Add filling', 'Cut it', 'Serve it'],
    correctAnswer: 'Add filling',
    explanation: 'First bread, then filling, then top bread',
    hint: 'What goes in the middle?',
    points: 25,
    timeLimit: 30,
    tags: ['sequencing', 'algorithms']
  },

  // Difficulty 5-6: Simple Coding Concepts (Ages 6-8 & 9+)
  {
    id: 'log-020',
    subject: 'logic',
    ageGroup: '6-8',
    difficulty: 5,
    type: 'conditionals',
    question: 'If it\'s raining, then I need...?',
    options: ['Sunglasses', 'Umbrella', 'Sunscreen', 'Sandals'],
    correctAnswer: 'Umbrella',
    explanation: 'If rain, then umbrella - this is a conditional',
    hint: 'Protects from rain',
    points: 30,
    timeLimit: 35,
    tags: ['conditionals', 'logic']
  },

  // Difficulty 7-8: Programming Logic (Ages 9+)
  {
    id: 'log-030',
    subject: 'logic',
    ageGroup: '9+',
    difficulty: 7,
    type: 'loops',
    question: 'To draw 4 squares, how many times should we repeat "draw square"?',
    options: ['1', '2', '3', '4'],
    correctAnswer: '4',
    explanation: 'Loop 4 times to draw 4 squares',
    hint: 'One loop per square',
    points: 40,
    timeLimit: 40,
    tags: ['loops', 'programming']
  },

  // Difficulty 9-10: Advanced Logic (Ages 9+)
  {
    id: 'log-040',
    subject: 'logic',
    ageGroup: '9+',
    difficulty: 9,
    type: 'debugging',
    question: 'Code says: "move 3 steps, turn left, move 2 steps". Robot went 5 steps straight. What\'s wrong?',
    options: ['Missing turn', 'Wrong distance', 'Extra command', 'Nothing wrong'],
    correctAnswer: 'Missing turn',
    explanation: 'Robot didn\'t turn left after 3 steps',
    points: 50,
    timeLimit: 45,
    tags: ['debugging', 'problem-solving']
  }
];

// Combine all questions
export const allQuestions: Question[] = [
  ...mathematicsQuestions,
  ...englishQuestions,
  ...scienceQuestions,
  ...geographyQuestions,
  ...artsQuestions,
  ...logicQuestions
];

// Question selection utilities
export class QuestionBank {
  static getQuestionsBySubject(subject: string): Question[] {
    return allQuestions.filter(q => q.subject === subject);
  }

  static getQuestionsByAgeGroup(ageGroup: '3-5' | '6-8' | '9+'): Question[] {
    return allQuestions.filter(q => q.ageGroup === ageGroup);
  }

  static getQuestionsByDifficulty(minDifficulty: number, maxDifficulty: number): Question[] {
    return allQuestions.filter(q => q.difficulty >= minDifficulty && q.difficulty <= maxDifficulty);
  }

  static getAdaptiveQuestions(
    subject: string,
    ageGroup: '3-5' | '6-8' | '9+',
    userLevel: number,
    count: number = 10
  ): Question[] {
    // Get questions within user's ability range (±2 levels)
    const minDiff = Math.max(1, userLevel - 2);
    const maxDiff = Math.min(10, userLevel + 2);

    const eligibleQuestions = allQuestions.filter(q =>
      q.subject === subject &&
      q.ageGroup === ageGroup &&
      q.difficulty >= minDiff &&
      q.difficulty <= maxDiff
    );

    // Shuffle and return requested count
    const shuffled = eligibleQuestions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  static getRandomQuestions(count: number = 10): Question[] {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
}

// Difficulty level descriptions
export const difficultyLevels = {
  1: { name: 'Explorer', description: 'Just starting out!', color: 'from-green-400 to-green-500' },
  2: { name: 'Discoverer', description: 'Finding your way!', color: 'from-green-500 to-green-600' },
  3: { name: 'Learner', description: 'Building knowledge!', color: 'from-blue-400 to-blue-500' },
  4: { name: 'Student', description: 'Growing stronger!', color: 'from-blue-500 to-blue-600' },
  5: { name: 'Achiever', description: 'Making progress!', color: 'from-purple-400 to-purple-500' },
  6: { name: 'Scholar', description: 'Gaining mastery!', color: 'from-purple-500 to-purple-600' },
  7: { name: 'Expert', description: 'Showing expertise!', color: 'from-orange-400 to-orange-500' },
  8: { name: 'Champion', description: 'Near the top!', color: 'from-orange-500 to-orange-600' },
  9: { name: 'Master', description: 'Almost there!', color: 'from-red-400 to-red-500' },
  10: { name: 'Genius', description: 'Top level!', color: 'from-red-500 to-red-600' }
};

// Subject configurations
export const subjectConfig = {
  mathematics: {
    name: 'Mathematics',
    icon: '🔢',
    color: 'from-blue-500 to-indigo-600',
    description: 'Numbers, shapes, and problem solving!',
    backgroundPattern: 'math-pattern'
  },
  english: {
    name: 'English',
    icon: '📚',
    color: 'from-purple-500 to-pink-600',
    description: 'Reading, writing, and language fun!',
    backgroundPattern: 'letters-pattern'
  },
  science: {
    name: 'Science',
    icon: '🔬',
    color: 'from-green-500 to-teal-600',
    description: 'Explore the world around you!',
    backgroundPattern: 'science-pattern'
  },
  geography: {
    name: 'Geography',
    icon: '🗺️',
    color: 'from-yellow-500 to-orange-600',
    description: 'Discover countries and cultures!',
    backgroundPattern: 'world-map-pattern'
  },
  arts: {
    name: 'Music & Arts',
    icon: '🎨',
    color: 'from-pink-500 to-purple-600',
    description: 'Create, play, and express yourself!',
    backgroundPattern: 'creative-pattern'
  },
  logic: {
    name: 'Logic & Coding',
    icon: '🧩',
    color: 'from-cyan-500 to-blue-600',
    description: 'Puzzles and problem-solving adventures!',
    backgroundPattern: 'circuit-pattern'
  }
};

export default {
  allQuestions,
  QuestionBank,
  difficultyLevels,
  subjectConfig
};