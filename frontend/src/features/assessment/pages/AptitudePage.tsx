import React from 'react';
import AssessmentPage from '../components/AssessmentPage';
import { aptitudeCategories } from '../data';

const AptitudePage: React.FC = () => {
  return (
    <AssessmentPage
      categories={aptitudeCategories}
      title="Quantitative Aptitude"
      searchPlaceholder="Search aptitude topics..."
      basePath="/quiz"
      quizType="aptitude"
    />
  );
};

export default AptitudePage;
