// src/routes/cartRoutes.js
const express = require('express');
const CartController = require('../controllers/cartController');
const { authMiddleware } = require('../middlewares/authMiddleware'); // Importez votre middleware d'authentification

const router = express.Router();

// Toutes les routes du panier nécessitent une authentification
router.use(authMiddleware); // Applique le middleware à toutes les routes ci-dessous

// Récupérer le panier d'un utilisateur
// GET /api/cart/:userId (Note: l'ID est tiré de req.userId par le middleware, pas du paramètre d'URL direct pour la sécurité)
router.get('/:userId', CartController.getCart); // Utilisez req.userId dans le contrôleur

// Ajouter un plat au panier
// POST /api/cart/add
router.post('/add', CartController.addToCart);

// Supprimer un plat du panier
// DELETE /api/cart/remove/:dishId
router.delete('/remove/:dishId', CartController.removeFromCart);

// Mettre à jour la quantité d'un plat dans le panier
// PUT /api/cart/update
router.put('/update', CartController.updateQuantity);

// Vider tout le panier
// DELETE /api/cart/clear
router.delete('/clear', CartController.clearCart);

module.exports = router;
