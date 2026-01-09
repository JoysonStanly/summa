import type { AptitudeCategory } from '../../types';
import { basicQuestions } from './Basic/questions';
import { advanceQuestions } from './Advance/questions';

export const patternRecognitionCategory: AptitudeCategory = {
  id: 'pattern-recognition',
  name: 'Pattern Recognition',
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
