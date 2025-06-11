// src/controllers/cartController.js
const CartItem = require('../models/cartItemModel'); // Importez le modèle CartItem
const Dish = require('../models/dishModel');       // Importez le modèle Dish

class CartController {
  // Récupérer le panier d'un utilisateur
  async getCart(req, res) {
    try {
      const userId = req.userId; // L'ID utilisateur vient du middleware d'authentification
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }

      // Récupérer les articles du panier pour cet utilisateur, en incluant les détails des plats
      const cartItems = await CartItem.findAll({
        where: { user_id: userId },
        include: [{
          model: Dish,
          attributes: ['id', 'name', 'price', 'image_url', 'description'] // Attributs du plat à inclure
        }]
      });

      // Formater la réponse pour inclure les détails du plat directement dans l'article du panier
      const formattedCart = cartItems.map(item => ({
        id: item.id,
        dishId: item.dish_id, // L'ID du plat (maintenant une chaîne de caractères)
        name: item.Dish.name,
        price: parseFloat(item.Dish.price), // Assurez-vous que le prix est un nombre
        image: item.Dish.image_url,
        description: item.Dish.description,
        quantity: item.quantity,
      }));

      res.status(200).json(formattedCart);
    } catch (error) {
      console.error("Erreur lors de la récupération du panier :", error);
      res.status(500).json({ message: 'Erreur lors du chargement du panier.', error: error.message });
    }
  }

  // Ajouter un plat au panier (ou augmenter la quantité)
  async addToCart(req, res) {
    try {
      const userId = req.userId;
      const { dishId, quantity } = req.body;

      if (!userId || !dishId || !quantity) {
        return res.status(400).json({ message: 'Missing required fields: userId, dishId, quantity.' });
      }

      // Vérifier si le plat existe (dishId est maintenant une chaîne de caractères)
      const dish = await Dish.findByPk(dishId);
      if (!dish) {
        return res.status(404).json({ message: 'Plat non trouvé.' });
      }

      // Chercher si l'article existe déjà dans le panier de l'utilisateur
      let cartItem = await CartItem.findOne({
        where: { user_id: userId, dish_id: dishId }
      });

      if (cartItem) {
        // Si l'article existe, mettre à jour la quantité
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        // Si l'article n'existe pas, le créer
        cartItem = await CartItem.create({
          user_id: userId,
          dish_id: dishId,
          quantity: quantity
        });
      }

      res.status(200).json({ message: 'Plat ajouté au panier avec succès.', item: cartItem });
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
      res.status(500).json({ message: "Erreur lors de l'ajout au panier.", error: error.message });
    }
  }

  // Supprimer un plat du panier
  async removeFromCart(req, res) {
    try {
      const userId = req.userId;
      const { dishId } = req.params; // dishId est une chaîne de caractères

      if (!userId || !dishId) {
        return res.status(400).json({ message: 'Missing required fields: userId, dishId.' });
      }

      const deletedCount = await CartItem.destroy({
        where: { user_id: userId, dish_id: dishId }
      });

      if (deletedCount === 0) {
        return res.status(404).json({ message: 'Article non trouvé dans le panier.' });
      }

      res.status(200).json({ message: 'Plat supprimé du panier avec succès.' });
    } catch (error) {
      console.error("Erreur lors de la suppression du panier :", error);
      res.status(500).json({ message: "Erreur lors de la suppression du panier.", error: error.message });
    }
  }

  // Mettre à jour la quantité d'un plat dans le panier
  async updateQuantity(req, res) {
    try {
      const userId = req.userId;
      const { dishId, quantity } = req.body; // dishId est une chaîne de caractères

      if (!userId || !dishId || quantity === undefined) {
        return res.status(400).json({ message: 'Missing required fields: userId, dishId, quantity.' });
      }
      
      // Si la quantité est 0 ou moins, on supprime l'article
      if (quantity <= 0) {
        return await this.removeFromCart(req, res); // Réutiliser la fonction de suppression
      }

      const [updatedCount] = await CartItem.update(
        { quantity: quantity },
        { where: { user_id: userId, dish_id: dishId } }
      );

      if (updatedCount === 0) {
        return res.status(404).json({ message: 'Article non trouvé dans le panier pour mise à jour.' });
      }

      res.status(200).json({ message: 'Quantité du plat mise à jour avec succès.' });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la quantité :", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour de la quantité du plat.", error: error.message });
    }
  }

  // Vider tout le panier d'un utilisateur
  async clearCart(req, res) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }

      await CartItem.destroy({
        where: { user_id: userId }
      });

      res.status(200).json({ message: 'Panier vidé avec succès.' });
    } catch (error) {
      console.error("Erreur lors du vidage du panier :", error);
      res.status(500).json({ message: "Erreur lors du vidage du panier.", error: error.message });
    }
  }
}

module.exports = new CartController();
