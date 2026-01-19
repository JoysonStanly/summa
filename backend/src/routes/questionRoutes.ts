import express from 'express';
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../controllers/questionController';


const router = express.Router();

router.get('/sessions/:sessionId/questions', getQuestions);
router.post('/sessions/:sessionId/questions', createQuestion);

router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

export default router;
