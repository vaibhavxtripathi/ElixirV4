import { Router } from 'express';
import { getAllBlogs, createBlog, updateBlog, deleteBlog } from '../controllers/blogController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllBlogs); 

// Admin only routes
router.post('/', authenticateToken, requireRole(['ADMIN']), createBlog); // POST /api/blogs
router.put('/:id', authenticateToken, requireRole(['ADMIN']), updateBlog); // PUT /api/blogs/:id
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), deleteBlog); // DELETE /api/blogs/:id

export default router;