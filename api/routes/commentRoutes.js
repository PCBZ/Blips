import express from 'express';
import { getComments, createComment, updateComment, deleteComment } from '../controllers/commentController.js';
import { requireAuth } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', getComments);
router.post('/', requireAuth, createComment);
router.put('/:id', requireAuth, updateComment);
router.delete('/:id', requireAuth, deleteComment);

export default router;