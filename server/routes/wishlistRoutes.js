import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/WishlistController.js';

const router = express.Router();

// Default user flow (no auth required for now)
router.get('/', getWishlist);
router.post('/toggle', addToWishlist);
router.delete('/:id', removeFromWishlist);

export default router;