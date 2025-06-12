// src/components/Navbar.jsx (Suggestion)
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Pour le nombre d'articles dans le panier
import './Navbar.css'; // Créez ce fichier CSS pour le style de la barre de navigation

function Navbar() {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart(); // Récupère le nombre d'articles dans le panier

  const cartItemCount = getCartCount();

  const handleLogout = async () => {
    // La déconnexion est gérée par le AuthContext
    await logout();
    // La redirection après déconnexion est gérée par le AuthContext ou par le composant Login/App
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">Chez Khadija</Link>
      </div>
      <div className="navbar-right">
        <Link to="/menu" className="navbar-item">Menu</Link>
        <Link to="/cart" className="navbar-item cart-icon">
          Panier ({cartItemCount})
        </Link>
        {user ? (
          <>
            <Link to="/profile" className="navbar-item profile-button">
              Mon Profil {/* Ou une icône d'utilisateur */}
            </Link>
            {/* Optionnel: un bouton de déconnexion ici ou dans la page de profil */}
            {/* <button onClick={handleLogout} className="navbar-item logout-button">Déconnexion</button> */}
          </>
        ) : (
          <Link to="/login" className="navbar-item">Connexion / Inscription</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
