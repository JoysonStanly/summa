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


const router = express.Router();

router.post('/', createDiscussion);

router.route('/problem/:problemId').get(getProblemDiscussions);
router.route('/user/:userId').get(getUserDiscussions);

router.get('/:id', getDiscussion);
router.put('/:id', updateDiscussion);
router.delete('/:id', deleteDiscussion);

router.route('/:id/like').post(toggleLike);
router.route('/:id/comments').post(addComment);

export default router;
