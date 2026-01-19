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


const router = express.Router();

router.get('/subjects', getSubjects);
router.post('/subjects', createSubject);

router.route('/subjects/:id').get(getSubject);
router.route('/subjects/:subjectId/modules').get(getModulesBySubject);

// Module routes
router.route('/modules').post(createModule);
router.route('/modules/:id').get(getModule);
router.route('/modules/:moduleId/topics').get(getTopicsByModule);

// Topic routes
router.route('/topics').post(createTopic);
router.route('/topics/:id').get(getTopic);

export default router;
