import React from 'react';
import { useParams } from 'react-router-dom';
import { dishes } from '../data/dishes';
import { useCart } from '../context/CartContext';
import './DishDetail.css';

function DishDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const dish = dishes.find(d => d.id === id);

  if (!dish) {
    return <div className="dish-not-found">Plat non trouvé</div>;
  }

  const handleAddToCart = () => {
    addToCart(dish);
    alert('Article ajouté au panier !');
  };

  return (
    <div className="dish-detail">
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