const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Assurez-vous que le chemin vers userModel est correct

class AuthController {
  async register(req, res) {
    try {
      // Déstructuration sans 'username', car il est supprimé
      let { email, password_hash, role, nom, prenom } = req.body;

      console.log('Données reçues dans la requête POST /register :', req.body);
      console.log(`Tentative d'enregistrement de l'utilisateur avec email: ${email}`);

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        console.warn(`Tentative d'enregistrement avec un email existant: ${email}`);
        return res.status(400).json({ message: 'Email already in use' });
      }

      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(password_hash, 10);
      console.log(`Mot de passe haché pour l'utilisateur ${email}: ${hashedPassword}`);

      // Créer un nouvel utilisateur sans 'username'
      const newUser = await User.create({
        nom: nom,
        prenom: prenom,
        email: email,
        password: hashedPassword, // 'password' dans le modèle, 'password_hash' dans la DB
        role: role,
      });

      console.log('Nouvel utilisateur enregistré avec succès :', newUser.email);
      // Renvoyer les informations utilisateur (sans username)
      res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, email: newUser.email, nom: newUser.nom, prenom: newUser.prenom, role: newUser.role } });

    } catch (error) {
      console.error('Erreur DETAILED lors de l\'enregistrement de l\'utilisateur :', error);
      res.status(500).json({
        message: 'Error registering user',
        error: error.message || error.toString(),
        fullError: error.stack
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Vérifier si l'utilisateur existe
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Générer un token JWT
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Inclure le rôle dans le token si nécessaire

      // Renvoyez l'objet utilisateur (sans le mot de passe et sans username) avec le token
      res.status(200).json({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom, role: user.role } // Mettre à jour ici aussi
      });
    } catch (error) {
      console.error('Erreur DETAILED lors de la connexion de l\'utilisateur :', error);
      res.status(500).json({
        message: 'Error logging in',
        error: error.message || error.toString(),
        fullError: error.stack
      });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      console.log(`Demande de mot de passe oublié pour l'email : ${email}`);
      res.status(200).json({ message: "Si l'email est enregistré, un lien de réinitialisation a été envoyé." });
    } catch (error) {
      console.error("Erreur lors de la demande de mot de passe oublié :", error);
      res.status(500).json({ message: "Erreur lors de la demande de mot de passe oublié.", error: error.message });
    }
  }
}

module.exports = new AuthController();
