import { Routes, Route } from 'react-router-dom';
import ProblemSubmitPage from '../pages/ProblemSubmitPage';

const ProblemRoutes = () => {
  return (
    <Routes>
      <Route path="/problems/:problemId/submit" element={<ProblemSubmitPage />} />
      {/* Add other problem-related routes here */}
    </Routes>
  );
};

export default ProblemRoutes;