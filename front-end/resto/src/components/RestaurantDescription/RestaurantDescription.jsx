import React from 'react';
import './RestaurantDescription.css';


function RestaurantDescription() {
  return (
    <div className="restaurant-description">
      <img className="accueil" src='/thiepp.jpeg' alt="Restaurant" />
      <h2>Bienvenue Chez Khadija</h2>
      <p>Découvrez les saveurs authentiques de la cuisine sénégalaise traditionnelle. Notre cheffe Khadija vous propose une expérience culinaire unique, mêlant épices parfumées et techniques ancestrales pour vous offrir le meilleur de l'Afrique de l'Ouest.</p>
    </div>
  );
}

export default RestaurantDescription