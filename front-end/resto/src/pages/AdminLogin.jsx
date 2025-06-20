// src/pages/AdminLogin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importe votre AuthContext
import './AdminLogin.css'; // Assurez-vous d'avoir ce fichier CSS pour le style

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { user, loading, login, error, setError } = useAuth(); // Récupère l'utilisateur, l'état de chargement, la fonction de login et les erreurs du contexte
  const navigate = useNavigate();

  // Effet pour gérer la redirection si l'utilisateur est déjà connecté et est admin
  useEffect(() => {
    // Si l'authentification n'est plus en cours de chargement
    if (!loading) {
      // Si un utilisateur est connecté ET a le rôle 'admin', redirige vers le dashboard
      if (user && user.role === 'admin') {
        console.log("AdminLogin: Admin déjà connecté, redirection vers le dashboard.");
        navigate('/admin/dashboard', { replace: true }); // 'replace: true' empêche de revenir à la page de login avec le bouton retour du navigateur
      } else if (user && user.role !== 'admin') {
        // Si un utilisateur est connecté mais n'est PAS admin, redirige vers la page d'accueil ou de connexion utilisateur normale
        console.warn("AdminLogin: Utilisateur connecté mais non-admin, redirection vers la page d'accueil.");
        navigate('/', { replace: true }); // Ou une autre page appropriée
      }
      // Si !user (pas connecté), on ne fait rien, on laisse la page de login s'afficher
    }
  }, [user, loading, navigate]); // Déclencheur: changements dans l'utilisateur ou l'état de chargement

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Réinitialise les messages locaux
    setError('');   // Réinitialise les erreurs du contexte

    if (!email || !password) {
      setMessage("Veuillez entrer l'email et le mot de passe.");
      return;
    }

    // Tente de se connecter via la fonction 'login' de AuthContext
    const loginSuccess = await login(email, password);

    if (loginSuccess) {
      // Si la connexion réussit, le useEffect ci-dessus prendra le relais pour la redirection
      // en fonction du rôle de l'utilisateur qui vient d'être mis à jour dans AuthContext.
      // Un message peut être affiché si l'on veut un feedback immédiat
      console.log("AdminLogin: Connexion réussie, le AuthContext va gérer la redirection.");
    } else {
      // Si la connexion échoue, l'erreur est déjà définie dans le contexte AuthContext.error
      console.error("AdminLogin: Échec de la connexion. L'erreur est affichée par AuthContext.");
      // setMessage(error); // Si vous voulez copier l'erreur du contexte vers un message local
    }
  };

  // Affiche un message de chargement tant que l'authentification n'est pas prête
  if (loading) {
    return (
      <div className="admin-login-container">
        <div className="loading-message">Vérification de l'état d'authentification...</div>
      </div>
    );
  }

  // Si l'utilisateur est déjà un admin (logique gérée par useEffect), ce composant ne sera pas rendu
  // car il aura déjà été redirigé. Ce rendu est pour les cas où l'utilisateur n'est pas connecté ou n'est pas admin.
  return (
    <div className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h2>Connexion Administrateur</h2>
        
        {/* Affichage des erreurs du contexte et des messages locaux */}
        {error && <div className="error-message">{error}</div>}
        {message && <div className="info-message">{message}</div>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="6"
            required
          />
        </div>
        <button type="submit" className="login-button">
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
