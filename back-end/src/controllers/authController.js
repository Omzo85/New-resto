const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

class AuthController {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer un nouvel utilisateur
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error });
    }
  }
}

module.exports = new AuthController();