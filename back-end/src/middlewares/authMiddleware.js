// src/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); // Importez dotenv

dotenv.config(); // Chargez les variables d'environnement depuis .env

const authMiddleware = (req, res, next) => {
    // Le token peut être dans l'en-tête 'authorization' ou 'x-access-token'
    // Pour les requêtes 'Bearer', le format est 'Bearer TOKEN_STRING'
    const token = req.headers['authorization'] || req.headers['x-access-token'];

    // Si aucun token n'est fourni, l'accès est refusé
    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    // Si le token est au format 'Bearer TOKEN_STRING', extraire la chaîne seule
    let actualToken = token;
    if (token.startsWith('Bearer ')) {
        actualToken = token.slice(7, token.length);
    }

    // Vérifier la validité du token JWT
    // process.env.JWT_SECRET doit être défini dans votre fichier .env
    jwt.verify(actualToken, process.env.JWT_SECRET, (err, decoded) => {
        // En cas d'erreur de vérification (token invalide, expiré, etc.)
        if (err) {
            console.error("Erreur lors de la vérification du token JWT :", err.message);
            return res.status(401).json({ message: 'Unauthorized!' });
        }
        // Si le token est valide, attacher l'ID de l'utilisateur (décodé du token) à l'objet requête
        req.userId = decoded.id; // L'ID de l'utilisateur est maintenant disponible via req.userId
        req.userRole = decoded.role; // Si vous stockez le rôle dans le token, récupérez-le ici
        next(); // Passer au prochain middleware ou à la route
    });
};

const isAdmin = (req, res, next) => {
    // Ce middleware suppose que req.userRole a été défini par authMiddleware
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Require Admin Role!' });
    }
    next(); // Passer au prochain middleware ou à la route si l'utilisateur est admin
};

module.exports = {
    authMiddleware, // Exportez le middleware d'authentification principal
    isAdmin         // Exportez le middleware de vérification du rôle admin
};
