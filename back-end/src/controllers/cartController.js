// src/controllers/cartController.js
const CartItem = require('../models/cartItemModel'); // Assurez-vous que ce chemin est correct
const Dish = require('../models/dishModel'); // Importez le modèle Dish pour récupérer les détails du plat

class CartController {
    // Récupérer le panier d'un utilisateur
    async getCart(req, res) {
        // req.userId est défini par authMiddleware et contient l'ID de l'utilisateur authentifié.
        const userId = req.userId;
        console.log(`CartController: Tentative de récupération du panier pour userId: ${userId}`);

        try {
            // Récupérer les articles du panier pour cet utilisateur, en incluant les détails du plat associé
            const cartItems = await CartItem.findAll({
                where: { userId: userId },
                include: [{
                    model: Dish,
                    attributes: ['id', 'name', 'price', 'image_url'] // Récupère les infos nécessaires du plat
                }]
            });

            // Mapper les résultats pour correspondre au format attendu par le frontend (DishId, Name, Price, Image, Quantity)
            const formattedCartItems = cartItems.map(item => ({
                dishId: item.dishId,
                name: item.Dish.name,       // Nom du plat
                price: item.Dish.price,     // Prix du plat
                image: item.Dish.image_url, // URL de l'image du plat
                quantity: item.quantity
            }));

            console.log(`CartController: Panier récupéré pour userId ${userId}:`, formattedCartItems);
            res.status(200).json(formattedCartItems);
        } catch (error) {
            console.error(`CartController: Erreur lors de la récupération du panier pour userId ${userId}:`, error);
            res.status(500).json({ message: 'Erreur serveur lors de la récupération du panier.', error: error.message });
        }
    }

    // Ajouter un plat au panier
    async addToCart(req, res) {
        const { dishId, quantity } = req.body;
        const userId = req.userId; // L'ID de l'utilisateur provient du token JWT

        console.log(`CartController: Tentative d'ajout au panier. userId: ${userId}, dishId: ${dishId}, quantity: ${quantity}`);

        if (!dishId || !quantity || quantity <= 0) {
            console.warn(`CartController: Données invalides pour l'ajout au panier. dishId: ${dishId}, quantity: ${quantity}`);
            return res.status(400).json({ message: 'L\'ID du plat et la quantité sont obligatoires et la quantité doit être supérieure à zéro.' });
        }

        try {
            // 1. Vérifier si le plat existe dans la table DISHES
            const dish = await Dish.findByPk(dishId);
            if (!dish) {
                console.warn(`CartController: Plat non trouvé dans la base de données. dishId: ${dishId}`);
                return res.status(404).json({ message: 'Plat non trouvé.' });
            }

            // 2. Vérifier si l'article existe déjà dans le panier de l'utilisateur
            let cartItem = await CartItem.findOne({
                where: {
                    userId: userId,
                    dishId: dishId
                }
            });

            if (cartItem) {
                // Si l'article existe, mettre à jour la quantité
                cartItem.quantity += quantity;
                await cartItem.save();
                console.log(`CartController: Quantité du plat ${dishId} mise à jour dans le panier. Nouvelle quantité: ${cartItem.quantity}`);
                res.status(200).json({ message: 'Quantité du plat mise à jour dans le panier.', cartItem });
            } else {
                // Si l'article n'existe pas, l'ajouter
                cartItem = await CartItem.create({
                    userId: userId,
                    dishId: dishId,
                    quantity: quantity
                });
                console.log(`CartController: Plat ${dishId} ajouté au panier.`);
                res.status(201).json({ message: 'Plat ajouté au panier.', cartItem });
            }
        } catch (error) {
            console.error(`CartController: Erreur serveur lors de l'ajout au panier pour userId ${userId}, dishId ${dishId}:`, error);
            res.status(500).json({ message: 'Erreur serveur lors de l\'ajout au panier.', error: error.message });
        }
    }

    // Supprimer un plat du panier
    async removeFromCart(req, res) {
        const { dishId } = req.params; // L'ID du plat à supprimer
        const userId = req.userId;

        console.log(`CartController: Tentative de suppression du plat. userId: ${userId}, dishId: ${dishId}`);

        try {
            const result = await CartItem.destroy({
                where: {
                    userId: userId,
                    dishId: dishId
                }
            });

            if (result === 0) {
                console.warn(`CartController: Article non trouvé dans le panier pour suppression. userId: ${userId}, dishId: ${dishId}`);
                return res.status(404).json({ message: 'Article non trouvé dans le panier.' });
            }
            console.log(`CartController: Plat ${dishId} supprimé du panier.`);
            res.status(200).json({ message: 'Plat supprimé du panier.' });
        } catch (error) {
            console.error(`CartController: Erreur serveur lors de la suppression du panier pour userId ${userId}, dishId ${dishId}:`, error);
            res.status(500).json({ message: 'Erreur serveur lors de la suppression du plat du panier.', error: error.message });
        }
    }

    // Mettre à jour la quantité d'un plat dans le panier
    async updateQuantity(req, res) {
        const { dishId, quantity } = req.body;
        const userId = req.userId;

        console.log(`CartController: Tentative de mise à jour de la quantité. userId: ${userId}, dishId: ${dishId}, newQuantity: ${quantity}`);

        if (!dishId || !quantity || quantity <= 0) {
            console.warn(`CartController: Données invalides pour la mise à jour de la quantité. dishId: ${dishId}, quantity: ${quantity}`);
            return res.status(400).json({ message: 'L\'ID du plat et la quantité sont obligatoires et la quantité doit être supérieure à zéro.' });
        }

        try {
            const cartItem = await CartItem.findOne({
                where: {
                    userId: userId,
                    dishId: dishId
                }
            });

            if (!cartItem) {
                console.warn(`CartController: Article non trouvé dans le panier pour mise à jour de quantité. userId: ${userId}, dishId: ${dishId}`);
                return res.status(404).json({ message: 'Article non trouvé dans le panier.' });
            }

            cartItem.quantity = quantity;
            await cartItem.save();
            console.log(`CartController: Quantité du plat ${dishId} mise à jour dans le panier. Nouvelle quantité: ${cartItem.quantity}`);
            res.status(200).json({ message: 'Quantité du plat mise à jour.', cartItem });
        } catch (error) {
            console.error(`CartController: Erreur serveur lors de la mise à jour de la quantité pour userId ${userId}, dishId ${dishId}:`, error);
            res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de la quantité.', error: error.message });
        }
    }

    // Vider tout le panier
    async clearCart(req, res) {
        const userId = req.userId;

        console.log(`CartController: Tentative de vider le panier pour userId: ${userId}`);

        try {
            await CartItem.destroy({
                where: { userId: userId }
            });
            console.log(`CartController: Panier vidé pour userId: ${userId}`);
            res.status(200).json({ message: 'Panier vidé avec succès.' });
        } catch (error) {
            console.error(`CartController: Erreur serveur lors du vidage du panier pour userId ${userId}:`, error);
            res.status(500).json({ message: 'Erreur serveur lors du vidage du panier.', error: error.message });
        }
    }
}

module.exports = new CartController();
