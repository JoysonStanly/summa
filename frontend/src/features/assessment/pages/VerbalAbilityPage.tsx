import React from 'react';
import AssessmentPage from '../components/AssessmentPage';
import { verbalAbilityCategories } from '../data';

const VerbalAbilityPage: React.FC = () => {
  return (
    <AssessmentPage
      categories={verbalAbilityCategories}
      title="Verbal Ability"
      searchPlaceholder="Search verbal ability topics..."
      basePath="/verbal-ability"
      quizType="verbal-ability"
    />
  );
};

export default VerbalAbilityPage;
