import { Op } from 'sequelize';
import { Product, Category } from '../models/index.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

export const getProducts = asyncHandler(async (req, res) => {
  const { search, category, page = 1, limit = 12, minPrice, maxPrice, sort } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const where = {};

  if (search) where.name = { [Op.like]: `%${search}%` };

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
    if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
  }

  const include = [
    {
      model: Category,
      as: 'category',
      attributes: ['id', 'name', 'slug'],
    },
  ];

  if (category) {
    include[0].where = { slug: category };
  }

  const order = [];
  if (sort === 'price_asc') order.push(['price', 'ASC']);
  else if (sort === 'price_desc') order.push(['price', 'DESC']);
  else if (sort === 'rating') order.push(['rating', 'DESC']);
  else order.push(['createdAt', 'DESC']);

  const { count, rows } = await Product.findAndCountAll({
    where,
    include,
    order,
    limit: parseInt(limit),
    offset,
    distinct: true,
  });

  res.json({
    success: true,
    data: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit)),
    },
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id, {
    include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
  });

  if (!product) throw new AppError('Product not found', 404);

  res.json({ success: true, data: product });
});