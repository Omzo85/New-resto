// src/models/orderItemModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./orderModel'); // Assurez-vous que le chemin est correct
const Dish = require('./dishModel');   // Assurez-vous que le chemin est correct

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  order_id: { // Clé étrangère vers la commande
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: 'id'
    }
  },
  dish_id: { // Clé étrangère vers le plat (VARCHAR comme dans Dish)
    type: DataTypes.STRING(255),
    allowNull: false,
    references: {
      model: Dish,
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price_at_purchase: { // Prix du plat au moment de l'achat pour éviter les modifications futures
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'ORDER_ITEMS',
  timestamps: false // Désactive les colonnes createdAt/updatedAt
});

// Définir les associations
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'Order' });
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'OrderItems' });

OrderItem.belongsTo(Dish, { foreignKey: 'dish_id', as: 'Dish' });
Dish.hasMany(OrderItem, { foreignKey: 'dish_id', as: 'OrderItems' });


module.exports = OrderItem;
