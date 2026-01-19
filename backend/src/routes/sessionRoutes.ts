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


const router = express.Router();

router.get('/', getSessions);
router.post('/', createSession);

router.get('/:id', getSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

router.route('/:id/register').post(registerForSession);
router.route('/:id/unregister').post(unregisterFromSession);
router.route('/:id/is-registered').get(checkRegistration);

export default router;
