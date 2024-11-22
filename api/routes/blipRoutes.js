import express from 'express';
import { getBlips, createBlip, getBlip, updateBlip, deleteBlip } from '../controllers/blipController.js';
import { authenticateToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', getBlips);
router.get('/:id', getBlip);
router.post('/', authenticateToken, createBlip);
router.put('/:id', authenticateToken, updateBlip);
router.delete('/:id', authenticateToken, deleteBlip);

export default router;