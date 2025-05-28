const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Route pour l'inscription
router.post('/register', authController.register);

module.exports = router;