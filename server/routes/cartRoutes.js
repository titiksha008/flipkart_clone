import express from 'express';
import {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update/:id', updateCart);
router.delete('/:id', removeFromCart);
router.delete('/', clearCart);

export default router;