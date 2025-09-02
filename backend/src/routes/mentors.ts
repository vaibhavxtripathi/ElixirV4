import { Router } from 'express';
import { getAllMentors, createMentor, updateMentor, deleteMentor } from '../controllers/mentorController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllMentors); 

// Admin only routes
router.post('/', authenticateToken, requireRole(['ADMIN']), createMentor); 
router.put('/:id', authenticateToken, requireRole(['ADMIN']), updateMentor); 
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), deleteMentor); 

export default router;