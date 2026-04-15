import express from 'express';
import { createOrder, getOrders, getOrderById } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);

export default router;