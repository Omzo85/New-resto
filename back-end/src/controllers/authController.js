const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Assurez-vous que le chemin vers userModel est correct

class AuthController {
  async register(req, res) {
    try {
      // Déstructuration pour récupérer tous les champs, y compris les adresses
      let { email, password_hash, role, nom, prenom, street_number, street_name, postal_code, city } = req.body;

      // Vérification des champs obligatoires pour l'adresse
      if (!street_number || !street_name || !postal_code || !city) {
          return res.status(400).json({ message: 'Tous les champs d\'adresse (numéro, rue, code postal, ville) sont obligatoires.' });
      }

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

      // Créer un nouvel utilisateur avec les champs d'adresse
      const newUser = await User.create({
        nom: nom,
        prenom: prenom,
        email: email,
        password: hashedPassword, // 'password' dans le modèle, 'password_hash' dans la DB
        role: role,
        street_number: street_number, // Nouveau champ
        street_name: street_name,     // Nouveau champ
        postal_code: postal_code,     // Nouveau champ
        city: city                    // Nouveau champ
      });

      console.log('Nouvel utilisateur enregistré avec succès :', newUser.email);
      // Renvoyer les informations utilisateur
      res.status(201).json({ 
        message: 'User registered successfully', 
        user: { 
          id: newUser.id, 
          email: newUser.email, 
          nom: newUser.nom, 
          prenom: newUser.prenom, 
          role: newUser.role,
          street_number: newUser.street_number, // Nouveau champ
          street_name: newUser.street_name,     // Nouveau champ
          postal_code: newUser.postal_code,     // Nouveau champ
          city: newUser.city                    // Nouveau champ
        } 
      });

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
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Renvoyez l'objet utilisateur (sans le mot de passe) avec le token et les infos d'adresse
      res.status(200).json({
        message: 'Login successful',
        token,
        user: { 
          id: user.id, 
          email: user.email, 
          nom: user.nom, 
          prenom: user.prenom, 
          role: user.role,
          street_number: user.street_number, // Nouveau champ
          street_name: user.street_name,     // Nouveau champ
          postal_code: user.postal_code,     // Nouveau champ
          city: user.city                    // Nouveau champ
        } 
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
