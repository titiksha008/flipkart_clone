import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const OrderItem = sequelize.define('OrderItem', {
  quantity:          { type: DataTypes.INTEGER, allowNull: false },
  price_at_purchase: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
});

export default OrderItem;