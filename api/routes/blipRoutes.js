import express from 'express';
import { getBlips, createBlip, getBlip, updateBlip, deleteBlip, uploadSingle } from '../controllers/blipController.js';
import { authenticateToken, conditionalMiddleware } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', conditionalMiddleware(authenticateToken), getBlips);
router.get('/:id', getBlip);
router.post('/', authenticateToken, uploadSingle, createBlip);
router.put('/:id', authenticateToken, uploadSingle, updateBlip);
router.delete('/:id', authenticateToken, deleteBlip);

export default router;