// src/models/cartItemModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel'); // Assurez-vous que le chemin est correct
const Dish = require('./dishModel'); // Assurez-vous que le chemin est correct

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Référence le modèle User
      key: 'id'
    },
    field: 'user_id' // Mappe à la colonne user_id dans la BDD
  },
  dishId: {
    type: DataTypes.STRING(255), // Utilisez STRING pour les IDs de plats VARCHAR
    allowNull: false,
    references: {
      model: Dish, // Référence le modèle Dish
      key: 'id'
    },
    field: 'dish_id' // Mappe à la colonne dish_id dans la BDD
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'CART_ITEMS', // Nom de la table dans la BDD
  timestamps: false, // Pas de createdAt/updatedAt
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'dish_id'] // Assure l'unicité par utilisateur et plat
    }
  ]
});

// Définir les associations
// Un CartItem appartient à un User
CartItem.belongsTo(User, { foreignKey: 'userId', as: 'User' });
// Un CartItem appartient à un Dish
CartItem.belongsTo(Dish, { foreignKey: 'dishId', as: 'Dish' });

module.exports = CartItem;
