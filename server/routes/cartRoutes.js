import express from 'express';
import {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id', updateCart);
router.delete('/:id', removeFromCart);
router.delete('/', clearCart);

export default router;