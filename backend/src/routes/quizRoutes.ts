import express from 'express';
import {
  getQuizzes,
  getQuiz,
  getQuizQuestions,
  submitQuizAttempt,
  getUserQuizAttempts,
  createQuiz,
} from '../controllers/quizController';


const router = express.Router();

router.route('/').get(getQuizzes).post(createQuiz);

router.route('/attempts').get(getUserQuizAttempts);

router.route('/:id').get(getQuiz);
router.route('/:id/questions').get(getQuizQuestions);
router.route('/:id/submit').post(submitQuizAttempt);

export default router;
