import { Op } from 'sequelize';
import { Product, Category } from '../models/index.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

export const getProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    page = 1,
    limit = 12,
    minPrice,
    maxPrice,
    sort,
  } = req.query;

  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  const offset = (parsedPage - 1) * parsedLimit;

  const where = {};

  if (search) {
    where.name = { [Op.like]: `%${search}%` };
  }

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
    limit: parsedLimit,
    offset,
    distinct: true,
  });

  res.json({
    success: true,
    data: rows,
    pagination: {
      total: count,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(count / parsedLimit),
    },
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id, {
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug'],
      },
    ],
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.json({ success: true, data: product });
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const currentId = parseInt(req.params.id, 10);

  const current = await Product.findByPk(currentId, {
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug'],
      },
    ],
  });

  if (!current) {
    throw new AppError('Product not found', 404);
  }

  const categoryId = current.category_id;
  const brand = current.brand?.trim().toLowerCase();

  const allOthers = await Product.findAll({
    where: { id: { [Op.ne]: currentId } },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug'],
      },
    ],
    order: [['rating', 'DESC']],
    limit: 100,
  });

  const sameCategory = allOthers.filter(
    (p) => Number(p.category_id) === Number(categoryId)
  );

  let similar = [...sameCategory].sort(
    (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
  );

  if (similar.length < 4) {
    const usedIds = new Set(similar.map((p) => p.id));
    const filler = allOthers.filter((p) => !usedIds.has(p.id));
    similar = [...similar, ...filler];
  }

  similar = similar.slice(0, 12);

  const sameBrandDiffCat = allOthers.filter((p) => {
    const pBrand = p.brand?.trim().toLowerCase();
    return brand && pBrand === brand && Number(p.category_id) !== Number(categoryId);
  });

  const sameBrandIds = new Set(sameBrandDiffCat.map((p) => p.id));
  const remainingForAlsoBought = allOthers.filter(
    (p) => !sameBrandIds.has(p.id)
  );

  const alsoBought = [...sameBrandDiffCat, ...remainingForAlsoBought]
    .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
    .slice(0, 12);

  const fbtPool = similar.length >= 2 ? similar : allOthers;

  const fbtCompanions = [...fbtPool]
    .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
    .slice(0, 2);

  res.json({
    success: true,
    data: {
      similar,
      alsoBought,
      fbtCompanions,
    },
  });
});