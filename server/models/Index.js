import User from './User.js';
import Product from './Product.js';
import Category from './Category.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import CartItem from './CartItem.js';
import Review from './Review.js';

// Category ↔ Product
Category.hasMany(Product, {
  foreignKey: 'category_id',
  as: 'products',
});
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category',
});

// User ↔ Order
User.hasMany(Order, {
  foreignKey: 'user_id',
  as: 'orders',
});
Order.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Order ↔ OrderItem
Order.hasMany(OrderItem, {
  foreignKey: 'order_id',
  as: 'orderItems',
});
OrderItem.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order',
});

// Product ↔ OrderItem
Product.hasMany(OrderItem, {
  foreignKey: 'product_id',
  as: 'orderItems',
});
OrderItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// User ↔ CartItem
User.hasMany(CartItem, {
  foreignKey: 'user_id',
  as: 'cartItems',
});
CartItem.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Product ↔ CartItem
Product.hasMany(CartItem, {
  foreignKey: 'product_id',
  as: 'cartItems',
});
CartItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// User ↔ Review
User.hasMany(Review, {
  foreignKey: 'user_id',
  as: 'reviews',
});
Review.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Product ↔ Review
Product.hasMany(Review, {
  foreignKey: 'product_id',
  as: 'reviews',
});
Review.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

export { User, Product, Category, Order, OrderItem, CartItem, Review };