// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Assurez-vous que le chemin est correct
import api from '../api/axios'; // <-- Importez l'instance axios configurée

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth(); // Récupère l'utilisateur et l'état de chargement de l'authentification
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true); // Pour le chargement du panier depuis le backend
  const [cartError, setCartError] = useState(''); // Pour gérer les erreurs spécifiques au panier

  // --- Effet pour charger le panier depuis le backend (si l'utilisateur est connecté) ---
  useEffect(() => {
    const fetchCart = async () => {
      setLoadingCart(true);
      setCartError(''); // Réinitialise les erreurs précédentes
      try {
        if (!user || !user.token) {
          // Si pas d'utilisateur ou pas de token, on ne peut pas charger le panier du backend
          setCartItems([]);
          setLoadingCart(false);
          return;
        }

        // Utilisation de l'instance 'api' (axios) pour les requêtes panier
        // L'URL de base est déjà gérée par 'api' (ex: http://backend:5000/api)
        const response = await api.get(`/cart/${user.id}`); // Supposons une route GET /api/cart/:userId

        setCartItems(response.data); // Le backend doit renvoyer un tableau d'articles
      } catch (error) {
        console.error("Erreur lors du chargement du panier :", error.response?.data || error.message);
        setCartError(error.response?.data?.message || "Échec du chargement du panier.");
        setCartItems([]); // Assurez-vous que le panier est vide en cas d'erreur de chargement
      } finally {
        setLoadingCart(false);
      }
    };

    // Déclenche le chargement du panier uniquement si l'authentification est terminée et l'utilisateur est défini
    if (!authLoading && user) {
      fetchCart();
    } else if (!authLoading && !user) {
      // Si l'authentification est terminée et qu'il n'y a pas d'utilisateur, vider le panier local
      setCartItems([]);
      setLoadingCart(false);
    }
  }, [user, authLoading]); // Déclencheur: utilisateur ou état de chargement de l'auth


  // Fonction utilitaire pour envoyer des requêtes au backend via Axios
  // Cette fonction est maintenant privée au CartContext car addToCart etc. l'utilisent
  const sendCartUpdate = async (method, endpoint, body = null) => {
    setCartError(''); // Réinitialise l'erreur avant la requête
    if (!user || !user.token) {
      console.warn("Utilisateur non authentifié. Impossible de synchroniser le panier avec le backend.");
      setCartError("Vous devez être connecté pour modifier le panier.");
      return null;
    }

    try {
      let response;
      const url = `/cart${endpoint}`; // URL relative, api gère l'URL de base

      if (method === 'POST') {
        response = await api.post(url, body);
      } else if (method === 'PUT') {
        response = await api.put(url, body);
      } else if (method === 'DELETE') {
        // Axios DELETE avec body peut nécessiter une configuration spéciale ou passer le body via 'data'
        // Pour les DELETE, le body est souvent passé dans l'URL ou omis
        response = await api.delete(url, { data: body }); // Utilise 'data' pour passer le body en DELETE
      } else {
        throw new Error('Méthode HTTP non supportée');
      }

      return response.data; // Retourne les données de la réponse Axios
    } catch (error) {
      console.error("Erreur de synchronisation du panier avec le backend :", error.response?.data || error.message);
      setCartError(error.response?.data?.message || "Échec de la mise à jour du panier.");
      return null;
    }
  };


  const addToCart = async (dish) => {
    // Optimistic update
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.dishId === dish.id); // Utilisez dishId si c'est ce que le backend stocke
      if (existingItem) {
        return prevItems.map(item =>
          item.dishId === dish.id // <-- Correction ici pour la clé de comparaison
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Ajouter les propriétés nécessaires si le backend attend un format spécifique
      return [...prevItems, { dishId: dish.id, name: dish.name, price: dish.price, image: dish.image, quantity: 1 }];
    });

    // Send update to backend
    const result = await sendCartUpdate('POST', '/add', { dishId: dish.id, quantity: 1 });
    if (result) {
      // Si l'opération backend est réussie, rafraîchir le panier pour s'assurer de la cohérence
      await fetchCart(); // Re-fetch le panier complet du backend
    } else {
      // Si l'opération backend échoue, revenir à l'état précédent (défaire l'optimistic update)
      // Ceci est une implémentation simpliste, une approche plus robuste est préférable en production
      setCartItems(prevItems => prevItems.filter(item => item.dishId !== dish.id || item.quantity > 1 ? item.quantity - 1 : 0));
      // Ou re-fetch le panier pour récupérer l'état réel du backend
      // await fetchCart();
    }
  };


  const removeFromCart = async (dishId) => {
    // Optimistic update
    setCartItems(prevItems => prevItems.filter(item => item.dishId !== dishId)); // Utilisez dishId

    // Send update to backend
    const result = await sendCartUpdate('DELETE', `/remove/${dishId}`); // Endpoint avec ID dans l'URL
    if (!result) {
      // Gérer l'échec du backend si nécessaire (ex: re-fetch le panier ou annuler l'update optimiste)
      await fetchCart(); // Re-fetch pour récupérer l'état réel si l'opération backend échoue
    }
  };

  const updateQuantity = async (dishId, newQuantity) => {
    if (newQuantity <= 0) { // Utilisation de <= 0 pour gérer les cas où la quantité serait négative
      removeFromCart(dishId);
      return;
    }

    // Optimistic update
    setCartItems(prevItems => {
      return prevItems.map(item =>
        item.dishId === dishId // Utilisez dishId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });

    // Send update to backend
    const result = await sendCartUpdate('PUT', `/update`, { dishId, quantity: newQuantity });
    if (!result) {
      await fetchCart(); // Re-fetch en cas d'échec
    }
  };

  const clearCart = async () => {
    // Optimistic update
    setCartItems([]);

    // Send update to backend
    const result = await sendCartUpdate('DELETE', '/clear'); // Endpoint sans ID
    if (!result) {
      await fetchCart(); // Re-fetch en cas d'échec
    }
  };


  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Si le panier est en cours de chargement initial, on peut afficher un loader
  // Note: authLoading doit être géré par AuthContext, ici on s'assure que tout est prêt
  if (loadingCart || authLoading) {
    return <div>Chargement du panier...</div>; // Ou un composant de spinner
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      getCartCount,
      clearCart,
      cartError // Expose l'erreur du panier
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
