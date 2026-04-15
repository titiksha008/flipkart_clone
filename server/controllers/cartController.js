import { CartItem, Product, User } from '../models/index.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const DEFAULT_USER_ID = 1;

export const getCart = asyncHandler(async (req, res) => {
  const user = await User.findByPk(DEFAULT_USER_ID);

  if (!user) {
    throw new AppError(
      'Default user not found. Please seed the database so user id 1 exists.',
      500
    );
  }

  const items = await CartItem.findAll({
    where: { user_id: DEFAULT_USER_ID },
    include: [
      {
        model: Product,
        as: 'product',
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  res.json({ success: true, data: items });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { product_id, quantity = 1 } = req.body;

  if (!product_id) {
    throw new AppError('product_id is required', 400);
  }

  const parsedProductId = Number(product_id);
  const parsedQuantity = Number(quantity);

  if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
    throw new AppError('Invalid product_id', 400);
  }

  if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
    throw new AppError('Quantity must be at least 1', 400);
  }

  const user = await User.findByPk(DEFAULT_USER_ID);
  if (!user) {
    throw new AppError(
      'Default user not found. Please run the seed file first so user id 1 exists.',
      500
    );
  }

  const product = await Product.findByPk(parsedProductId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  let item = await CartItem.findOne({
    where: {
      user_id: DEFAULT_USER_ID,
      product_id: parsedProductId,
    },
  });

  const existingQty = item ? item.quantity : 0;
  const finalQty = existingQty + parsedQuantity;

  if (product.stock < finalQty) {
    throw new AppError('Insufficient stock', 400);
  }

  let statusCode = 200;

  if (item) {
    item.quantity = finalQty;
    await item.save();
  } else {
    item = await CartItem.create({
      user_id: DEFAULT_USER_ID,
      product_id: parsedProductId,
      quantity: parsedQuantity,
    });
    statusCode = 201;
  }

  const updatedItem = await CartItem.findByPk(item.id, {
    include: [
      {
        model: Product,
        as: 'product',
      },
    ],
  });

  res.status(statusCode).json({
    success: true,
    data: updatedItem,
  });
});

export const updateCart = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const parsedQuantity = Number(quantity);

  if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
    throw new AppError('Quantity must be >= 1', 400);
  }

  const item = await CartItem.findOne({
    where: {
      id: req.params.id,
      user_id: DEFAULT_USER_ID,
    },
  });

  if (!item) {
    throw new AppError('Cart item not found', 404);
  }

  const product = await Product.findByPk(item.product_id);
  if (!product) {
    throw new AppError('Associated product not found', 404);
  }

  if (product.stock < parsedQuantity) {
    throw new AppError('Insufficient stock', 400);
  }

  item.quantity = parsedQuantity;
  await item.save();

  const updatedItem = await CartItem.findByPk(item.id, {
    include: [
      {
        model: Product,
        as: 'product',
      },
    ],
  });

  res.json({ success: true, data: updatedItem });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const item = await CartItem.findOne({
    where: {
      id: req.params.id,
      user_id: DEFAULT_USER_ID,
    },
  });

  if (!item) {
    throw new AppError('Cart item not found', 404);
  }

  await item.destroy();

  res.json({ success: true, message: 'Item removed' });
});

export const clearCart = asyncHandler(async (req, res) => {
  await CartItem.destroy({
    where: { user_id: DEFAULT_USER_ID },
  });

  res.json({ success: true, message: 'Cart cleared' });
});