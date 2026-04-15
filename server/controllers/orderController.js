import sequelize from '../config/db.js';
import {
  Order,
  OrderItem,
  CartItem,
  Product,
  User,
} from '../models/index.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const DEFAULT_USER_ID = 1;

export const createOrder = asyncHandler(async (req, res) => {
  const { shipping_address, payment_method = 'COD' } = req.body;

  const user = await User.findByPk(DEFAULT_USER_ID);
  if (!user) {
    throw new AppError(
      'Default user not found. Please seed the database so user id 1 exists.',
      500
    );
  }

  if (!shipping_address || !shipping_address.trim()) {
    throw new AppError('Shipping address is required', 400);
  }

  const cartItems = await CartItem.findAll({
    where: { user_id: DEFAULT_USER_ID },
    include: [
      {
        model: Product,
        as: 'product',
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  if (!cartItems.length) {
    throw new AppError('Your cart is empty', 400);
  }

  const totalPrice = cartItems.reduce((sum, item) => {
    const productPrice = Number(item.product?.price || 0);
    return sum + productPrice * Number(item.quantity);
  }, 0);

  const paymentStatus = payment_method === 'COD' ? 'pending' : 'paid';

  const createdOrder = await sequelize.transaction(async (t) => {
    const order = await Order.create(
      {
        user_id: DEFAULT_USER_ID,
        total_price: totalPrice,
        shipping_address: shipping_address.trim(),
        status: 'pending',
        payment_method,
        payment_status: paymentStatus,
      },
      { transaction: t }
    );

    const orderItemsData = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.product.price,
    }));

    await OrderItem.bulkCreate(orderItemsData, { transaction: t });

    await CartItem.destroy({
      where: { user_id: DEFAULT_USER_ID },
      transaction: t,
    });

    return order;
  });

  const fullOrder = await Order.findByPk(createdOrder.id, {
    include: [
      {
        model: OrderItem,
        as: 'orderItems',
        include: [
          {
            model: Product,
            as: 'product',
          },
        ],
      },
    ],
  });

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: fullOrder,
  });
});

export const getOrders = asyncHandler(async (req, res) => {
  const user = await User.findByPk(DEFAULT_USER_ID);

  if (!user) {
    throw new AppError(
      'Default user not found. Please seed the database so user id 1 exists.',
      500
    );
  }

  const orders = await Order.findAll({
    where: { user_id: DEFAULT_USER_ID },
    include: [
      {
        model: OrderItem,
        as: 'orderItems',
        include: [
          {
            model: Product,
            as: 'product',
          },
        ],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  res.json({
    success: true,
    data: orders,
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const user = await User.findByPk(DEFAULT_USER_ID);

  if (!user) {
    throw new AppError(
      'Default user not found. Please seed the database so user id 1 exists.',
      500
    );
  }

  const order = await Order.findOne({
    where: {
      id: req.params.id,
      user_id: DEFAULT_USER_ID,
    },
    include: [
      {
        model: OrderItem,
        as: 'orderItems',
        include: [
          {
            model: Product,
            as: 'product',
          },
        ],
      },
    ],
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.json({
    success: true,
    data: order,
  });
});