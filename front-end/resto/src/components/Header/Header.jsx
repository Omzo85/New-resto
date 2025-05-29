import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

function Header() {
  // État pour gérer l'ouverture/fermeture du menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Récupération des fonctions du panier et de l'authentification
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();

  // Fonction pour basculer l'état du menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="Header">
      {/* Barre de navigation principale */}
      <div className="Navbar">
        {/* Bouton du menu hamburger */}
        <button onClick={toggleMenu} className="menu-toggle">
          <i className="fas fa-bars"></i>
        </button>
        
        {/* Logo et nom du restaurant */}
        <Link to="/" className="NomDuRestaurant">
          <i className="fas fa-utensils"></i>
          Chez Khadija
        </Link>
        
        {/* Icônes de droite (profil et panier) */}
        <div className="header-icons">
          {user ? (
            // Affichage pour utilisateur connecté
            <>
              <span className="user-email">{user.email}</span>
              <button onClick={logout} className="logout-button">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </>
          ) : (
            // Lien de connexion pour utilisateur non connecté
            <Link to="/login" className="profile-icon">
              <i className="fas fa-user"></i>
            </Link>
          )}
          {/* Icône du panier avec compteur */}
          <Link to="/cart" className="cart-icon">
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-count">{getCartCount()}</span>
          </Link>
        </div>
      </div>
      
      {/* Menu déroulant */}
      <div className={`dropdown-menu ${isMenuOpen ? 'show' : ''}`}>
        <Link to="/" onClick={toggleMenu}>
          <i className="fas fa-home"></i> Accueil
        </Link>
        {user ? (
          <button onClick={logout} className="dropdown-item">
            <i className="fas fa-sign-out-alt"></i> Déconnexion
          </button>
        ) : (
          <Link to="/login" onClick={toggleMenu}>
            <i className="fas fa-user"></i> Connexion
          </Link>
        )}
        <Link to="/cart" onClick={toggleMenu}>
          <i className="fas fa-shopping-cart"></i> Panier
        </Link>
        <a href="#contact" onClick={toggleMenu}>
          <i className="fas fa-envelope"></i> Contact
        </a>
      </div>
    </header>
  );
}

export default Header;