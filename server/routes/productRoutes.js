import express from 'express';
import {
  getProducts,
  getProductById,
  getRecommendations,
} from '../controllers/productControllers.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id/recommendations', getRecommendations);
router.get('/:id', getProductById);

export default router;