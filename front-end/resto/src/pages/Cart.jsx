// src/pages/Cart.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css'; // Assurez-vous d'avoir ce fichier CSS pour le style

function Cart() {
  const { cartItems, getCartTotal, getCartCount, updateQuantity, removeFromCart, clearCart, cartError } = useCart();
  const navigate = useNavigate();

  // Redirige vers la page d'accueil si le panier est vide après un court délai
  // Désactivé temporairement pour le débogage si vous voulez voir un panier vide
  // useEffect(() => {
  //   if (cartItems.length === 0 && !cartError) {
  //     const timer = setTimeout(() => {
  //       navigate('/');
  //     }, 1000); // Redirige après 1 seconde si le panier est vide
  //     return () => clearTimeout(timer);
  //   }
  // }, [cartItems, cartError, navigate]);


  const handleUpdateQuantity = (dishId, newQuantity) => {
    console.log(`Cart.jsx: Demande de mise à jour de quantité pour plat ${dishId} à ${newQuantity}`);
    updateQuantity(dishId, newQuantity);
  };

  const handleRemoveFromCart = (dishId) => {
    console.log(`Cart.jsx: Demande de suppression pour plat ${dishId}`);
    removeFromCart(dishId);
  };

  const handleClearCart = () => {
    console.log("Cart.jsx: Demande de vidage du panier.");
    clearCart();
  };

  const handleCheckout = () => {
    // Logique pour passer à la page de paiement ou de confirmation
    console.log("Cart.jsx: Procéder au paiement.");
    navigate('/checkout'); // Assurez-vous d'avoir une route /checkout
  };

  return (
    <div className="cart-container">
      <h1>Votre Panier</h1>

      {cartError && <div className="cart-error-message">{cartError}</div>}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Votre panier est vide. <br/> <button onClick={() => navigate('/')} className="back-to-menu-button">Retour au menu</button></p>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={item.dishId} className="cart-item">
                <img src={item.image || `https://placehold.co/100x100?text=${item.name.substring(0,5)}`} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">{item.price.toFixed(2)}€ / unité</p>
                  <p className="cart-item-total">Total: {(item.price * item.quantity).toFixed(2)}€</p>
                </div>
                <div className="cart-item-quantity-controls">
                  <button onClick={() => handleUpdateQuantity(item.dishId, item.quantity - 1)} className="quantity-button">-</button>
                  <span className="item-quantity">{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item.dishId, item.quantity + 1)} className="quantity-button">+</button>
                </div>
                <button onClick={() => handleRemoveFromCart(item.dishId)} className="remove-item-button">X</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Résumé du Panier</h2>
            <p>Nombre d'articles: <strong>{getCartCount()}</strong></p>
            <p>Sous-total: <strong>{getCartTotal().toFixed(2)}€</strong></p>
            {/* Vous pouvez ajouter les frais de livraison ici */}
            <p className="cart-total">Total à payer: <strong>{getCartTotal().toFixed(2)}€</strong></p>
            <button onClick={handleCheckout} className="checkout-button">
              Passer la Commande
            </button>
            <button onClick={handleClearCart} className="clear-cart-button">
              Vider le Panier
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
