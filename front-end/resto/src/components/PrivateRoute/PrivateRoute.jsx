// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Assurez-vous que le chemin est correct

function PrivateRoute({ children }) {
  const { user, loading } = useAuth(); // Récupère l'état de l'utilisateur et le statut de chargement

  // Pendant le chargement initial de l'authentification, on peut afficher un loader
  if (loading) {
    return <div>Chargement de l'authentification...</div>;
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  // Remplacez '/login' par le chemin réel de votre page de connexion si différent
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur est connecté, afficher les composants enfants
  return children;
}

export default PrivateRoute;
