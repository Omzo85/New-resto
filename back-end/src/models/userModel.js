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
  // username: { // Ce champ a été supprimé comme demandé
  //   type: DataTypes.STRING,
  //   allowNull: true,
  //   unique: true
  // },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: { // C'est le champ où le hachage du mot de passe sera stocké (password_hash dans la DB)
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password_hash' // Mappe le champ 'password' du modèle à la colonne 'password_hash' de la DB
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user' // Rôle par défaut
  },
  street_number: { // Nouveau champ d'adresse
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  street_name: {   // Nouveau champ d'adresse
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  postal_code: {   // Nouveau champ d'adresse
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  city: {          // Nouveau champ d'adresse
    type: DataTypes.STRING(255),
    allowNull: false,
  }
}, {
  tableName: 'USERS', // Nom de la table dans la BDD
  timestamps: false // Si vous ne voulez pas de colonnes createdAt/updatedAt
});

module.exports = User;
