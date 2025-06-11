// src/models/dishModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assurez-vous que ce chemin est correct

const Dish = sequelize.define('Dish', {
  id: {
    type: DataTypes.STRING, // <-- CORRECTION : ID est une chaîne de caractères
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true, // Peut être nul
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image_url: { // Correspond à image_url dans votre table
    type: DataTypes.STRING,
    allowNull: true, // Peut être nul
  },
}, {
  tableName: 'DISHES', // Assurez-vous que le nom de la table correspond à votre base de données
  timestamps: false, // Pas de createdAt/updatedAt pour cette table si elle n'en a pas dans votre DB
});

module.exports = Dish;
