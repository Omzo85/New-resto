// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Définissez l'URL de base de votre backend Node.js
// IMPORTANT : Adaptez ce chemin si votre backend n'est pas sur localhost:3001
const API_BASE_URL = 'http://localhost:3001/api'; 

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Gère l'état de chargement initial

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        // Utiliser axios pour vérifier la validité du token auprès du backend
        const response = await axios.get(`${API_BASE_URL}/verify-token`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
        });

        const { id, email } = response.data; // Récupérer les infos utilisateur depuis la réponse
        setUser({ id, email, token: storedToken }); // Mettre à jour l'état utilisateur
      }
      } catch (err) {
      console.error("Erreur lors de la vérification du token JWT :", err);
      localStorage.removeItem('accessToken'); // Nettoyer le token invalide
      } finally {
      setLoading(false); // Fin du chargement, que le token soit valide ou non
      }
    };

    loadUserFromStorage();
  }, []); // Exécuté une seule fois au montage du composant

  const signup = async (email, password) => {
    setError(''); // Réinitialise les erreurs précédentes
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // Récupère la réponse JSON du backend

      if (!response.ok) {
        // Si la réponse n'est pas OK (statut 4xx ou 5xx)
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      // Si l'inscription réussit, on ne connecte pas automatiquement ici.
      // L'utilisateur devra se connecter via la fonction 'login'.
      return true; // Succès de l'inscription
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const login = async (email, password) => {
    setError(''); // Réinitialise les erreurs précédentes
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Email ou mot de passe incorrect');
      }

      // Le backend renvoie un accessToken et un objet user (id, email)
      const { accessToken, user: userData } = data;

      // Stocke le token JWT dans le localStorage du navigateur
      localStorage.setItem('accessToken', accessToken);
      // Met à jour l'état de l'utilisateur avec ses informations et le token
      setUser({ ...userData, token: accessToken }); 
      
      return true; // Connexion réussie
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const logout = async () => {
    setError(''); // Réinitialise les erreurs précédentes
    try {
      // Supprime le token du localStorage pour "déconnecter" le client
      localStorage.removeItem('accessToken');
      setUser(null); // Réinitialise l'état de l'utilisateur

      // Optionnel : Si vous avez une route de déconnexion côté serveur
      // pour invalider le JWT (ex: blacklist de tokens)
      // await fetch(`${API_BASE_URL}/logout`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${user?.token}` // Envoyer le token si nécessaire
      //   }
      // });
      return true; // Déconnexion réussie
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Tant que le chargement initial n'est pas terminé (vérification du token), affiche un loader
  if (loading) {
    return <div>Chargement de l'authentification...</div>; // Ou un composant de spinner
  }

  return (
    <AuthContext.Provider value={{ user, error, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export { AuthContext }; // Export the AuthContext for external usage