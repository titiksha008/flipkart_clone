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

// Payment methods that are considered immediately paid
const PAID_METHODS = ['UPI', 'CARD', 'NET_BANKING'];

export const createOrder = asyncHandler(async (req, res) => {
  const { shipping_address, payment_method = 'COD' } = req.body;

  // ── 1. Validate payment_method ───────────────────────────────────────────
  const VALID_PAYMENT_METHODS = ['COD', 'UPI', 'CARD', 'NET_BANKING'];
  if (!VALID_PAYMENT_METHODS.includes(payment_method)) {
    throw new AppError(
      `Invalid payment method "${payment_method}". Must be one of: ${VALID_PAYMENT_METHODS.join(', ')}`,
      400
    );
  }

  // ── 2. Validate user exists ──────────────────────────────────────────────
  const user = await User.findByPk(DEFAULT_USER_ID);
  if (!user) {
    throw new AppError(
      'Default user not found. Please seed the database so user id 1 exists.',
      500
    );
  }

  // ── 3. Validate shipping address ─────────────────────────────────────────
  if (!shipping_address || !shipping_address.trim()) {
    throw new AppError('Shipping address is required', 400);
  }

  // ── 4. Fetch cart items ───────────────────────────────────────────────────
  const cartItems = await CartItem.findAll({
    where: { user_id: DEFAULT_USER_ID },
    include: [{ model: Product, as: 'product' }],
    order: [['createdAt', 'DESC']],
  });

  if (!cartItems.length) {
    throw new AppError('Your cart is empty', 400);
  }

  // ── 5. Pre-transaction stock validation ───────────────────────────────────
  const stockErrors = [];
  for (const item of cartItems) {
    const product = item.product;
    if (!product) {
      stockErrors.push(`Product with id ${item.product_id} no longer exists.`);
      continue;
    }
    if (product.stock < item.quantity) {
      stockErrors.push(
        `"${product.name}" — only ${product.stock} left in stock, but you requested ${item.quantity}.`
      );
    }
  }

  if (stockErrors.length > 0) {
    throw new AppError(
      `Cannot place order due to insufficient stock:\n${stockErrors.join('\n')}`,
      400
    );
  }

  // ── 6. Calculate total ───────────────────────────────────────────────────
  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + Number(item.product.price) * Number(item.quantity);
  }, 0);

  const paymentStatus = PAID_METHODS.includes(payment_method) ? 'paid' : 'pending';

  // ── 7. Transaction: lock rows → validate → decrement stock → create order ─
  const createdOrder = await sequelize.transaction(async (t) => {

    for (const item of cartItems) {
      // Lock the row so concurrent orders can't race on the same stock
      const [rows] = await sequelize.query(
        `SELECT id, name, stock FROM Products WHERE id = ? FOR UPDATE`,
        {
          replacements: [item.product_id],
          transaction: t,
          raw: true,
        }
      );

      const freshProduct = rows[0];

      if (!freshProduct) {
        throw new AppError(
          `Product with id ${item.product_id} no longer exists.`,
          404
        );
      }

      if (freshProduct.stock < item.quantity) {
        throw new AppError(
          `"${freshProduct.name}" just ran low — only ${freshProduct.stock} left in stock but you need ${item.quantity}. Please update your cart.`,
          400
        );
      }

      // Atomic decrement — WHERE stock >= ? prevents going negative
      const [result] = await sequelize.query(
        `UPDATE Products SET stock = stock - ?, updatedAt = NOW() WHERE id = ? AND stock >= ?`,
        {
          replacements: [item.quantity, item.product_id, item.quantity],
          transaction: t,
          raw: true,
        }
      );

      if (result.affectedRows === 0) {
        throw new AppError(
          `Could not reserve stock for "${freshProduct.name}". Please try again.`,
          409
        );
      }

      console.log(
        `[Stock] Product ${item.product_id} "${freshProduct.name}": ${freshProduct.stock} → ${freshProduct.stock - item.quantity} (decremented by ${item.quantity})`
      );
    }

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

  // ── 8. Return full order ─────────────────────────────────────────────────
  const fullOrder = await Order.findByPk(createdOrder.id, {
    include: [
      {
        model: OrderItem,
        as: 'orderItems',
        include: [{ model: Product, as: 'product' }],
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
        include: [{ model: Product, as: 'product' }],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  res.json({ success: true, data: orders });
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
    where: { id: req.params.id, user_id: DEFAULT_USER_ID },
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