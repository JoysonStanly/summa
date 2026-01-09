import express from 'express';
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../controllers/questionController';
import { protect } from '../middleware/auth';
import { optionalAuth } from '../middleware/optionalAuth';

const router = express.Router();

// Session questions routes
router.route('/sessions/:sessionId/questions')
  .get(optionalAuth, getQuestions)
  .post(protect, createQuestion);

// Individual question routes
router.route('/questions/:id')
  .put(protect, updateQuestion)
  .delete(protect, deleteQuestion);

export default router;
