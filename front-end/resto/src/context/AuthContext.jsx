// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios'; // <-- Importez l'instance axios configurée

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
          // Utiliser l'instance 'api' (axios) pour vérifier la validité du token
          const response = await api.get('/verify-token', {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          // Récupérer toutes les infos utilisateur, y compris les adresses
          const { id, email, nom, prenom, role, street_number, street_name, postal_code, city } = response.data; // <-- MODIFICATION ICI
          setUser({ id, email, nom, prenom, role, street_number, street_name, postal_code, city, token: storedToken }); // Mettre à jour l'état utilisateur
        }
      } catch (err) {
        console.error("Erreur lors de la vérification du token JWT :", err.response?.data || err.message, err.toJSON ? err.toJSON() : err);
        localStorage.removeItem('accessToken'); // Nettoyer le token invalide
        setUser(null); // S'assurer que l'utilisateur est null en cas d'échec
      } finally {
        setLoading(false); // Fin du chargement, que le token soit valide ou non
      }
    };

    loadUserFromStorage();
  }, []); // Exécuté une seule fois au montage du composant

  const signup = async (nom, prenom, email, password, street_number, street_name, postal_code, city, role = 'user') => { // <-- MODIFICATION DES PARAMÈTRES
    setError(''); // Réinitialise les erreurs précédentes
    try {
      if (!nom || !prenom || !email || !password || !street_number || !street_name || !postal_code || !city) { // <-- Vérification des nouveaux champs
        throw new Error('Tous les champs requis (Nom, Prénom, Email, Mot de passe, Adresse) sont requis.');
      }

      await api.post('/register', {
        nom,
        prenom,
        email,
        password_hash: password,
        role,
        street_number, // <-- NOUVEAU CHAMP
        street_name,   // <-- NOUVEAU CHAMP
        postal_code,   // <-- NOUVEAU CHAMP
        city           // <-- NOUVEAU CHAMP
      });

      return true; // Succès de l'inscription
    } catch (err) {
      console.error("Erreur détaillée lors de l'inscription :", err.response?.data || err.message, err.toJSON ? err.toJSON() : err);
      setError(err.response?.data?.message || err.message || 'Erreur lors de l\'inscription');
      return false;
    }
  };

  const login = async (email, password) => {
    setError(''); // Réinitialise les erreurs précédentes
    try {
      if (!email || !password) {
        throw new Error('Email et mot de passe requis');
      }

      const response = await api.post('/login', {
        email,
        password,
      });

      const { token, user: userData } = response.data; // Le backend renvoie 'token' et un objet 'user'
      localStorage.setItem('accessToken', token);
      setUser({ ...userData, token: token }); // userData contiendra maintenant les infos d'adresse
      
      return true; // Connexion réussie
    } catch (err) {
      console.error("Erreur détaillée lors de la connexion :", err.response?.data || err.message, err.toJSON ? err.toJSON() : err);
      setError(err.response?.data?.message || err.message || 'Email ou mot de passe incorrect');
      return false;
    }
  };

  const forgotPassword = async (email) => {
    setError('');
    try {
      if (!email || email.trim().length === 0) {
        throw new Error('Veuillez entrer votre adresse email.');
      }
      await api.post('/forgot-password', { email });
      return true;
    } catch (err) {
      console.error("Erreur détaillée lors de la demande de mot de passe oublié :", err.response?.data || err.message, err.toJSON ? err.toJSON() : err);
      setError(err.response?.data?.message || 'Erreur lors de la demande de réinitialisation. Veuillez réessayer.');
      return false;
    }
  };

  const logout = async () => {
    setError('');
    try {
      localStorage.removeItem('accessToken');
      setUser(null);
      return true;
    } catch (err) {
      console.error("Erreur détaillée lors de la déconnexion :", err.response?.data || err.message);
      setError(err.response?.data?.message || err.message || 'Erreur lors de la déconnexion');
      return false;
    }
  };

  if (loading) {
    return <div>Chargement de l'authentification...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, error, login, logout, signup, forgotPassword, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export { AuthContext };
