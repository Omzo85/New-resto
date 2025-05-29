import React from 'react';
import "./NotFound.css";

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="container">
        <h1>404</h1>
        <p>Oups ! La page que vous recherchez n'existe pas.</p>
        <div className="animation">
          <span>4</span>
          <span>0</span>
          <span>4</span>
        </div>
        <p>Retournez vers la <a href="/">page d'accueil</a> ou essayez une autre destination.</p>
      </div>
    </div>
  );
}

export default NotFound;