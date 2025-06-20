// src/controllers/dishController.js
const Dish = require('../models/dishModel');
const { v4: uuidv4 } = require('uuid'); // Pour générer des UUIDs pour les IDs de plats

class DishController {
  // Récupérer tous les plats
  async getAllDishes(req, res) {
    try {
      const dishes = await Dish.findAll();
      res.status(200).json(dishes);
    } catch (error) {
      console.error("Erreur lors de la récupération des plats :", error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des plats.', error: error.message });
    }
  }

  // Ajouter un nouveau plat
  async addDish(req, res) {
    const { name, description, price, category, image_url } = req.body;
    
    // Générer un UUID comme ID si non fourni (car DISHES.id est VARCHAR)
    const id = uuidv4(); 

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Le nom, le prix et la catégorie sont obligatoires.' });
    }
    if (isNaN(price) || price <= 0) {
        return res.status(400).json({ message: 'Le prix doit être un nombre positif.' });
    }

    try {
      const newDish = await Dish.create({ id, name, description, price, category, image_url });
      res.status(201).json({ message: 'Plat ajouté avec succès.', dish: newDish });
    } catch (error) {
      console.error("Erreur lors de l'ajout du plat :", error);
      res.status(500).json({ message: 'Erreur serveur lors de l\'ajout du plat.', error: error.message });
    }
  }

  // Mettre à jour un plat existant
  async updateDish(req, res) {
    const { id } = req.params;
    const { name, description, price, category, image_url } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Le nom, le prix et la catégorie sont obligatoires.' });
    }
    if (isNaN(price) || price <= 0) {
        return res.status(400).json({ message: 'Le prix doit être un nombre positif.' });
    }

    try {
      const dish = await Dish.findByPk(id);
      if (!dish) {
        return res.status(404).json({ message: 'Plat non trouvé.' });
      }

      dish.name = name;
      dish.description = description;
      dish.price = price;
      dish.category = category;
      dish.image_url = image_url;
      await dish.save();

      res.status(200).json({ message: 'Plat mis à jour avec succès.', dish });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du plat :", error);
      res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du plat.', error: error.message });
    }
  }

  // Supprimer un plat
  async deleteDish(req, res) {
    const { id } = req.params;

    try {
      const deletedCount = await Dish.destroy({ where: { id } });
      if (deletedCount === 0) {
        return res.status(404).json({ message: 'Plat non trouvé.' });
      }
      res.status(200).json({ message: 'Plat supprimé avec succès.' });
    } catch (error) {
      console.error("Erreur lors de la suppression du plat :", error);
      res.status(500).json({ message: 'Erreur serveur lors de la suppression du plat.', error: error.message });
    }
  }
}

module.exports = new DishController();
