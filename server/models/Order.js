import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Order = sequelize.define('Order', {
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
  type: DataTypes.ENUM('COD', 'UPI', 'CARD'),  // uppercase
  defaultValue: 'COD',
},
payment_status: {
  type: DataTypes.ENUM('pending', 'paid'),       // fix this too
  defaultValue: 'pending',
},
});

export default Order;