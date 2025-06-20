const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const crypto = require('crypto');

class AuthController {
  async register(req, res) {
    try {
      let { email, password_hash, role, nom, prenom, street_number, street_name, postal_code, city } = req.body;

      if (!street_number || !street_name || !postal_code || !city) {
          return res.status(400).json({ message: 'Tous les champs d\'adresse (numéro, rue, code postal, ville) sont obligatoires.' });
      }

      console.log('Données reçues dans la requête POST /register :', req.body);
      console.log(`Tentative d'enregistrement de l'utilisateur avec email: ${email}`);

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        console.warn(`Tentative d'enregistrement avec un email existant: ${email}`);
        return res.status(400).json({ message: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(password_hash, 10);
      console.log(`Mot de passe haché pour l'utilisateur ${email}: ${hashedPassword}`);

      const newUser = await User.create({
        nom: nom,
        prenom: prenom,
        email: email,
        password: hashedPassword,
        role: role,
        street_number: street_number,
        street_name: street_name,
        postal_code: postal_code,
        city: city
      });

      console.log('Nouvel utilisateur enregistré avec succès :', newUser.email);
      res.status(201).json({ 
        message: 'User registered successfully', 
        user: { 
          id: newUser.id, 
          email: newUser.email, 
          nom: newUser.nom, 
          prenom: newUser.prenom, 
          role: newUser.role,
          street_number: newUser.street_number,
          street_name: newUser.street_name,
          postal_code: newUser.postal_code,
          city: newUser.city
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

      // --- DÉBOGAGE : Log des identifiants reçus ---
      console.log(`Tentative de connexion pour l'email: ${email}`);
      console.log(`Mot de passe reçu (en clair): ${password}`); // ATTENTION: NE PAS FAIRE CECI EN PRODUCTION
      // ---------------------------------------------

      const user = await User.findOne({ where: { email } });
      if (!user) {
        console.warn(`Tentative de connexion pour un utilisateur inexistant: ${email}`);
        return res.status(404).json({ message: 'User not found' });
      }

      // --- DÉBOGAGE : Log du hachage de la BDD ---
      console.log(`Mot de passe haché de la BDD pour ${email}: ${user.password}`);
      // -------------------------------------------

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      // --- DÉBOGAGE : Résultat de la comparaison ---
      console.log(`Résultat de la comparaison du mot de passe pour ${email}: ${isPasswordValid}`);
      // ---------------------------------------------

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // --- DÉBOGAGE : Vérification avant la génération du token ---
      console.log(`JWT_SECRET est défini: ${!!process.env.JWT_SECRET}`);
      console.log(`user.id pour JWT: ${user.id}, user.role pour JWT: ${user.role}`);
      // ---------------------------------------------------------

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // --- DÉBOGAGE : Vérification avant d'envoyer la réponse ---
      console.log(`Token JWT généré: ${token ? 'Présent' : 'Absent'}`); // Ne pas log le token en entier en production
      console.log(`Objet utilisateur envoyé dans la réponse:`, { 
          id: user.id, 
          email: user.email, 
          nom: user.nom, 
          prenom: user.prenom, 
          role: user.role,
          street_number: user.street_number, 
          street_name: user.street_name,     
          postal_code: user.postal_code,     
          city: user.city                    
        });
      // ---------------------------------------------------------

      res.status(200).json({
        message: 'Login successful',
        token,
        user: { 
          id: user.id, 
          email: user.email, 
          nom: user.nom, 
          prenom: user.prenom, 
          role: user.role,
          street_number: user.street_number, 
          street_name: user.street_name,     
          postal_code: user.postal_code,     
          city: user.city                    
        } 
      });
    } catch (error) {
      console.error('Erreur DETAILED lors de la connexion de l\'utilisateur (dans le bloc catch) :', error);
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

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(200).json({ message: "Si l'email est enregistré, un lien de réinitialisation a été envoyé." });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 3600000);

      user.reset_password_token = resetToken;
      user.reset_password_expires = resetExpires;
      await user.save();

      console.log(`Jeton de réinitialisation généré pour ${email}: ${resetToken}`);
      res.status(200).json({ message: "Si l'email est enregistré, un lien de réinitialisation a été envoyé." });

    } catch (error) {
      console.error("Erreur détaillée lors de la demande de mot de passe oublié :", error);
      res.status(500).json({ message: "Erreur lors de la demande de mot de passe oublié.", error: error.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      const user = await User.findOne({
        where: {
          reset_password_token: token,
          reset_password_expires: { [User.sequelize.Op.gt]: new Date() }
        }
      });

      if (!user) {
        return res.status(400).json({ message: 'Le jeton de réinitialisation du mot de passe est invalide ou a expiré.' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      user.reset_password_token = null;
      user.reset_password_expires = null;
      await user.save();

      res.status(200).json({ message: 'Votre mot de passe a été réinitialisé avec succès.' });

    } catch (error) {
      console.error("Erreur détaillée lors de la réinitialisation du mot de passe :", error);
      res.status(500).json({ message: "Erreur lors de la réinitialisation du mot de passe.", error: error.message });
    }
  }
}

module.exports = new AuthController();
