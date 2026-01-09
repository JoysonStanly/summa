import type { AptitudeCategory } from '../../types';
import { basicQuestions } from './Basic/questions';
import { advanceQuestions } from './Advance/questions';

export const vocabularyCategory: AptitudeCategory = {
  id: 'vocabulary',
  name: 'Vocabulary',
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
