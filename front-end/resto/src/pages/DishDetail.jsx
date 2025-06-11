import React, { useState } from 'react'; // Importez useState pour le message
import { useParams } from 'react-router-dom';
import { dishes } from '../data/dishes'; // Assurez-vous que le chemin vers vos données de plats est correct
import { useCart } from '../context/CartContext';
import './DishDetail.css';

function DishDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [message, setMessage] = useState(''); // État pour le message d'ajout au panier
  const dish = dishes.find(d => d.id === id);

  if (!dish) {
    return <div className="dish-not-found">Plat non trouvé</div>;
  }

  const handleAddToCart = async () => { // Rendre la fonction async
    setMessage(''); // Réinitialise le message
    try {
      await addToCart(dish); // Attendre la fin de l'opération
      setMessage('Article ajouté au panier !'); // Message de succès
    } catch (error) {
      setMessage('Erreur lors de l\'ajout au panier.'); // Message d'erreur
      console.error("Failed to add to cart:", error);
    }
  };

  return (
    <div className="dish-detail">
      {message && <div className="cart-message">{message}</div>} {/* Affichage du message */}
      <div className="dish-image-container">
        <img src={dish.image} alt={dish.name} className="dish-image" />
      </div>
      <div className="dish-info">
        <h1>{dish.name}</h1>
        <p className="dish-description">{dish.longDescription}</p>
        <div className="dish-details">
          <p className="dish-ingredients"><strong>Ingrédients:</strong> {dish.ingredients}</p>
          <p className="dish-price"><strong>Prix:</strong> {dish.price.toFixed(2)}€</p>
        </div>
        <button
          className="add-to-cart"
          onClick={handleAddToCart}
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}

export default DishDetail;
