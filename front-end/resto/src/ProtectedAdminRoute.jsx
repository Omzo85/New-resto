// src/ProtectedAdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Assurez-vous que le chemin est correct

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Afficher un message de chargement tant que l'état d'authentification est en cours de vérification
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Vérification de l'accès administrateur...</div>;
  }

  // Si l'utilisateur n'est pas connecté OU que son rôle n'est pas 'admin', rediriger
  // vers la page de connexion administrateur.
  // 'replace' empêche de revenir à cette page avec le bouton retour du navigateur.
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  // Si l'utilisateur est un admin et connecté, rendre le composant enfant (AdminDashboard)
  return children;
};

export default ProtectedAdminRoute;
