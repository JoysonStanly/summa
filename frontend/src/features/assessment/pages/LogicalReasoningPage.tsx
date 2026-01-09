import React from 'react';
import AssessmentPage from '../components/AssessmentPage';
import { logicalReasoningCategories } from '../data';

const LogicalReasoningPage: React.FC = () => {
  return (
    <AssessmentPage
      categories={logicalReasoningCategories}
      title="Logical Reasoning"
      searchPlaceholder="Search logical reasoning topics..."
      basePath="/logical-reasoning"
      quizType="logical-reasoning"
    />
  );
};

export default LogicalReasoningPage;
