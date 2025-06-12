const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/database'); // <-- MODIFIÉ : Importe directement l'instance sequelize
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS (Autorise toutes les origines)
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
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Database sync error:', err));

// Set up routes
app.use('/api', authRoutes);
app.use('/api/cart', cartRoutes);

// Middleware to handle 404 errors
app.use((req, res, next) => {
  res.status(404).send({ error: 'Resource not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
