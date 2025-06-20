// src/models/orderModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel'); // Assurez-vous que le chemin est correct

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: { // Clé étrangère vers l'utilisateur
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  order_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending' // pending, preparing, delivering, delivered, cancelled
  }
}, {
  tableName: 'ORDERS',
  timestamps: false // Désactive les colonnes createdAt/updatedAt
});

// Définir l'association : Une commande appartient à un utilisateur
Order.belongsTo(User, { foreignKey: 'user_id', as: 'User' });
User.hasMany(Order, { foreignKey: 'user_id', as: 'Orders' });

module.exports = Order;
