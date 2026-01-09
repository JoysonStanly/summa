import type { AptitudeCategory } from '../../types';
import { basicQuestions } from './Basic/questions';
import { advanceQuestions } from './Advance/questions';

export const readingComprehensionCategory: AptitudeCategory = {
  id: 'reading-comprehension',
  name: 'Reading Comprehension',
  subCategories: [
    {
      id: 'basic',
      name: 'Basic',
      questions: basicQuestions
    },
    {
      id: 'advance',
      name: 'Advance',
      questions: advanceQuestions
    }
  ]
};
