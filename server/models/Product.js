import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  discount: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  brand: {
    type: DataTypes.STRING,
  },
  images: {
    type: DataTypes.JSON,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  review_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export default Product;