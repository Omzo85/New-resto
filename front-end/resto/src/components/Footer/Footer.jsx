
//imports
import React from 'react';
import './Footer.css'

//création du composant Footer
function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="address">
          <i className="fas fa-map-marker-alt"></i>
          50 avenue de Paris<br />95290 L'Isle-Adam
        </div>
        <div className="phone">
          <i className="fas fa-phone"></i>
          +33 1 34 00 87 55 32
        </div>
        <div className="social-links">

          <a href="#instagram"><i className="fab fa-instagram"></i> Instagram</a>
          <a href="#tiktok"><i className="fab fa-tiktok"></i> TikTok</a>
        </div>
      </div>
    </footer>
  );
}
//Rajout des liens des réseaux sociaux
export default Footer;