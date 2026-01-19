import express from 'express';
import {
  getBugReports,
  getBugReport,
  createBugReport,
  updateBugReport,
  deleteBugReport,
  getMyBugReports,
  assignBug,
} from '../controllers/bugController';


const router = express.Router();


router.get('/my-bugs', getMyBugReports);
router.get('/', getBugReports);
router.post('/', createBugReport);
router.get('/:id', getBugReport);
router.put('/:id', updateBugReport);
router.delete('/:id', deleteBugReport);
router.put('/:id/assign', assignBug);

export default router;
