import type { AptitudeCategory } from '../../types';
import { basicQuestions } from './Basic/questions';
import { advanceQuestions } from './Advance/questions';

export const bloodRelationsCategory: AptitudeCategory = {
  id: 'blood-relations',
  name: 'Blood Relations',
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
