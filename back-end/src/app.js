const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
// Importez l'instance sequelize directement
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes'); // <-- Importez les routes du panier

// Assurez-vous que tous vos modèles sont bien importés et définis AVANT sequelize.sync()
// Le simple fait de les 'require' les initialise avec Sequelize
require('./models/userModel');
require('./models/dishModel'); // Assurez-vous que ce fichier existe et est correct
require('./models/cartItemModel'); // Assurez-vous que ce fichier existe et est correct


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to the Express.js Application !!!');
});

// Connect to the database
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

// Sync models with the database
// Cela va créer ou mettre à jour les tables en fonction de vos modèles définis
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Database sync error:', err));

// Set up routes
app.use('/api', authRoutes);
// CORRECTION ICI : Montez les routes du panier sous /api/cart
app.use('/api/cart', cartRoutes); // <-- MODIFICATION ICI

// Middleware to handle 404 errors (pour les routes non trouvées par Express)
app.use((req, res, next) => {
  res.status(404).send({ error: 'Resource not found' });
});

// Middleware de gestion des erreurs génériques (à placer en dernier)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log l'erreur complète pour le débogage
  res.status(500).send('Something broke!');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
