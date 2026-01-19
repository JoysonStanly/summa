import express from 'express';
import { execute } from '../controllers/executeController';
import { optionalAuth } from '../middleware/optionalAuth';

const router = express.Router();

// Allow both authenticated and unauthenticated users to run code (adjust as needed)
router.post('/', optionalAuth, execute);

export default router;
