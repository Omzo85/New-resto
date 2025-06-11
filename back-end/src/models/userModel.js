// src/models/userModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importez l'instance directement

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: { // C'est le champ où le hachage du mot de passe sera stocké
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password_hash' // <-- CORRECTION ICI : Mappe le champ 'password' du modèle à la colonne 'password_hash' de la DB
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user' // Rôle par défaut
  }
}, {
  tableName: 'USERS', // Nom de la table dans la BDD
  timestamps: false // Si vous ne voulez pas de colonnes createdAt/updatedAt
});

module.exports = User;
