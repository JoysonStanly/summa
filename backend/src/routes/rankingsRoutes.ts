import express from 'express';
import {
  getCategoryRankings,
  getDifficultyRankings,
  getUserMastery,
  getCategories,
  getWeeklyChampions,
} from '../controllers/rankingsController';

const router = express.Router();

router.route('/categories').get(getCategories);
router.route('/category/:category').get(getCategoryRankings);
router.route('/difficulty/:difficulty').get(getDifficultyRankings);
router.route('/mastery/:userId').get(getUserMastery);
router.route('/weekly-champions').get(getWeeklyChampions);

export default router;
