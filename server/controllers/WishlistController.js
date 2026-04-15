import { Wishlist, Product, User } from '../models/index.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const DEFAULT_USER_ID = 1;

const getCurrentUserId = async () => {
  const user = await User.findByPk(DEFAULT_USER_ID);

  if (!user) {
    throw new AppError(
      'Default user not found. Please run your seed file so user id 1 exists.',
      500
    );
  }

  return DEFAULT_USER_ID;
};

export const getWishlist = asyncHandler(async (req, res) => {
  const userId = await getCurrentUserId();

  const items = await Wishlist.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Product,
        as: 'product',
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  res.json({
    success: true,
    data: items,
  });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const userId = await getCurrentUserId();
  const { product_id } = req.body;

  if (!product_id) {
    throw new AppError('product_id is required', 400);
  }

  const product = await Product.findByPk(product_id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const existing = await Wishlist.findOne({
    where: {
      user_id: userId,
      product_id,
    },
  });

  if (existing) {
    await existing.destroy();

    return res.json({
      success: true,
      wishlisted: false,
      product_id,
      message: 'Removed from wishlist',
    });
  }

  const created = await Wishlist.create({
    user_id: userId,
    product_id,
  });

  res.status(201).json({
    success: true,
    wishlisted: true,
    product_id,
    data: created,
    message: 'Added to wishlist',
  });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = await getCurrentUserId();

  const deletedCount = await Wishlist.destroy({
    where: {
      id: req.params.id,
      user_id: userId,
    },
  });

  if (!deletedCount) {
    throw new AppError('Wishlist item not found', 404);
  }

  res.json({
    success: true,
    message: 'Removed from wishlist',
  });
});