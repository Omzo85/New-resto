// src/controllers/orderController.js
const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');
const User = require('../models/userModel');
const Dish = require('../models/dishModel');

// --- Débogage : Vérifier si les modèles sont correctement importés ---
console.log('--- Vérification des importations de modèles dans orderController.js ---');
console.log('Modèle Order chargé:', !!Order);
console.log('Modèle OrderItem chargé:', !!OrderItem);
console.log('Modèle User chargé:', !!User);
console.log('Modèle Dish chargé:', !!Dish);
console.log('----------------------------------------------------------');
// -------------------------------------------------------------------

class OrderController {
  // Récupérer toutes les commandes (pour l'admin)
  async getAllOrders(req, res) {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: User, // Inclut les informations de l'utilisateur qui a passé la commande
            attributes: ['id', 'email', 'nom', 'prenom'] // Sélectionnez les attributs nécessaires
          },
          {
            model: OrderItem, // Inclut les articles de chaque commande
            include: [{
              model: Dish, // Inclut les détails du plat pour chaque article de commande
              attributes: ['id', 'name', 'price'] // Sélectionnez les attributs nécessaires du plat
            }]
          }
        ],
        order: [['order_date', 'DESC']] // Trie par date de commande décroissante
      });
      res.status(200).json(orders);
    } catch (error) {
      console.error("Erreur lors de la récupération de toutes les commandes :", error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des commandes.', error: error.message });
    }
  }

  // Mettre à jour le statut d'une commande
  async updateOrderStatus(req, res) {
    const { id } = req.params; // ID de la commande à mettre à jour
    const { status } = req.body; // Nouveau statut

    if (!status) {
      return res.status(400).json({ message: 'Le statut est obligatoire.' });
    }

    try {
      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ message: 'Commande non trouvée.' });
      }

      order.status = status;
      await order.save();
      res.status(200).json({ message: 'Statut de la commande mis à jour avec succès.', order });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de la commande :", error);
      res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du statut de la commande.', error: error.message });
    }
  }
}

module.exports = new OrderController();
