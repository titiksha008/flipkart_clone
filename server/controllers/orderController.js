import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import CartItem from '../models/CartItem.js';
import Product from '../models/Product.js';
import db from '../config/db.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const DEFAULT_USER_ID = 1;

export const createOrder = asyncHandler(async (req, res) => {
  const { shipping_address, payment_method = 'COD' } = req.body;
  if (!shipping_address) throw new AppError('Shipping address is required', 400);

  const cartItems = await CartItem.findAll({
    where: { user_id: DEFAULT_USER_ID },
    include: [{ model: Product, as: 'product' }],
  });

  if (cartItems.length === 0) throw new AppError('Cart is empty', 400);

  const t = await db.transaction();
  try {
    const total_price = cartItems.reduce((sum, item) => {
      const discountedPrice = item.product.price * (1 - item.product.discount / 100);
      return sum + discountedPrice * item.quantity;
    }, 0);

    const order = await Order.create({
      user_id: DEFAULT_USER_ID,
      total_price: Math.round(total_price),
      shipping_address,
      payment_method,
      status: 'pending',
      payment_status: payment_method === 'COD' ? 'pending' : 'paid',
    }, { transaction: t });

    for (const item of cartItems) {
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: Math.round(item.product.price * (1 - item.product.discount / 100)),
      }, { transaction: t });

      await Product.decrement('stock', { by: item.quantity, where: { id: item.product_id }, transaction: t });
    }

    await CartItem.destroy({ where: { user_id: DEFAULT_USER_ID }, transaction: t });
    await t.commit();

    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'orderItems', include: [{ model: Product, as: 'product' }] }],
    });

    res.status(201).json({ success: true, data: fullOrder });
  } catch (err) {
    await t.rollback();
    throw err;
  }
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    where: { user_id: DEFAULT_USER_ID },
    include: [{ model: OrderItem, as: 'orderItems', include: [{ model: Product, as: 'product' }] }],
    order: [['createdAt', 'DESC']],
  });
  res.json({ success: true, data: orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    where: { id: req.params.id, user_id: DEFAULT_USER_ID },
    include: [{ model: OrderItem, as: 'orderItems', include: [{ model: Product, as: 'product' }] }],
  });
  if (!order) throw new AppError('Order not found', 404);
  res.json({ success: true, data: order });
});