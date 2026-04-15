import Category from '../models/Category.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.findAll({ order: [['name', 'ASC']] });
  res.json({ success: true, data: categories });
});