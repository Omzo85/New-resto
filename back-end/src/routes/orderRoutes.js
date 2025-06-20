// src/routes/orderRoutes.js
const express = require('express');
const OrderController = require('../controllers/orderController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware'); // Importez les middlewares

const router = express.Router();

// Applique le middleware d'authentification et d'admin à toutes les routes de gestion des commandes
router.use(authMiddleware); // L'utilisateur doit être authentifié
router.use(isAdmin);       // L'utilisateur doit être un administrateur

// Route pour récupérer toutes les commandes (GET /api/orders)
router.get('/', OrderController.getAllOrders);

// Route pour mettre à jour le statut d'une commande (PATCH /api/orders/:id/status)
router.patch('/:id/status', OrderController.updateOrderStatus);

// Vous pouvez ajouter d'autres routes ici (ex: GET /api/orders/:id pour une commande spécifique)

module.exports = router;
