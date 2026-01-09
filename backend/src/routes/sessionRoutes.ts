import express from 'express';
import {
  getSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
  registerForSession,
  unregisterFromSession,
  checkRegistration,
} from '../controllers/sessionController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router
  .route('/')
  .get(getSessions)
  .post(protect, authorize('instructor', 'admin'), createSession);

router
  .route('/:id')
  .get(getSession)
  .put(protect, authorize('instructor', 'admin'), updateSession)
  .delete(protect, authorize('instructor', 'admin'), deleteSession);

router.route('/:id/register').post(protect, registerForSession);
router.route('/:id/unregister').post(protect, unregisterFromSession);
router.route('/:id/is-registered').get(protect, checkRegistration);

export default router;
