// src/routes/dishRoutes.js
const express = require('express');
const DishController = require('../controllers/dishController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware'); // Importez les middlewares

const router = express.Router();

// Applique le middleware d'authentification et d'admin à toutes les routes de gestion des plats
router.use(authMiddleware); // L'utilisateur doit être authentifié
router.use(isAdmin);       // L'utilisateur doit être un administrateur

// Routes pour la gestion des plats
router.get('/', DishController.getAllDishes); // GET /api/dishes
router.post('/', DishController.addDish);     // POST /api/dishes (pour ajouter un nouveau plat)
router.put('/:id', DishController.updateDish); // PUT /api/dishes/:id
router.delete('/:id', DishController.deleteDish); // DELETE /api/dishes/:id

module.exports = router;
