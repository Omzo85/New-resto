// src/models/dishModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dish = sequelize.define('Dish', {
  id: {
    type: DataTypes.STRING(255), // Matches VARCHAR(255) in the database
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image_url: { // Corresponds to image_url in the database
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'DISHES', // Table name in the database
  timestamps: false // If you don't want createdAt/updatedAt columns
});

module.exports = Dish;
