import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Category = sequelize.define('Category', {
  name:      { type: DataTypes.STRING, allowNull: false },
  slug:      { type: DataTypes.STRING, allowNull: false, unique: true },
  parent_id: { type: DataTypes.INTEGER, defaultValue: null },
});

export default Category;