import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Order = sequelize.define('Order', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  shipping_address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending',
  },
  payment_method: {
    type: DataTypes.ENUM('COD', 'UPI', 'CARD'),
    defaultValue: 'COD',
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid'),
    defaultValue: 'pending',
  },
});

export default Order;