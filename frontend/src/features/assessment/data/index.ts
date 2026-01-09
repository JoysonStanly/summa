// Export types
export * from './types';

// Export Aptitude categories
export { numbersCategory } from './Aptitude/Numbers';

// Export Logical Reasoning categories
export { bloodRelationsCategory } from './LogicalReasoning/BloodRelations';
export { patternRecognitionCategory } from './LogicalReasoning/PatternRecognition';
export { puzzlesCategory } from './LogicalReasoning/Puzzles';
export { seriesCompletionCategory } from './LogicalReasoning/SeriesCompletion';

// Export Verbal Ability categories
export { readingComprehensionCategory } from './VerbalAbility/ReadingComprehension';
export { sentenceCorrectionCategory } from './VerbalAbility/SentenceCorrection';
export { vocabularyCategory } from './VerbalAbility/Vocabulary';

// Import categories
import { numbersCategory } from './Aptitude/Numbers';
import { bloodRelationsCategory } from './LogicalReasoning/BloodRelations';
import { patternRecognitionCategory } from './LogicalReasoning/PatternRecognition';
import { puzzlesCategory } from './LogicalReasoning/Puzzles';
import { seriesCompletionCategory } from './LogicalReasoning/SeriesCompletion';
import { readingComprehensionCategory } from './VerbalAbility/ReadingComprehension';
import { sentenceCorrectionCategory } from './VerbalAbility/SentenceCorrection';
import { vocabularyCategory } from './VerbalAbility/Vocabulary';

// Aptitude Categories
export const aptitudeCategories = [
  numbersCategory,
  {
    id: 'lcm-hcf',
    name: 'LCM and HCF',
    subCategories: []
  },
  {
    id: 'work-wages',
    name: 'Work and Wages',
    subCategories: []
  },
  {
    id: 'pipes-cisterns',
    name: 'Pipes and Cisterns',
    subCategories: []
  },
  {
    id: 'time-speed-distance',
    name: 'Time, Speed and Distance',
    subCategories: []
  },
  {
    id: 'trains-boats',
    name: 'Trains, Boats and Streams',
    subCategories: []
  },
  {
    id: 'percentage',
    name: 'Percentage',
    subCategories: []
  },
  {
    id: 'ratio-proportion',
    name: 'Ratio and Proportion',
    subCategories: []
  },
  {
    id: 'partnership',
    name: 'Partnership',
    subCategories: []
  },
  {
    id: 'mixtures-alligation',
    name: 'Mixtures and Alligation',
    subCategories: []
  },
  {
    id: 'algebra',
    name: 'Algebra',
    subCategories: []
  },
  {
    id: 'average',
    name: 'Average',
    subCategories: []
  },
  {
    id: 'age',
    name: 'Age',
    subCategories: []
  },
  {
    id: 'profit-loss',
    name: 'Profit and Loss',
    subCategories: []
  },
  {
    id: 'simple-interest',
    name: 'Simple Interest',
    subCategories: []
  },
  {
    id: 'compound-interest',
    name: 'Compound Interest',
    subCategories: []
  },
  {
    id: 'mensuration-2d',
    name: 'Mensuration 2D',
    subCategories: []
  },
  {
    id: 'trigonometry',
    name: 'Trigonometry & Height and Distances',
    subCategories: []
  },
  {
    id: 'progressions',
    name: 'Progressions',
    subCategories: []
  },
  {
    id: 'logarithms',
    name: 'Logarithms',
    subCategories: []
  },
  {
    id: 'permutation-combination',
    name: 'Permutation and Combination',
    subCategories: []
  },
  {
    id: 'probability',
    name: 'Probability',
    subCategories: []
  },
  {
    id: 'geometry',
    name: 'Geometry',
    subCategories: []
  },
  {
    id: 'race',
    name: 'Race',
    subCategories: []
  },
  {
    id: 'simplification',
    name: 'Simplification and Approximation',
    subCategories: []
  }
];

// Logical Reasoning Categories
export const logicalReasoningCategories = [
  bloodRelationsCategory,
  patternRecognitionCategory,
  puzzlesCategory,
  seriesCompletionCategory,
  {
    id: 'coding-decoding',
    name: 'Coding-Decoding',
    subCategories: []
  },
  {
    id: 'direction-sense',
    name: 'Direction Sense',
    subCategories: []
  },
  {
    id: 'syllogisms',
    name: 'Syllogisms',
    subCategories: []
  },
  {
    id: 'analogies',
    name: 'Analogies',
    subCategories: []
  },
  {
    id: 'data-sufficiency',
    name: 'Data Sufficiency',
    subCategories: []
  }
];

// Verbal Ability Categories
export const verbalAbilityCategories = [
  readingComprehensionCategory,
  sentenceCorrectionCategory,
  vocabularyCategory,
  {
    id: 'synonyms-antonyms',
    name: 'Synonyms & Antonyms',
    subCategories: []
  },
  {
    id: 'idioms-phrases',
    name: 'Idioms & Phrases',
    subCategories: []
  },
  {
    id: 'fill-in-blanks',
    name: 'Fill in the Blanks',
    subCategories: []
  },
  {
    id: 'para-jumbles',
    name: 'Para Jumbles',
    subCategories: []
  },
  {
    id: 'spotting-errors',
    name: 'Spotting Errors',
    subCategories: []
  }
];
