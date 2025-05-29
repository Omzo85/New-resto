import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('menus');
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDishModal, setShowDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchDishes();
    fetchOrders();
  }, []);

  // Fonctions de récupération des données
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Erreur réseau');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };

  const fetchDishes = async () => {
    try {
      const response = await fetch('/api/dishes');
      if (!response.ok) throw new Error('Erreur réseau');
      const data = await response.json();
      setDishes(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des plats:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Erreur réseau');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
    }
  };

  // Gestion des plats
  const handleAddDish = async (dishData) => {
    try {
      const formData = new FormData();
      Object.keys(dishData).forEach(key => {
        formData.append(key, dishData[key]);
      });

      const response = await fetch('/api/dishes', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Erreur lors de l\'ajout');
      
      const newDish = await response.json();
      setDishes([...dishes, newDish]);
      setShowDishModal(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du plat:', error);
      alert('Erreur lors de l\'ajout du plat');
    }
  };

  const handleUpdateDish = async (id, updates) => {
    try {
      const formData = new FormData();
      Object.keys(updates).forEach(key => {
        formData.append(key, updates[key]);
      });

      const response = await fetch(`/api/dishes/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      
      const updatedDish = await response.json();
      setDishes(dishes.map(dish => dish.id === id ? updatedDish : dish));
      setEditingDish(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du plat:', error);
      alert('Erreur lors de la mise à jour du plat');
    }
  };

  const handleDeleteDish = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) return;

    try {
      const response = await fetch(`/api/dishes/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');
      
      setDishes(dishes.filter(dish => dish.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du plat:', error);
      alert('Erreur lors de la suppression du plat');
    }
  };

  // Gestion des commandes
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour du statut');
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut de la commande');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // Composant Modal pour les plats
  const DishModal = ({ dish, onSave, onClose }) => {
    const [formData, setFormData] = useState(dish || {
      name: '',
      description: '',
      price: '',
      category: 'entrees',
      image: null
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{dish ? 'Modifier le plat' : 'Ajouter un plat'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
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
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="entrees">Entrées</option>
                <option value="plats">Plats</option>
                <option value="desserts">Desserts</option>
              </select>
            </div>
            <div className="form-group">
              <label>Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
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

  // Rendu des sections
  const renderMenusManagement = () => (
    <div>
      <div className="section-header">
        <h2>Gestion des menus</h2>
        <button className="add-button" onClick={() => setShowDishModal(true)}>
          Ajouter un plat
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
            {dishes.map(dish => (
              <tr key={dish.id}>
                <td>
                  <img src={dish.image_url} alt={dish.name} className="dish-thumbnail" />
                </td>
                <td>{dish.name}</td>
                <td>{dish.description}</td>
                <td>{dish.price}€</td>
                <td>{dish.category}</td>
                <td className="action-buttons">
                  <button 
                    className="edit-button"
                    onClick={() => setEditingDish(dish)}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrdersManagement = () => (
    <div>
      <div className="section-header">
        <h2>Gestion des commandes</h2>
      </div>
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Total</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user_email}</td>
                <td>{order.total_amount}€</td>
                <td>{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                    className={`status-select status-${order.status}`}
                  >
                    <option value="en_attente">En attente</option>
                    <option value="en_preparation">En préparation</option>
                    <option value="en_livraison">En livraison</option>
                    <option value="livre">Livré</option>
                    <option value="annule">Annulé</option>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsersManagement = () => (
    <div>
      <div className="section-header">
        <h2>Gestion des utilisateurs</h2>
      </div>
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Date d'inscription</th>
              <th>Dernière connexion</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
                <td>{user.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR') : 'Jamais'}</td>
                <td className="action-buttons">
                  <button className="delete-button">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Tableau de bord administrateur</h1>
        <button onClick={handleLogout} className="logout-button">
          Déconnexion
        </button>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={`tab-button ${activeTab === 'menus' ? 'active' : ''}`}
          onClick={() => setActiveTab('menus')}
        >
          Gestion des menus
        </button>
        <button 
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Gestion des commandes
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Gestion des utilisateurs
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'menus' && renderMenusManagement()}
        {activeTab === 'orders' && renderOrdersManagement()}
        {activeTab === 'users' && renderUsersManagement()}
      </main>

      {showDishModal && (
        <DishModal
          onSave={handleAddDish}
          onClose={() => setShowDishModal(false)}
        />
      )}

      {editingDish && (
        <DishModal
          dish={editingDish}
          onSave={(dish) => handleUpdateDish(editingDish.id, dish)}
          onClose={() => setEditingDish(null)}
        />
      )}

      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Détails de la commande #{selectedOrder.id}</h2>
            <div className="modal-body">
              <p><strong>Client:</strong> {selectedOrder.user_email}</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleDateString('fr-FR')}</p>
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
                  {selectedOrder.items?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.dish_name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price_at_time}€</td>
                      <td>{(item.quantity * item.price_at_time).toFixed(2)}€</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="modal-total">
                <strong>Total:</strong> {selectedOrder.total_amount}€
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