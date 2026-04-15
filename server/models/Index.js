import User from "./User.js";
import Product from "./Product.js";
import Category from "./Category.js";
import Order from "./Order.js";
import OrderItem from "./OrderItem.js";
import CartItem from "./CartItem.js";
import Review from "./Review.js";
import Wishlist from "./Wishlist.js";

// Category ↔ Product
if (!Category.associations.products) {
  Category.hasMany(Product, {
    foreignKey: "category_id",
    as: "products",
  });
}

if (!Product.associations.category) {
  Product.belongsTo(Category, {
    foreignKey: "category_id",
    as: "category",
  });
}

// User ↔ Order
if (!User.associations.orders) {
  User.hasMany(Order, {
    foreignKey: "user_id",
    as: "orders",
  });
}

if (!Order.associations.user) {
  Order.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });
}

// Order ↔ OrderItem
if (!Order.associations.orderItems) {
  Order.hasMany(OrderItem, {
    foreignKey: "order_id",
    as: "orderItems",
  });
}

if (!OrderItem.associations.order) {
  OrderItem.belongsTo(Order, {
    foreignKey: "order_id",
    as: "order",
  });
}

// Product ↔ OrderItem
if (!Product.associations.orderItems) {
  Product.hasMany(OrderItem, {
    foreignKey: "product_id",
    as: "orderItems",
  });
}

if (!OrderItem.associations.product) {
  OrderItem.belongsTo(Product, {
    foreignKey: "product_id",
    as: "product",
  });
}

// User ↔ CartItem
if (!User.associations.cartItems) {
  User.hasMany(CartItem, {
    foreignKey: "user_id",
    as: "cartItems",
  });
}

if (!CartItem.associations.user) {
  CartItem.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });
}

// Product ↔ CartItem
if (!Product.associations.cartItems) {
  Product.hasMany(CartItem, {
    foreignKey: "product_id",
    as: "cartItems",
  });
}

if (!CartItem.associations.product) {
  CartItem.belongsTo(Product, {
    foreignKey: "product_id",
    as: "product",
  });
}

// User ↔ Review
if (!User.associations.reviews) {
  User.hasMany(Review, {
    foreignKey: "user_id",
    as: "reviews",
  });
}

if (!Review.associations.user) {
  Review.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });
}

// Product ↔ Review
if (!Product.associations.reviews) {
  Product.hasMany(Review, {
    foreignKey: "product_id",
    as: "reviews",
  });
}

if (!Review.associations.product) {
  Review.belongsTo(Product, {
    foreignKey: "product_id",
    as: "product",
  });
}

// User ↔ Wishlist
if (!User.associations.wishlists) {
  User.hasMany(Wishlist, {
    foreignKey: "user_id",
    as: "wishlists",
  });
}

if (!Wishlist.associations.user) {
  Wishlist.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });
}

// Product ↔ Wishlist
if (!Product.associations.wishlists) {
  Product.hasMany(Wishlist, {
    foreignKey: "product_id",
    as: "wishlists",
  });
}

if (!Wishlist.associations.product) {
  Wishlist.belongsTo(Product, {
    foreignKey: "product_id",
    as: "product",
  });
}

export {
  User,
  Product,
  Category,
  Order,
  OrderItem,
  CartItem,
  Review,
  Wishlist,
};