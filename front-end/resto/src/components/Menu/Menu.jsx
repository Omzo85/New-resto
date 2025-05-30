import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { dishes } from '../../data/Dishes.jsx';
import './Menu.css';

function Menu() {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (dish, event) => {
    event.preventDefault();
    if (!user) {
      alert('Veuillez vous connecter pour ajouter des articles au panier');
      return;
    }
    addToCart(dish);
    alert('Article ajouté au panier !');
  };

  const entrees = dishes.filter(dish => dish.category === 'entrees');
  const plats = dishes.filter(dish => dish.category === 'plats');
  const desserts = dishes.filter(dish => dish.category === 'desserts');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.Plat').forEach(plat => {
      observer.observe(plat);
    });

    return () => observer.disconnect();
  }, []);

  const renderDishSection = (title, items) => (
    <>
      <div className="Menu">
        <h2>{title}</h2>
      </div>
      <div className="ListeDesPlats">
        {items.map((item) => (
          <Link to={`/dish/${item.id}`} key={item.id} className="Plat">
            <div className="Description">
              <div className="plat-nom">{item.name}</div>
              <div className="plat-description">{item.description}</div>
              <div className="plat-price">{item.price.toFixed(2)}€</div>
            </div>
            <div className="image-container">
              <img src={item.image} alt={item.name} />
              <button 
                className="add-to-cart-button"
                onClick={(e) => handleAddToCart(item, e)}
              >
                <i className="fas fa-cart-plus"></i> Ajouter au panier
              </button>
            </div>
          </Link>
        ))}
      </div>
    </>
  );

  return (
    <div className="menu-container">
      <div className="Menu">
        <h1><i className="fas fa-book-open"></i> Notre Menu</h1>
      </div>
      {renderDishSection('Nos Entrées', entrees)}
      {renderDishSection('Nos Plats', plats)}
      {renderDishSection('Nos Desserts', desserts)}
    </div>
  );
}

export default Menu;