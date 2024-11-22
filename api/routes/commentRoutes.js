import express from 'express';
import { getComments, createComment, updateComment, deleteComment } from '../controllers/commentController.js';
import { authenticateToken } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', getComments);
router.post('/', authenticateToken, createComment);
router.put('/:id', authenticateToken, updateComment);
router.delete('/:id', authenticateToken, deleteComment);

export default router;