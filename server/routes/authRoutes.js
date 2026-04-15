import express from 'express';
import {
  signup,
  login,
  logout,
  getMe,
  updateMe,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

export default router;