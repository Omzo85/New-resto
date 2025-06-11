// src/api/axios.js

import axios from 'axios';

// Définissez l'URL de base de l'API.
// Pour les projets Vite, les variables d'environnement sont accessibles via import.meta.env
// et doivent être préfixées par VITE_ dans le fichier .env ou dans docker-compose.yml.
// Nous ajoutons '/api' car toutes les routes de votre backend sont préfixées par '/api'.
const API_BASE_URL = import.meta.env.VITE_API_URL ? 
                     `${import.meta.env.VITE_API_URL}/api` : // Utilise VITE_API_URL et ajoute /api
                     'http://localhost:5000/api';           // Fallback pour le développement local pur

// Crée une instance Axios avec la configuration de base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requêtes pour ajouter le token JWT aux requêtes authentifiées
// Cet intercepteur s'exécute avant que chaque requête ne soit envoyée.
api.interceptors.request.use(
  config => {
    // Récupère le token JWT du localStorage
    const token = localStorage.getItem('accessToken'); 
    
    // Si un token existe, l'ajoute à l'en-tête Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Retourne la configuration modifiée de la requête
  }, 
  error => {
    // Gère les erreurs lors de l'envoi de la requête
    return Promise.reject(error);
  }
);

// Exporte l'instance Axios configurée pour être utilisée dans d'autres parties de l'application
export default api;
