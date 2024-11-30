import express from 'express';
import { getBlips, createBlip, getBlip, updateBlip, deleteBlip } from '../controllers/blipController.js';
import { requireAuth, uploadSingle } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', getBlips);
router.get('/:id', getBlip);
router.post('/', requireAuth, uploadSingle, createBlip);
router.put('/:id', requireAuth, uploadSingle, updateBlip);
router.delete('/:id', requireAuth, deleteBlip);

export default router;