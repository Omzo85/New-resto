import React, { createContext, useContext, useState, useEffect } from 'react';
// Importez useAuth pour accéder à l'état de l'utilisateur et au token
import { useAuth } from './AuthContext'; // Assurez-vous que le chemin est correct

// URL de base de votre backend Node.js
// Assurez-vous que cette URL est correcte (ex: 'http://localhost:3001/api')
const API_BASE_URL = 'http://localhost:3001/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth(); // Récupère l'utilisateur et l'état de chargement de l'authentification
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true); // Pour le chargement du panier depuis le backend

  // --- Effet pour charger le panier depuis le backend (si l'utilisateur est connecté) ---
  useEffect(() => {
    // Ne charge le panier que si l'authentification est terminée et que l'utilisateur est connecté
    if (!authLoading && user) {
      const fetchCart = async () => {
        setLoadingCart(true);
        try {
          const response = await fetch(`${API_BASE_URL}/cart/${user.id}`, { // Supposons une route /api/cart/:userId
            headers: {
              'Authorization': `Bearer ${user.token}`, // Envoyer le token JWT
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch cart');
          }
          const data = await response.json();
          setCartItems(data); // Le backend doit renvoyer un tableau d'articles
        } catch (error) {
          console.error("Erreur lors du chargement du panier :", error);
          // Optionnel: Gérer l'erreur (ex: afficher un message à l'utilisateur)
          setCartItems([]); // Assurez-vous que le panier est vide en cas d'erreur de chargement
        } finally {
          setLoadingCart(false);
        }
      };
      fetchCart();
    } else if (!authLoading && !user) {
      // Si l'utilisateur n'est pas connecté, le panier est vide (ou géré via localStorage si vous voulez)
      // Pour cet exemple, on vide le panier si non connecté (peut être adapté)
      setCartItems([]);
      setLoadingCart(false);
    }
  }, [user, authLoading]); // Déclencheur: utilisateur ou état de chargement de l'auth

  // --- Fonctions d'interaction avec le backend ---

  // Fonction utilitaire pour envoyer des requêtes au backend
  const sendCartUpdate = async (method, endpoint, body = null) => {
    if (!user || !user.token) {
      console.warn("Utilisateur non authentifié. Impossible de synchroniser le panier avec le backend.");
      // Gérer le cas où l'utilisateur n'est pas connecté (ex: rediriger vers la page de login)
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cart${endpoint}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`, // Envoyer le token JWT
        },
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API request failed: ${response.status}`);
      }
      return await response.json(); // Retourne les données (ex: le panier mis à jour du backend)
    } catch (error) {
      console.error("Erreur de synchronisation du panier avec le backend :", error);
      // Gérer l'erreur (ex: afficher un message, revertir l'action côté client)
      return null;
    }
  };


  const addToCart = async (dish) => {
    // Mise à jour optimiste côté client (optionnel mais améliore l'UX)
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === dish.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...dish, quantity: 1 }];
    });

    // Envoi de la modification au backend
    await sendCartUpdate('POST', '/add', { dishId: dish.id, quantity: 1 });
    // Une fois la réponse du backend reçue, on re-fetch le panier complet
    const fetchCart = async () => {
      setLoadingCart(true);
      try {
        const response = await fetch(`${API_BASE_URL}/cart/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error("Erreur lors du chargement du panier :", error);
        setCartItems([]);
      } finally {
        setLoadingCart(false);
      }
    };
    fetchCart(); // Appeler fetchCart pour rafraîchir l'état
  };

  const removeFromCart = async (dishId) => {
    // Mise à jour optimiste
    setCartItems(prevItems => prevItems.filter(item => item.id !== dishId));

    // Envoi de la modification au backend
    await sendCartUpdate('DELETE', `/remove/${dishId}`);
  };

  const updateQuantity = async (dishId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(dishId); // Appelera la fonction de suppression qui sync backend
      return;
    }

    // Mise à jour optimiste
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === dishId
          ? { ...item, quantity: newQuantity }
          : item
      );
      return updatedItems.filter(item => item.quantity > 0); // Supprime les articles avec une quantité <= 0
    });

    // Envoi de la modification au backend
    await sendCartUpdate('PUT', `/update`, { dishId, quantity: newQuantity });
  };

  const clearCart = async () => {
    // Mise à jour optimiste
    setCartItems([]);

    // Envoi de la modification au backend
    await sendCartUpdate('DELETE', '/clear');
  };

  // Les fonctions de calcul restent les mêmes car elles opèrent sur l'état local
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Si le panier est en cours de chargement initial, on peut afficher un loader
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
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}