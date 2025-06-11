// src/config/database.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config(); // Charge les variables d'environnement

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // <-- Ajout du port de la base de données
  dialect: 'mysql',
  logging: false, // Désactive le logging SQL par défaut pour plus de clarté
  retry: {
    max: 5,
    timeout: 3000,
    match: [
      /SequelizeConnectionRefusedError/,
      /SequelizeConnectionError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/
    ]
  }
});

// Exportez l'instance sequelize directement
module.exports = sequelize; // <-- Correction ici : exportez l'instance directement
