import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { user } = useAuth();

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <i className="fas fa-shopping-cart fa-3x"></i>
        <h2>Votre panier est vide</h2>
        <p>Découvrez nos délicieux plats et ajoutez-les à votre panier</p>
        <Link to="/" className="continue-shopping">
          Voir le menu
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Votre Panier</h1>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p className="cart-item-description">{item.description}</p>
              <p className="cart-item-price">{item.price.toFixed(2)}€</p>
            </div>
            <div className="cart-item-actions">
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <button 
                className="remove-item"
                onClick={() => removeFromCart(item.id)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-total">
          <span>Total</span>
          <span>{getCartTotal().toFixed(2)}€</span>
        </div>
        {user ? (
          <button className="checkout-button">
            Procéder au paiement
          </button>
        ) : (
          <Link to="/login" className="checkout-button" style={{ textAlign: 'center', textDecoration: 'none' }}>
            Se connecter pour payer
          </Link>
        )}
        <Link to="/" className="continue-shopping">
          Continuer les achats
        </Link>
      </div>
    </div>
  );
}

export default Cart;