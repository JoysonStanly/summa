import express from 'express';
import {
  getQuizzes,
  getQuiz,
  getQuizQuestions,
  submitQuizAttempt,
  getUserQuizAttempts,
  createQuiz,
} from '../controllers/quizController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/').get(getQuizzes).post(protect, authorize('admin'), createQuiz);

router.route('/attempts').get(protect, getUserQuizAttempts);

router.route('/:id').get(getQuiz);
router.route('/:id/questions').get(protect, getQuizQuestions);
router.route('/:id/submit').post(protect, submitQuizAttempt);

export default router;
