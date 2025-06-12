import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
// Assurez-vous d'importer le bon fichier CSS
import '../../pages/Navbar.css'; // Importe Navbar.css depuis src/pages

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    // Le conteneur principal de la barre de navigation, utilise la classe 'navbar'
    <header className="navbar">
      {/* Section de début (bouton menu hamburger pour mobile) */}
      <div className="navbar-start">
        <button onClick={toggleMenu} className="menu-toggle">
          <i className="fas fa-bars"></i>
        </button>
      </div>
      
      {/* Logo et nom du restaurant - Placé au centre pour le centrage */}
      <Link to="/" className="navbar-brand">
        <i className="fas fa-utensils"></i>
        Chez Khadija
      </Link>
      
      {/* Icônes de fin (incluant les boutons Profil/Déconnexion pour desktop et Panier) */}
      <div className="navbar-end">
        {user ? (
            // Affichage pour utilisateur connecté
            <>
              {/* L'email de l'utilisateur s'affiche ici sur les grands écrans, et est masqué sur mobile via CSS. */}
              
              {/* Bouton de profil pour DESKTOP */}
              <Link to="/profile" className="navbar-item profile-button desktop-only">
                Mon Profil
              </Link>
              {/* Bouton de déconnexion pour DESKTOP */}
              <button onClick={logout} className="navbar-item logout-button desktop-only">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </>
          ) : (
            // Lien de connexion pour utilisateur non connecté, stylisé en noir
            <Link to="/login" className="navbar-item">
              Connexion / Inscription
            </Link>
          )}
          {/* Icône du panier avec compteur, stylisée en noir */}
          <Link to="/cart" className="navbar-item cart-icon">
            <i className="fas fa-shopping-cart"></i>
            {/* Le compteur du panier, stylisé en noir, affiché seulement si > 0 */}{getCartCount() > 0 && (
            <span className="cart-count">{getCartCount()}</span>
            )}
          </Link>
        </div>
        
        {/* Menu déroulant pour mobile (utilisant les classes de Navbar.css) */}
        <div className={`dropdown-menu ${isMenuOpen ? 'show' : ''}`}>
          {/* Éléments du menu déroulant, stylisés en noir */}
          <Link to="/" onClick={toggleMenu} className="dropdown-item">
            <i className="fas fa-home"></i> Accueil
          </Link>
          {user ? (
            <>
              {/* Bouton de profil pour MOBILE (dans le menu déroulant) */}
              <Link to="/profile" onClick={toggleMenu} className="dropdown-item">
                <i className="fas fa-user"></i> Mon Profil
              </Link>
              {/* Bouton de déconnexion pour MOBILE (dans le menu déroulant) */}
              <button onClick={() => { logout(); toggleMenu(); }} className="dropdown-item">
                <i className="fas fa-sign-out-alt"></i> Déconnexion
              </button>
            </>
          ) : (
            <Link to="/login" onClick={toggleMenu} className="dropdown-item">
              <i className="fas fa-user"></i> Connexion
            </Link>
          )}
          <Link to="/cart" onClick={toggleMenu} className="dropdown-item">
            <i className="fas fa-shopping-cart"></i> Panier
          </Link>
          <a href="#contact" onClick={toggleMenu} className="dropdown-item">
            <i className="fas fa-envelope"></i> Contact
          </a>
        </div>
    </header>
  );
}

export default Header;
