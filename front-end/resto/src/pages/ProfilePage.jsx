// src/pages/ProfilePage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css'; // Créez ce fichier CSS pour le style

function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="profile-loading">Chargement du profil...</div>;
  }

  if (!user) {
    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/login'); // Rediriger vers la page de connexion après déconnexion
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Mon Profil</h1>

      <div className="profile-details">
        <h2>Informations Personnelles</h2>
        <p><strong>Nom :</strong> {user.nom}</p>
        <p><strong>Prénom :</strong> {user.prenom}</p>
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>Rôle :</strong> {user.role}</p>

        <h2>Adresse de Livraison</h2>
        <p><strong>Numéro de voie :</strong> {user.street_number}</p>
        <p><strong>Nom de la voie :</strong> {user.street_name}</p>
        <p><strong>Code Postal :</strong> {user.postal_code}</p>
        <p><strong>Ville :</strong> {user.city}</p>
      </div>

      <div className="profile-orders">
        <h2>Mes Commandes Passées</h2>
        {/* Ici, vous afficherez la liste des commandes passées.
            Cela nécessitera un appel API vers votre backend pour récupérer les commandes de l'utilisateur.
            Pour l'instant, c'est un placeholder.
        */}
        <p>Aucune commande passée pour le moment.</p>
        {/* Exemple si vous aviez une liste de commandes (user.orders par exemple)
        {user.orders && user.orders.length > 0 ? (
          <ul>
            {user.orders.map(order => (
              <li key={order.id}>
                Commande n° {order.id} - Date: {new Date(order.order_date).toLocaleDateString()} - Total: {order.total_amount}€
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune commande passée pour le moment.</p>
        )}
        */}
      </div>

      <button onClick={() => navigate('/edit-profile')} className="profile-button edit-button">
        Modifier le profil
      </button>
      <button onClick={handleLogout} className="profile-button logout-button">
        Déconnexion
      </button>
    </div>
  );
}

export default ProfilePage;
