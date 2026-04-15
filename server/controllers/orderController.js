import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import CartItem from '../models/CartItem.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import db from '../config/db.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const DEFAULT_USER_ID = 1;

const getCurrentUser = async () => {
  const user = await User.findByPk(DEFAULT_USER_ID);

  if (!user) {
    throw new AppError(
      'Default user not found. Please run your seed file so user id 1 exists.',
      500
    );
  }

  return user;
};

export const createOrder = asyncHandler(async (req, res) => {
  const user = await getCurrentUser();
  const userId = user.id;
  const { shipping_address, payment_method = 'COD' } = req.body;

  if (!shipping_address) {
    throw new AppError('Shipping address is required', 400);
  }

  const cartItems = await CartItem.findAll({
    where: { user_id: userId },
    include: [{ model: Product, as: 'product' }],
  });

  if (cartItems.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  for (const item of cartItems) {
    if (!item.product) {
      throw new AppError('A cart item has no associated product', 400);
    }

    if (item.product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${item.product.name}`, 400);
    }
  }

  const t = await db.transaction();

  try {
    const total_price = cartItems.reduce((sum, item) => {
      const discountedPrice =
        Number(item.product.price) * (1 - Number(item.product.discount || 0) / 100);

      return sum + discountedPrice * Number(item.quantity);
    }, 0);

    const order = await Order.create(
      {
        user_id: userId,
        total_price: Number(total_price.toFixed(2)),
        shipping_address,
        payment_method,
        status: 'pending',
        payment_status: payment_method === 'COD' ? 'pending' : 'paid',
      },
      { transaction: t }
    );

    for (const item of cartItems) {
      const discountedPrice = Number(
        (
          Number(item.product.price) *
          (1 - Number(item.product.discount || 0) / 100)
        ).toFixed(2)
      );

      await OrderItem.create(
        {
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: discountedPrice,
        },
        { transaction: t }
      );

      await Product.decrement('stock', {
        by: item.quantity,
        where: { id: item.product_id },
        transaction: t,
      });
    }

    await CartItem.destroy({
      where: { user_id: userId },
      transaction: t,
    });

    await t.commit();

    const fullOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{ model: Product, as: 'product' }],
        },
      ],
    });

    try {
      if (user.email) {
        await sendOrderConfirmationEmail({
          to: user.email,
          name: user.name,
          order: fullOrder,
        });
      }
    } catch (err) {
      console.error('Email failed:', err.message);
    }

    res.status(201).json({ success: true, data: fullOrder });
  } catch (err) {
    await t.rollback();
    throw err;
  }
});

export const getOrders = asyncHandler(async (req, res) => {
  const user = await getCurrentUser();

  const orders = await Order.findAll({
    where: { user_id: user.id },
    include: [
      {
        model: OrderItem,
        as: 'orderItems',
        include: [{ model: Product, as: 'product' }],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  res.json({ success: true, data: orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const user = await getCurrentUser();

  const order = await Order.findOne({
    where: { id: req.params.id, user_id: user.id },
    include: [
      {
        model: OrderItem,
        as: 'orderItems',
        include: [{ model: Product, as: 'product' }],
      },
    ],
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.json({ success: true, data: order });
});