const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/database'); // Importe directement l'instance sequelize

// Importez toutes les routes nécessaires
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const dishRoutes = require('./routes/dishRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Importez TOUS les modèles pour qu'ils soient synchronisés par Sequelize
// C'est essentiel pour que Sequelize reconnaisse et crée/mettte à jour les tables
const User = require('./models/userModel');
const Dish = require('./models/dishModel');
const CartItem = require('./models/cartItemModel'); // <-- CORRECTION ICI : Était './use/cartItemModel'
const Order = require('./models/orderModel');
const OrderItem = require('./models/orderItemModel');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS (Autorise toutes les origines)
app.use(cors());

// Middleware pour parser les corps de requêtes JSON et URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de base pour vérifier si le serveur est en ligne
app.get('/', (req, res) => {
  res.send('Welcome to the Express.js Application !!!');
});

// Connexion à la base de données
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

// Synchronisation des modèles avec la base de données
// ATTENTION: `alter: true` est très utile en développement pour mettre à jour la BDD
// automatiquement quand vos modèles changent. Cependant, il doit être utilisé avec
// une extrême PRUDENCE en production car cela peut entraîner des pertes de données.
// Pour la production, préférez les migrations de base de données.
sequelize.sync({ alter: true })
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Database sync error:', err));

// Configuration des routes API
// Toutes vos routes seront accessibles via le préfixe /api
app.use('/api', authRoutes);     // Routes pour l'authentification (register, login, verify-token)
app.use('/api/cart', cartRoutes);  // Routes pour la gestion du panier
app.use('/api/dishes', dishRoutes);  // Routes pour la gestion des plats
app.use('/api/users', userRoutes);   // Routes pour la gestion des utilisateurs (par l'admin)
app.use('/api/orders', orderRoutes); // Routes pour la gestion des commandes (par l'admin)

// Middleware pour gérer les erreurs 404 (ressource non trouvée)
app.use((req, res, next) => {
  res.status(404).send({ error: 'Resource not found' });
});

// Lance le serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
