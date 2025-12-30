import express from 'express';
import {
  getProblemDiscussions,
  getDiscussion,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  toggleLike,
  addComment,
  getUserDiscussions,
} from '../controllers/discussionController';
import { protect } from '../middleware/auth';

const router = express.Router();

router
  .route('/')
  .post(protect, createDiscussion);

router.route('/problem/:problemId').get(getProblemDiscussions);
router.route('/user/:userId').get(getUserDiscussions);

router
  .route('/:id')
  .get(getDiscussion)
  .put(protect, updateDiscussion)
  .delete(protect, deleteDiscussion);

router.route('/:id/like').post(protect, toggleLike);
router.route('/:id/comments').post(protect, addComment);

export default router;
