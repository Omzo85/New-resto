// src/routes/userRoutes.js
const express = require('express');
const UserController = require('../controllers/userController'); // Importe l'instance du contrôleur
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware'); // Importe les middlewares

const router = express.Router();

// --- DÉBOGAGE : Vérification de l'importation du contrôleur ---
// Ces logs s'afficheront lors du démarrage du serveur Node.js dans Docker
console.log('--- Débogage userRoutes.js ---');
console.log('Type de UserController :', typeof UserController);
console.log('UserController (l\'instance) :', UserController);
console.log('Type de UserController.getAllUsers :', typeof UserController.getAllUsers);
console.log('UserController.getAllUsers (la fonction) :', UserController.getAllUsers);
console.log('-----------------------------');
// -------------------------------------------------------------

// Applique le middleware d'authentification et d'admin à toutes les routes de gestion des utilisateurs
router.use(authMiddleware); // L'utilisateur doit être authentifié
router.use(isAdmin);       // L'utilisateur doit être un administrateur

// Route pour récupérer tous les utilisateurs (pour l'admin)
router.get('/', UserController.getAllUsers);

module.exports = router;
