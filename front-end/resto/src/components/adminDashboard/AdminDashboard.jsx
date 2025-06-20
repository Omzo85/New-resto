// src/components/adminDashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios'; // Importez l'instance axios configurée
import './AdminDashboard.css'; // Pour le style
import { useAuth } from '../../context/AuthContext'; // Importez useAuth pour l'authentification

function AdminDashboard() {
  const { user, loading: authLoading, logout } = useAuth(); // Récupère l'utilisateur, l'état de chargement de l'auth et la fonction de déconnexion
  const navigate = useNavigate(); // Pour les redirections

  const [activeTab, setActiveTab] = useState('menus');
  const [users, setUsers] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDishModal, setShowDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [message, setMessage] = useState(''); // Pour les messages de succès
  const [error, setError] = useState('');     // Pour les messages d'erreur

  // Vérifier le rôle de l'utilisateur et rediriger si non-admin ou non connecté
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      console.warn("Accès refusé: L'utilisateur n'est pas administrateur ou non connecté.");
      navigate('/admin/login'); // Redirige vers la page de connexion admin
    }
  }, [user, authLoading, navigate]); // Dépendances pour surveiller les changements d'utilisateur et de chargement d'auth

  // Fonctions de récupération des données
  const fetchUsers = async () => {
    try {
      setError(''); // Réinitialise l'erreur avant chaque appel
      const response = await api.get('/users'); // Appel via axios, JWT token ajouté automatiquement
      setUsers(response.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Erreur lors de la récupération des utilisateurs.');
    }
  };

  const fetchDishes = async () => {
    try {
      setError('');
      const response = await api.get('/dishes'); // Appel via axios
      setDishes(response.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des plats:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Erreur lors de la récupération des plats.');
    }
  };

  const fetchOrders = async () => {
    try {
      setError('');
      const response = await api.get('/orders'); // Appel via axios
      setOrders(response.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des commandes:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Erreur lors de la récupération des commandes.');
    }
  };

  // Effect pour charger les données lorsque l'utilisateur est authentifié et admin
  useEffect(() => {
    if (!authLoading && user && user.role === 'admin') {
      fetchUsers();
      fetchDishes();
      fetchOrders();
    }
  }, [user, authLoading]); // Déclenche le fetch lorsque l'utilisateur est connu et authentifié

  // Gestion des plats
  const handleAddDish = async (dishData) => {
    setMessage('');
    setError('');
    try {
      // Axios envoie directement l'objet JSON, pas besoin de FormData si pas de fichier réel
      const response = await api.post('/dishes', dishData); // POST /api/dishes

      if (response.status === 201) { // 201 Created pour un nouvel ajout
        setMessage('Plat ajouté avec succès !');
        setShowDishModal(false);
        fetchDishes(); // Recharger la liste des plats pour mettre à jour l'UI
      } else {
        throw new Error(response.data?.message || 'Erreur lors de l\'ajout');
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout du plat:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout du plat');
    }
  };

  const handleUpdateDish = async (id, updates) => {
    setMessage('');
    setError('');
    try {
      // Axios envoie directement l'objet JSON
      const response = await api.put(`/dishes/${id}`, updates); // PUT /api/dishes/:id

      if (response.status === 200) { // 200 OK pour une mise à jour
        setMessage('Plat mis à jour avec succès !');
        setEditingDish(null); // Quitte le mode édition
        setShowDishModal(false); // Ferme le modal
        fetchDishes(); // Recharger la liste des plats
      } else {
        throw new Error(response.data?.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du plat:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du plat');
    }
  };

  const handleDeleteDish = async (id) => {
    setMessage('');
    setError('');
    // Remplacer window.confirm par un modal personnalisé en production pour une meilleure UX
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce plat ? Cette action est irréversible.')) return;

    try {
      const response = await api.delete(`/dishes/${id}`); // DELETE /api/dishes/:id

      if (response.status === 200) { // 200 OK pour une suppression
        setMessage('Plat supprimé avec succès !');
        setDishes(dishes.filter(dish => dish.id !== id)); // Mise à jour optimiste de l'UI
      } else {
        throw new Error(response.data?.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression du plat:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Erreur lors de la suppression du plat');
    }
  };

  // Gestion des commandes
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setMessage('');
    setError('');
    try {
      // PATCH /api/orders/:orderId/status avec le nouveau statut
      const response = await api.patch(`/orders/${orderId}/status`, { status: newStatus }); 

      if (response.status === 200) {
        setMessage('Statut de commande mis à jour !');
        // Met à jour localement l'état de la commande
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        throw new Error(response.data?.message || 'Erreur lors de la mise à jour du statut');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du statut de la commande');
    }
  };

  const handleLogout = () => {
    logout(); // Utilise la fonction de déconnexion du AuthContext
    navigate('/admin/login'); // Redirige après la déconnexion
  };

  // Composant Modal pour les plats
  const DishModal = ({ dish, onSave, onClose }) => {
    const [formData, setFormData] = useState(dish ? {
      name: dish.name,
      description: dish.description,
      price: parseFloat(dish.price), // Assurez-vous que le prix est un nombre
      category: dish.category,
      image_url: dish.image_url || '' // Utiliser image_url et gérer l'absence
    } : {
      name: '',
      description: '',
      price: '', // Laisser vide pour un nouvel ajout
      category: 'plats', // Catégorie par défaut
      image_url: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      // Assurez-vous que le prix est converti en nombre avant d'envoyer
      const dataToSave = { ...formData, price: parseFloat(formData.price) };
      onSave(dataToSave); // Appelle la fonction onSave (handleAddDish ou handleUpdateDish)
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{dish ? 'Modifier le Plat' : 'Ajouter un Nouveau Plat'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Prix</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Catégorie</label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="entrees">Entrées</option>
                <option value="plats">Plats</option>
                <option value="desserts">Desserts</option>
                <option value="boissons">Boissons</option> {/* Ajoutez si vous avez cette catégorie */}
              </select>
            </div>
            <div className="form-group">
              <label>URL de l'Image</label>
              <input
                type="text" // Changé à 'text' pour l'URL de l'image
                name="image_url" // Nom de champ correspondant au backend
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              />
            </div>
            <div className="modal-actions">
              <button type="submit" className="save-button">
                {dish ? 'Mettre à jour' : 'Ajouter'}
              </button>
              <button type="button" onClick={onClose} className="cancel-button">
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Rendu des sections (gestion des menus, commandes, utilisateurs)
  const renderMenusManagement = () => (
    <div>
      <div className="section-header">
        <h2>Gestion des Menus</h2>
        <button className="add-button" onClick={() => { setShowDishModal(true); setEditingDish(null); setMessage(''); setError(''); }}>
          Ajouter un Plat
        </button>
      </div>
      <div className="dishes-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Description</th>
              <th>Prix</th>
              <th>Catégorie</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dishes.length === 0 ? (
              <tr><td colSpan="6">Aucun plat disponible.</td></tr>
            ) : (
              dishes.map(dish => (
                <tr key={dish.id}>
                  <td>
                    {/* Utilisez dish.image_url et un placeholder si l'URL est vide */}
                    <img src={dish.image_url || 'https://placehold.co/100x100?text=No+Image'} alt={dish.name} className="dish-thumbnail" />
                  </td>
                  <td>{dish.name}</td>
                  <td>{dish.description}</td>
                  <td>{parseFloat(dish.price).toFixed(2)}€</td> {/* Assurez le formatage du prix */}
                  <td>{dish.category}</td>
                  <td className="action-buttons">
                    <button 
                      className="edit-button"
                      onClick={() => { setEditingDish(dish); setShowDishModal(true); setMessage(''); setError(''); }}
                    >
                      Modifier
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteDish(dish.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrdersManagement = () => (
    <div>
      <div className="section-header">
        <h2>Gestion des Commandes</h2>
      </div>
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client (Email)</th> {/* Mise à jour du libellé */}
              <th>Total</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="6">Aucune commande disponible.</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  {/* Accès à l'email de l'utilisateur via l'association 'User' */}
                  <td>{order.User ? order.User.email : 'N/A'}</td> 
                  <td>{parseFloat(order.total_amount).toFixed(2)}€</td>
                  <td>{new Date(order.order_date).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className={`status-select status-${order.status}`}
                    >
                      {/* Statuts conformes au backend ('pending', 'preparing', etc.) */}
                      <option value="pending">En attente</option>
                      <option value="preparing">En préparation</option>
                      <option value="delivering">En livraison</option>
                      <option value="delivered">Livré</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="view-button"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsersManagement = () => (
    <div>
      <div className="section-header">
        <h2>Gestion des Utilisateurs</h2>
      </div>
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="5">Aucun utilisateur disponible.</td></tr>
            ) : (
              users.map(userItem => ( // Renommé 'user' en 'userItem' pour éviter la confusion avec 'user' du AuthContext
                <tr key={userItem.id}>
                  <td>{userItem.nom}</td>
                  <td>{userItem.prenom}</td>
                  <td>{userItem.email}</td>
                  <td>{userItem.role}</td>
                  <td className="action-buttons">
                    {/* Placeholder pour les actions utilisateur - à implémenter */}
                    <button className="edit-button" disabled>Modifier</button>
                    <button className="delete-button" disabled>Supprimer</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Affiche un message de chargement tant que l'authentification n'est pas prête ou que l'utilisateur n'est pas validé admin
  if (authLoading || (user && user.role !== 'admin')) {
    return (
      <div className="admin-dashboard-loading">
        <p>Vérification de l'accès administrateur...</p>
        {/* Vous pouvez ajouter un spinner ici */}
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Tableau de bord Administrateur</h1>
        <button onClick={handleLogout} className="logout-button">
          Déconnexion
        </button>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={`tab-button ${activeTab === 'menus' ? 'active' : ''}`}
          onClick={() => setActiveTab('menus')}
        >
          Gestion des Menus
        </button>
        <button 
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Gestion des Commandes
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Gestion des Utilisateurs
        </button>
      </nav>

      <main className="dashboard-content">
        {/* Affichage des messages de succès/erreur */}
        {message && <div className="admin-message success">{message}</div>}
        {error && <div className="admin-message error">{error}</div>}

        {activeTab === 'menus' && renderMenusManagement()}
        {activeTab === 'orders' && renderOrdersManagement()}
        {activeTab === 'users' && renderUsersManagement()}
      </main>

      {showDishModal && (
        <DishModal
          dish={editingDish} // Passe le plat s'il est en mode édition
          onSave={editingDish ? (data) => handleUpdateDish(editingDish.id, data) : handleAddDish}
          onClose={() => { setShowDishModal(false); setEditingDish(null); setMessage(''); setError(''); }}
        />
      )}

      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Détails de la Commande #{selectedOrder.id}</h2>
            <div className="modal-body">
              <p><strong>Client:</strong> {selectedOrder.User ? selectedOrder.User.email : 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.order_date).toLocaleDateString('fr-FR')}</p>
              <h3>Articles</h3>
              <table className="modal-items-table">
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.OrderItems && selectedOrder.OrderItems.length > 0 ? (
                    selectedOrder.OrderItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.Dish ? item.Dish.name : 'N/A'}</td> {/* Accès au nom du plat via l'association */}
                        <td>{item.quantity}</td>
                        <td>{item.Dish ? parseFloat(item.Dish.price).toFixed(2) : 'N/A'}€</td> {/* Prix unitaire du plat */}
                        <td>{(item.quantity * (item.Dish ? parseFloat(item.Dish.price) : 0)).toFixed(2)}€</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4">Aucun article pour cette commande.</td></tr>
                  )}
                </tbody>
              </table>
              <p className="modal-total">
                <strong>Total:</strong> {parseFloat(selectedOrder.total_amount).toFixed(2)}€
              </p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setSelectedOrder(null)} className="cancel-button">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
