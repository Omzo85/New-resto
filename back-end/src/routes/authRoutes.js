// src/routes/authRoutes.js

const express = require('express');
const AuthController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware'); // Importe 'authMiddleware'
const User = require('../models/userModel'); // <-- Ajout de l'importation du modèle User

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Nouvelle route pour vérifier le token JWT
// Elle utilise le middleware 'authMiddleware'
router.get('/verify-token', authMiddleware, async (req, res) => { // <-- Utilise 'authMiddleware' et rend la fonction async
  // Si le middleware 'authMiddleware' est passé, cela signifie que req.userId est défini
  // et que le token est valide.
  // Nous allons maintenant récupérer les informations complètes de l'utilisateur depuis la base de données.
  try {
    const userDetails = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] } // Exclut le mot de passe haché par sécurité
    });

    if (!userDetails) {
      return res.status(404).json({ message: "User details not found for the provided token." });
    }

    res.status(200).json({
      id: userDetails.id,
      username: userDetails.username,
      email: userDetails.email,
      nom: userDetails.nom,
      prenom: userDetails.prenom,
      role: userDetails.role // Inclure le rôle si votre modèle User le contient
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des détails de l'utilisateur pour /verify-token :", error);
    res.status(500).json({ message: "Erreur serveur lors de la vérification du token." });
  }
});


module.exports = router;
