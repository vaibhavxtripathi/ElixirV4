import { Router } from 'express';
const jwt = require('jsonwebtoken');
// import { register, login, getMe } from '../controllers/authController';
// import { authenticateToken } from '../middleware/auth';

const router = Router();

// // Public routes (anyone can access)
// router.post('/register', register); // POST /api/auth/register
// router.post('/login', login);       // POST /api/auth/login

// // Protected routes (need valid token)
// router.get('/me', authenticateToken, getMe); // GET /api/auth/me

export default router;