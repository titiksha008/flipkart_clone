import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Wishlist = sequelize.define('Wishlist', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Wishlist;