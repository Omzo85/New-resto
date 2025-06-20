// src/controllers/userController.js
const User = require('../models/userModel');

class UserController {
  async getAllUsers(req, res) {
    try {
      // Récupère tous les utilisateurs depuis la base de données
      // Exclut le mot de passe haché pour des raisons de sécurité
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] }
    });
      // Renvoie la liste des utilisateurs
      res.status(200).json(users);
    } catch (error) {
      console.error("Erreur lors de la récupération de tous les utilisateurs :", error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des utilisateurs.', error: error.message });
    }
  }

  // Vous pouvez ajouter d'autres méthodes ici si nécessaire pour la gestion des utilisateurs (ex: getUserById, updateUser, deleteUser)
}

module.exports = new UserController();
