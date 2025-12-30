import express from 'express';
import {
  getSubjects,
  getSubject,
  createSubject,
  getModulesBySubject,
  getModule,
  createModule,
  getTopicsByModule,
  getTopic,
  createTopic,
} from '../controllers/subjectController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Subject routes
router
  .route('/subjects')
  .get(getSubjects)
  .post(protect, authorize('admin'), createSubject);

router.route('/subjects/:id').get(getSubject);
router.route('/subjects/:subjectId/modules').get(getModulesBySubject);

// Module routes
router.route('/modules').post(protect, authorize('admin'), createModule);
router.route('/modules/:id').get(getModule);
router.route('/modules/:moduleId/topics').get(getTopicsByModule);

// Topic routes
router.route('/topics').post(protect, authorize('admin'), createTopic);
router.route('/topics/:id').get(getTopic);

export default router;
