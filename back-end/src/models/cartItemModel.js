// src/models/cartItemModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assurez-vous que ce chemin est correct
const User = require('./userModel'); // Importez le modèle User
const Dish = require('./dishModel'); // Importez le modèle Dish

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: { // Clé étrangère vers USERS
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  dish_id: { // Clé étrangère vers DISHES
    type: DataTypes.STRING, // <-- CORRECTION : dish_id est une chaîne de caractères
    allowNull: false,
    references: {
      model: Dish,
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  tableName: 'CART_ITEMS', // Assurez-vous que le nom de la table correspond
  timestamps: false, // Pas de createdAt/updatedAt pour cette table si elle n'en a pas
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'dish_id'], // Index unique pour assurer un seul article par plat et utilisateur
    },
  ],
});

// Définir les associations
CartItem.belongsTo(User, { foreignKey: 'user_id' });
CartItem.belongsTo(Dish, { foreignKey: 'dish_id' });

module.exports = CartItem;
