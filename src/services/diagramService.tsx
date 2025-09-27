import React from 'react';

export interface DiagramConfig {
  id: string;
  subject: string;
  keywords: string[];
  ageGroups: ('3-5' | '6-8' | '9+')[];
  component: React.FC<{ age: string; simplified?: boolean }>;
  description: string;
}

// Mathematics Diagrams
const MathDiagrams = {
  counting: {
    id: 'math-counting',
    keywords: ['count', 'how many', 'number of', 'total'],
    component: ({ age }: { age: string }) => (
      <svg viewBox="0 0 400 300" className="w-full max-w-md" aria-label="Counting objects diagram">
        <title>Counting Objects</title>
        <desc>Visual representation of objects for counting</desc>
        {age === '3-5' ? (
          // Simple shapes for younger kids
          <>
            <circle cx="50" cy="150" r="30" fill="#FF6B6B"/>
            <circle cx="150" cy="150" r="30" fill="#4ECDC4"/>
            <circle cx="250" cy="150" r="30" fill="#45B7D1"/>
            <circle cx="350" cy="150" r="30" fill="#96CEB4"/>
            <text x="200" y="250" textAnchor="middle" fontSize="24" fill="#333">Count the circles!</text>
          </>
        ) : (
          // More complex arrangements for older kids
          <>
            {[0, 1, 2].map(row =>
              [0, 1, 2, 3].map(col => (
                <rect
                  key={`${row}-${col}`}
                  x={50 + col * 80}
                  y={50 + row * 80}
                  width="60"
                  height="60"
                  fill={`hsl(${(row * 4 + col) * 30}, 70%, 60%)`}
                  rx="10"
                />
              ))
            )}
            <text x="200" y="280" textAnchor="middle" fontSize="20" fill="#333">How many squares?</text>
          </>
        )}
      </svg>
    )
  },

  fractions: {
    id: 'math-fractions',
    keywords: ['fraction', 'half', 'quarter', 'third', 'part of', 'divided'],
    component: ({ age }: { age: string }) => (
      <svg viewBox="0 0 400 300" className="w-full max-w-md" aria-label="Fractions diagram">
        <title>Fractions Visualization</title>
        {age === '3-5' ? (
          // Simple pie chart for young kids
          <>
            <circle cx="200" cy="150" r="80" fill="#FFE66D" stroke="#333" strokeWidth="2"/>
            <path d="M 200 150 L 280 150 A 80 80 0 0 1 200 230 Z" fill="#FF6B6B"/>
            <text x="200" y="270" textAnchor="middle" fontSize="20" fill="#333">One Half</text>
          </>
        ) : (
          // More complex fractions for older kids
          <>
            <rect x="50" y="100" width="300" height="80" fill="#DDD" stroke="#333" strokeWidth="2"/>
            <rect x="50" y="100" width="75" height="80" fill="#4ECDC4"/>
            <rect x="125" y="100" width="75" height="80" fill="#45B7D1"/>
            <rect x="200" y="100" width="75" height="80" fill="#96CEB4"/>
            <text x="200" y="220" textAnchor="middle" fontSize="18" fill="#333">3/4 = Three Quarters</text>
          </>
        )}
      </svg>
    )
  },

  shapes: {
    id: 'math-shapes',
    keywords: ['shape', 'triangle', 'square', 'circle', 'rectangle', 'polygon'],
    component: ({ age }: { age: string }) => (
      <svg viewBox="0 0 400 300" className="w-full max-w-md" aria-label="Geometric shapes">
        <title>Geometric Shapes</title>
        <circle cx="100" cy="100" r="40" fill="#FF6B6B" stroke="#333" strokeWidth="2"/>
        <rect x="180" y="60" width="80" height="80" fill="#4ECDC4" stroke="#333" strokeWidth="2"/>
        <polygon points="320,140 360,60 280,60" fill="#45B7D1" stroke="#333" strokeWidth="2"/>
        {age !== '3-5' && (
          <>
            <polygon points="100,200 140,200 160,230 80,230" fill="#96CEB4" stroke="#333" strokeWidth="2"/>
            <ellipse cx="250" cy="220" rx="50" ry="30" fill="#FFE66D" stroke="#333" strokeWidth="2"/>
          </>
        )}
      </svg>
    )
  }
};

// English/Language Arts Diagrams
const EnglishDiagrams = {
  alphabet: {
    id: 'english-alphabet',
    keywords: ['letter', 'alphabet', 'abc', 'vowel', 'consonant'],
    component: ({ age }: { age: string }) => (
      <svg viewBox="0 0 400 300" className="w-full max-w-md" aria-label="Alphabet diagram">
        <title>Alphabet Letters</title>
        {age === '3-5' ? (
          // Big, colorful letters for young kids
          <>
            <text x="100" y="150" fontSize="80" fill="#FF6B6B" fontFamily="Arial, sans-serif">A</text>
            <text x="180" y="150" fontSize="80" fill="#4ECDC4" fontFamily="Arial, sans-serif">B</text>
            <text x="260" y="150" fontSize="80" fill="#45B7D1" fontFamily="Arial, sans-serif">C</text>
            <circle cx="120" cy="130" r="60" fill="none" stroke="#FFD700" strokeWidth="3" strokeDasharray="5,5"/>
          </>
        ) : (
          // More letters and categories for older kids
          <>
            <text x="200" y="50" fontSize="20" fill="#333" textAnchor="middle">Vowels</text>
            <text x="50" y="100" fontSize="40" fill="#FF6B6B">A</text>
            <text x="100" y="100" fontSize="40" fill="#FF6B6B">E</text>
            <text x="150" y="100" fontSize="40" fill="#FF6B6B">I</text>
            <text x="200" y="100" fontSize="40" fill="#FF6B6B">O</text>
            <text x="250" y="100" fontSize="40" fill="#FF6B6B">U</text>
            <text x="200" y="180" fontSize="20" fill="#333" textAnchor="middle">Consonants</text>
            <text x="50" y="230" fontSize="30" fill="#4ECDC4">B C D F G</text>
            <text x="250" y="230" fontSize="30" fill="#4ECDC4">H J K L M</text>
          </>
        )}
      </svg>
    )
  },

  rhyming: {
    id: 'english-rhyming',
    keywords: ['rhyme', 'sound alike', 'ending sound', 'word family'],
    component: ({ age }: { age: string }) => (
      <svg viewBox="0 0 400 300" className="w-full max-w-md" aria-label="Rhyming words">
        <title>Rhyming Words</title>
        <rect x="50" y="50" width="120" height="60" fill="#FFE66D" rx="10"/>
        <text x="110" y="90" fontSize="24" fill="#333" textAnchor="middle">CAT</text>

        <rect x="230" y="50" width="120" height="60" fill="#FFE66D" rx="10"/>
        <text x="290" y="90" fontSize="24" fill="#333" textAnchor="middle">HAT</text>

        <rect x="50" y="150" width="120" height="60" fill="#96CEB4" rx="10"/>
        <text x="110" y="190" fontSize="24" fill="#333" textAnchor="middle">BAT</text>

        <rect x="230" y="150" width="120" height="60" fill="#96CEB4" rx="10"/>
        <text x="290" y="190" fontSize="24" fill="#333" textAnchor="middle">MAT</text>

        <path d="M 170 80 L 230 80" stroke="#FF6B6B" strokeWidth="3" markerEnd="url(#arrowhead)"/>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#FF6B6B"/>
          </marker>
        </defs>
      </svg>
    )
  }
};

// Geography Diagrams
const GeographyDiagrams = {
  continents: {
    id: 'geo-continents',
    keywords: ['continent', 'world', 'map', 'earth', 'globe'],
    component: ({ age }: { age: string }) => (
      <svg viewBox="0 0 400 300" className="w-full max-w-md" aria-label="World continents">
        <title>World Continents</title>
        {/* Simplified world map */}
        <ellipse cx="200" cy="150" rx="180" ry="120" fill="#4A90E2" stroke="#333" strokeWidth="2"/>

        {/* Continents as simplified shapes */}
        <path d="M 150 100 Q 170 80, 190 100 T 210 120" fill="#8BC34A" stroke="#333"/> {/* North America */}
        <path d="M 160 180 Q 180 160, 200 180 T 220 200" fill="#8BC34A" stroke="#333"/> {/* South America */}
        <ellipse cx="250" cy="120" rx="30" ry="25" fill="#8BC34A" stroke="#333"/> {/* Europe */}
        <ellipse cx="280" cy="150" rx="40" ry="35" fill="#8BC34A" stroke="#333"/> {/* Africa */}
        <ellipse cx="320" cy="130" rx="35" ry="30" fill="#8BC34A" stroke="#333"/> {/* Asia */}
        <ellipse cx="310" cy="200" rx="25" ry="20" fill="#8BC34A" stroke="#333"/> {/* Australia */}

        {age !== '3-5' && (
          <>
            <text x="150" y="90" fontSize="10" fill="#333">N. America</text>
            <text x="160" y="210" fontSize="10" fill="#333">S. America</text>
            <text x="240" y="110" fontSize="10" fill="#333">Europe</text>
            <text x="270" y="150" fontSize="10" fill="#333">Africa</text>
            <text x="310" y="120" fontSize="10" fill="#333">Asia</text>
          </>
        )}
      </svg>
    )
  },

  landmarks: {
    id: 'geo-landmarks',
    keywords: ['mountain', 'river', 'ocean', 'desert', 'forest', 'landmark'],
    component: ({ age }: { age: string }) => (
      <svg viewBox="0 0 400 300" className="w-full max-w-md" aria-label="Geographic landmarks">
        <title>Geographic Features</title>
        {/* Sky */}
        <rect x="0" y="0" width="400" height="150" fill="#87CEEB"/>

        {/* Mountains */}
        <polygon points="50,150 150,50 250,150" fill="#8B7355" stroke="#333" strokeWidth="2"/>
        <polygon points="150,150 250,80 350,150" fill="#A0826D" stroke="#333" strokeWidth="2"/>

        {/* Snow caps */}
        <polygon points="150,50 120,80 180,80" fill="#FFF"/>
        <polygon points="250,80 220,110 280,110" fill="#FFF"/>

        {/* Ground */}
        <rect x="0" y="150" width="400" height="150" fill="#90EE90"/>

        {/* River */}
        <path d="M 100 200 Q 200 180, 300 220 T 400 200"
              fill="none" stroke="#4A90E2" strokeWidth="15" strokeLinecap="round"/>

        {/* Trees */}
        <circle cx="50" cy="170" r="20" fill="#228B22"/>
        <rect x="45" y="170" width="10" height="30" fill="#8B4513"/>

        <circle cx="350" cy="160" r="20" fill="#228B22"/>
        <rect x="345" y="160" width="10" height="30" fill="#8B4513"/>

        {age !== '3-5' && (
          <>
            <text x="150" y="40" fontSize="12" fill="#333" textAnchor="middle">Mountains</text>
            <text x="200" y="240" fontSize="12" fill="#333" textAnchor="middle">River</text>
          </>
        )}
      </svg>
    )
  }
};

// Logic Diagrams
const LogicDiagrams = {
  patterns: {
    id: 'logic-patterns',
    keywords: ['pattern', 'sequence', 'next', 'order', 'series'],
    component: ({ age }: { age: string }) => (
      <svg viewBox="0 0 400 300" className="w-full max-w-md" aria-label="Pattern sequence">
        <title>Pattern Sequence</title>
        {age === '3-5' ? (
          // Simple color pattern
          <>
            <circle cx="50" cy="150" r="30" fill="#FF6B6B"/>
            <rect x="100" y="120" width="60" height="60" fill="#4ECDC4"/>
            <circle cx="210" cy="150" r="30" fill="#FF6B6B"/>
            <rect x="260" y="120" width="60" height="60" fill="#4ECDC4"/>
            <text x="350" y="160" fontSize="40" fill="#999">?</text>
          </>
        ) : (
          // More complex pattern
          <>
            <rect x="30" y="120" width="40" height="40" fill="#FF6B6B"/>
            <rect x="80" y="110" width="50" height="50" fill="#4ECDC4"/>
            <rect x="150" y="100" width="60" height="60" fill="#45B7D1"/>
            <rect x="230" y="90" width="70" height="70" fill="#96CEB4"/>
            <rect x="320" y="80" width="80" height="80" fill="#999" opacity="0.5"/>
            <text x="360" y="130" fontSize="30" fill="#FFF">?</text>
            <text x="200" y="220" fontSize="14" fill="#333" textAnchor="middle">Growing pattern</text>
          </>
        )}
      </svg>
    )
  },

  sorting: {
    id: 'logic-sorting',
    keywords: ['sort', 'order', 'arrange', 'smallest', 'largest', 'size'],
    component: ({ age }: { age: string }) => (
      <svg viewBox="0 0 400 300" className="w-full max-w-md" aria-label="Sorting by size">
        <title>Sorting Objects</title>
        <rect x="50" y="150" width="30" height="30" fill="#FF6B6B"/>
        <rect x="120" y="130" width="50" height="50" fill="#4ECDC4"/>
        <rect x="210" y="110" width="70" height="70" fill="#45B7D1"/>
        <rect x="310" y="90" width="90" height="90" fill="#96CEB4"/>

        <path d="M 65 200 L 355 200" stroke="#333" strokeWidth="2" markerEnd="url(#arrow)"/>
        <text x="200" y="230" fontSize="16" fill="#333" textAnchor="middle">Small to Large</text>

        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#333"/>
          </marker>
        </defs>
      </svg>
    )
  }
};

// Arts Diagrams
const ArtsDiagrams = {
  colors: {
    id: 'arts-colors',
    keywords: ['color', 'paint', 'primary', 'mix', 'blend', 'palette'],
    component: ({ age }: { age: string }) => (
      <svg viewBox="0 0 400 300" className="w-full max-w-md" aria-label="Color mixing diagram">
        <title>Color Mixing</title>
        {/* Primary colors */}
        <circle cx="150" cy="100" r="50" fill="#FF0000" opacity="0.8"/>
        <circle cx="250" cy="100" r="50" fill="#0000FF" opacity="0.8"/>
        <circle cx="200" cy="170" r="50" fill="#FFFF00" opacity="0.8"/>

        {/* Overlapping areas show color mixing */}
        <text x="200" y="40" fontSize="18" fill="#333" textAnchor="middle">Primary Colors</text>

        {age !== '3-5' && (
          <>
            <text x="150" y="100" fontSize="14" fill="#FFF" textAnchor="middle">Red</text>
            <text x="250" y="100" fontSize="14" fill="#FFF" textAnchor="middle">Blue</text>
            <text x="200" y="170" fontSize="14" fill="#333" textAnchor="middle">Yellow</text>
            <text x="200" y="250" fontSize="14" fill="#333" textAnchor="middle">Mix to make new colors!</text>
          </>
        )}
      </svg>
    )
  },

  instruments: {
    id: 'arts-instruments',
    keywords: ['music', 'instrument', 'sound', 'drum', 'piano', 'guitar'],
    component: ({ age }: { age: string }) => (
      <svg viewBox="0 0 400 300" className="w-full max-w-md" aria-label="Musical instruments">
        <title>Musical Instruments</title>

        {/* Drum */}
        <ellipse cx="100" cy="150" rx="40" ry="15" fill="#8B4513"/>
        <rect x="60" y="150" width="80" height="60" fill="#D2691E"/>
        <ellipse cx="100" cy="210" rx="40" ry="15" fill="#8B4513"/>
        <line x1="70" y1="150" x2="70" y2="210" stroke="#333" strokeWidth="2"/>
        <line x1="130" y1="150" x2="130" y2="210" stroke="#333" strokeWidth="2"/>

        {/* Guitar */}
        <ellipse cx="250" cy="180" rx="30" ry="40" fill="#8B4513"/>
        <rect x="245" y="120" width="10" height="60" fill="#654321"/>
        <line x1="248" y1="120" x2="248" y2="180" stroke="#FFD700" strokeWidth="1"/>
        <line x1="250" y1="120" x2="250" y2="180" stroke="#FFD700" strokeWidth="1"/>
        <line x1="252" y1="120" x2="252" y2="180" stroke="#FFD700" strokeWidth="1"/>

        {/* Musical notes */}
        <text x="320" y="130" fontSize="30">♪</text>
        <text x="340" y="150" fontSize="30">♫</text>
        <text x="320" y="180" fontSize="30">♪</text>

        {age !== '3-5' && (
          <>
            <text x="100" y="250" fontSize="12" fill="#333" textAnchor="middle">Drum</text>
            <text x="250" y="250" fontSize="12" fill="#333" textAnchor="middle">Guitar</text>
          </>
        )}
      </svg>
    )
  }
};

// Compile all diagrams with metadata
export const DIAGRAM_REGISTRY: Record<string, DiagramConfig> = {
  // Math diagrams
  'math-counting': {
    id: 'math-counting',
    subject: 'mathematics',
    keywords: MathDiagrams.counting.keywords,
    ageGroups: ['3-5', '6-8', '9+'],
    component: MathDiagrams.counting.component,
    description: 'Visual counting aids with objects'
  },
  'math-fractions': {
    id: 'math-fractions',
    subject: 'mathematics',
    keywords: MathDiagrams.fractions.keywords,
    ageGroups: ['6-8', '9+'],
    component: MathDiagrams.fractions.component,
    description: 'Fraction visualization using shapes'
  },
  'math-shapes': {
    id: 'math-shapes',
    subject: 'mathematics',
    keywords: MathDiagrams.shapes.keywords,
    ageGroups: ['3-5', '6-8', '9+'],
    component: MathDiagrams.shapes.component,
    description: 'Geometric shapes identification'
  },

  // English diagrams
  'english-alphabet': {
    id: 'english-alphabet',
    subject: 'english',
    keywords: EnglishDiagrams.alphabet.keywords,
    ageGroups: ['3-5', '6-8'],
    component: EnglishDiagrams.alphabet.component,
    description: 'Alphabet letters and categories'
  },
  'english-rhyming': {
    id: 'english-rhyming',
    subject: 'english',
    keywords: EnglishDiagrams.rhyming.keywords,
    ageGroups: ['3-5', '6-8'],
    component: EnglishDiagrams.rhyming.component,
    description: 'Rhyming word patterns'
  },

  // Geography diagrams
  'geo-continents': {
    id: 'geo-continents',
    subject: 'geography',
    keywords: GeographyDiagrams.continents.keywords,
    ageGroups: ['6-8', '9+'],
    component: GeographyDiagrams.continents.component,
    description: 'World continents map'
  },
  'geo-landmarks': {
    id: 'geo-landmarks',
    subject: 'geography',
    keywords: GeographyDiagrams.landmarks.keywords,
    ageGroups: ['3-5', '6-8', '9+'],
    component: GeographyDiagrams.landmarks.component,
    description: 'Geographic features and landmarks'
  },

  // Logic diagrams
  'logic-patterns': {
    id: 'logic-patterns',
    subject: 'logic',
    keywords: LogicDiagrams.patterns.keywords,
    ageGroups: ['3-5', '6-8', '9+'],
    component: LogicDiagrams.patterns.component,
    description: 'Pattern recognition and sequences'
  },
  'logic-sorting': {
    id: 'logic-sorting',
    subject: 'logic',
    keywords: LogicDiagrams.sorting.keywords,
    ageGroups: ['3-5', '6-8', '9+'],
    component: LogicDiagrams.sorting.component,
    description: 'Sorting and ordering objects'
  },

  // Arts diagrams
  'arts-colors': {
    id: 'arts-colors',
    subject: 'arts',
    keywords: ArtsDiagrams.colors.keywords,
    ageGroups: ['3-5', '6-8', '9+'],
    component: ArtsDiagrams.colors.component,
    description: 'Color theory and mixing'
  },
  'arts-instruments': {
    id: 'arts-instruments',
    subject: 'arts',
    keywords: ArtsDiagrams.instruments.keywords,
    ageGroups: ['3-5', '6-8', '9+'],
    component: ArtsDiagrams.instruments.component,
    description: 'Musical instruments identification'
  }
};

// Enhanced diagram selection function
export function selectDiagramForQuestion(
  question: string,
  subject: string,
  ageGroup: string
): DiagramConfig | null {
  const lowercaseQuestion = question.toLowerCase();
  const relevantDiagrams = Object.values(DIAGRAM_REGISTRY).filter(diagram => {
    // Filter by subject
    if (diagram.subject !== subject && subject !== 'general') {
      return false;
    }

    // Filter by age group
    const age = ageGroup as '3-5' | '6-8' | '9+';
    if (!diagram.ageGroups.includes(age)) {
      return false;
    }

    // Check if any keyword matches
    return diagram.keywords.some(keyword =>
      lowercaseQuestion.includes(keyword.toLowerCase())
    );
  });

  // Return the most relevant diagram or null
  return relevantDiagrams.length > 0 ? relevantDiagrams[0] : null;
}

// Component to render diagrams with proper accessibility
export const DiagramRenderer: React.FC<{
  question: string;
  subject: string;
  ageGroup: string;
}> = ({ question, subject, ageGroup }) => {
  const diagram = selectDiagramForQuestion(question, subject, ageGroup);

  if (!diagram) {
    return null;
  }

  const DiagramComponent = diagram.component;

  return (
    <div className="inline-block bg-white/20 rounded-2xl p-6 border border-white/30">
      <div className="diagram-container" role="img" aria-label={diagram.description}>
        <DiagramComponent age={ageGroup} />
        <p className="sr-only">{diagram.description}</p>
      </div>
      <p className="text-white/80 mt-4">Educational Diagram</p>
    </div>
  );
};

export default {
  DIAGRAM_REGISTRY,
  selectDiagramForQuestion,
  DiagramRenderer
};