import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // Assurez-vous d'avoir ce fichier CSS pour le style

function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',       // Champ pour l'inscription
    prenom: '',    // Champ pour l'inscription
    // username: '',  // CHAMPS SUPPRIMÉ
    email: '',     // Utilisé pour la connexion et l'inscription
    password: '',
    confirmPassword: '', // Utilisé seulement pour l'inscription
    street_number: '', // <-- NOUVEAU CHAMP
    street_name: '',   // <-- NOUVEAU CHAMP
    postal_code: '',   // <-- NOUVEAU CHAMP
    city: '',          // <-- NOUVEAU CHAMP
  });
  const [message, setMessage] = useState('');
  const { login, signup, error, user, forgotPassword } = useAuth(); // Assurez-vous d'importer forgotPassword
  const navigate = useNavigate();
  const location = useLocation();

  // Redirection si l'utilisateur est déjà connecté
  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Réinitialiser les messages locaux avant une nouvelle tentative

    if (isLoginMode) {
      const success = await login(formData.email, formData.password);
      if (success) {
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      }
    } else if (isForgotPasswordMode) {
      if (formData.email.trim().length === 0) {
        setMessage("Veuillez entrer votre adresse email.");
        return;
      }
      const success = await forgotPassword(formData.email);
      
      if (success) {
        setMessage("Si l'adresse email est associée à un compte, un lien de réinitialisation a été envoyé.");
        setIsForgotPasswordMode(false);
        setIsLoginMode(true);
        setFormData({ // Réinitialise le formulaire
          nom: '', prenom: '', email: '', password: '', confirmPassword: '',
          street_number: '', street_name: '', postal_code: '', city: '',
        });
      } else {
        // L'erreur sera affichée par le `error` du contexte
      }
    }
     else { // Mode INSCRIPTION
      if (formData.password !== formData.confirmPassword) {
        setMessage("Les mots de passe ne correspondent pas");
        return;
      }

      if (!formData.nom.trim() || !formData.prenom.trim() || !formData.email.trim() || !formData.password.trim() ||
          !formData.street_number.trim() || !formData.street_name.trim() || !formData.postal_code.trim() || !formData.city.trim()) {
        setMessage("Tous les champs sont obligatoires.");
        return;
      }

      const success = await signup(
        formData.nom.trim(),
        formData.prenom.trim(),
        formData.email,
        formData.password,
        formData.street_number.trim(), // <-- NOUVEAU CHAMP
        formData.street_name.trim(),   // <-- NOUVEAU CHAMP
        formData.postal_code.trim(),   // <-- NOUVEAU CHAMP
        formData.city.trim(),          // <-- NOUVEAU CHAMP
        'user'
      );

      if (success) {
        setMessage("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
        setIsLoginMode(true);
        setFormData({ // Réinitialise le formulaire
          nom: '', prenom: '', email: '', password: '', confirmPassword: '',
          street_number: '', street_name: '', postal_code: '', city: '',
        });
      } else {
        // L'erreur sera affichée par le `error` du contexte
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>
          {isLoginMode ? 'Connexion' : isForgotPasswordMode ? 'Mot de passe oublié ?' : 'Inscription'}
        </h2>
        {/* Affichage des erreurs du contexte et des messages locaux */}
        {error && <div className="error-message">{error}</div>}
        {message && <div className="info-message">{message}</div>}

        {isLoginMode && !isForgotPasswordMode && ( // Mode Connexion
          <>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength="6"
                required
              />
            </div>
          </>
        )}

        {!isLoginMode && !isForgotPasswordMode && ( // Mode Inscription
          <>
            <div className="form-group">
              <label htmlFor="nom">Nom</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Votre nom"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="prenom">Prénom</label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                placeholder="Votre prénom"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength="6"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* NOUVEAUX CHAMPS D'ADRESSE */}
            <div className="form-group">
              <label htmlFor="street_number">Numéro de voie</label>
              <input
                type="text"
                id="street_number"
                name="street_number"
                value={formData.street_number}
                onChange={handleChange}
                placeholder="Ex: 123"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="street_name">Nom de la voie</label>
              <input
                type="text"
                id="street_name"
                name="street_name"
                value={formData.street_name}
                onChange={handleChange}
                placeholder="Ex: Rue de la Paix"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="postal_code">Code Postal</label>
              <input
                type="text"
                id="postal_code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                placeholder="Ex: 75001"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="city">Ville</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ex: Paris"
                required
              />
            </div>
          </>
        )}

        {isForgotPasswordMode && ( // Mode Mot de passe oublié
          <>
            <p>Veuillez entrer l'adresse email associée à votre compte. Un lien de réinitialisation vous sera envoyé.</p>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
              />
            </div>
          </>
        )}

        {(!isForgotPasswordMode || (isForgotPasswordMode && formData.email.trim().length > 0)) && (
          <button type="submit" className="login-button">
            {isLoginMode ? 'Se connecter' : isForgotPasswordMode ? 'Envoyer le lien' : 'S\'inscrire'}
          </button>
        )}


        {!isForgotPasswordMode && (
          <button
            type="button"
            className="switch-mode-button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setFormData({ // Réinitialise le formulaire
                nom: '', prenom: '', email: '', password: '', confirmPassword: '',
                street_number: '', street_name: '', postal_code: '', city: '',
              });
              setMessage('');
            }}
          >
            {isLoginMode ? 'Créer un compte' : 'Déjà inscrit ? Se connecter'}
          </button>
        )}

        {isLoginMode && (
          <button
            type="button"
            className="forgot-password-link"
            onClick={() => {
              setIsForgotPasswordMode(true);
              setIsLoginMode(false);
              setFormData({ nom: '', prenom: '', email: '', password: '', confirmPassword: '', street_number: '', street_name: '', postal_code: '', city: '' });
              setMessage('');
            }}
          >
            Mot de passe oublié ?
          </button>
        )}

        {isForgotPasswordMode && (
          <button
            type="button"
            className="switch-mode-button"
            onClick={() => {
              setIsForgotPasswordMode(false);
              setIsLoginMode(true);
              setFormData({ nom: '', prenom: '', email: '', password: '', confirmPassword: '', street_number: '', street_name: '', postal_code: '', city: '' });
              setMessage('');
            }}
          >
            Retour à la connexion
          </button>
        )}
      </form>
    </div>
  );
}

export default Login;
