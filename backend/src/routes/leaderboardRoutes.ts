import express from 'express';
import {
  getLeaderboard,
  getUserRank,
  getTopPerformers,
} from '../controllers/leaderboardController';

const router = express.Router();

router.route('/').get(getLeaderboard);
router.route('/top').get(getTopPerformers);
router.route('/rank/:userId').get(getUserRank);

export default router;
