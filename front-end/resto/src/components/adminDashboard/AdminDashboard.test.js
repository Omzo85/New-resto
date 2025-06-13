// src/components/adminDashboard/AdminDashboard.test.js
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminDashboard from './AdminDashboard';
import { AuthContext } from '../../context/AuthContext'; // Importez le contexte d'authentification

// Déplacez les déclarations des mocks DANS le jest.mock
// Ceci assure qu'ils sont initialisés quand le mock est créé.
jest.mock('../../api/axios', () => {
  // Déclarez les mocks ici
  const mockedApiGet = jest.fn();
  const mockedApiPost = jest.fn();
  const mockedApiPut = jest.fn();
  const mockedApiDelete = jest.fn();
  const mockedApiPatch = jest.fn();

  return {
    __esModule: true, // Indique que c'est un module ES
    default: {
      get: mockedApiGet,
      post: mockedApiPost,
      put: mockedApiPut,
      delete: mockedApiDelete,
      patch: mockedApiPatch,
      // Simulez defaults.baseURL pour les logs ou les utilisations directes dans le code
      defaults: {
        baseURL: 'http://localhost:5000/api', 
      },
      // Ajoutez d'autres méthodes si elles sont utilisées (ex: interceptors, create)
      interceptors: {
        request: { use: jest.fn(() => ({})), eject: jest.fn() },
        response: { use: jest.fn(() => ({})), eject: jest.fn() },
      },
    },
    // Exposez les fonctions mockées pour pouvoir les manipuler dans les tests
    // en utilisant jest.mocked() ou en les assignant à une variable globale si besoin.
    // Pour une utilisation simple comme dans beforeEach, les références directes sont ok.
  };
});

// Récupérez les mocks après la définition du mock global
// C'est la manière idiomatique de Jest de récupérer les mocks définis dans jest.mock
const api = require('../../api/axios').default; // Récupère l'objet mocké
const mockedApiGet = api.get; // Récupère la fonction mockée
const mockedApiPost = api.post;
const mockedApiPut = api.put;
const mockedApiDelete = api.delete;
const mockedApiPatch = api.patch;


// Mock de useNavigate de react-router-dom
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));


// Mock des fonctions d'AuthContext
const mockLogin = jest.fn();
const mockLogout = jest.fn();
const mockSignup = jest.fn();
const mockForgotPassword = jest.fn();
const mockSetError = jest.fn();

// Données fictives pour les tests
const mockDishes = [
  { id: '1', name: 'Plat Test 1', description: 'Desc 1', price: 10.00, category: 'plats', image_url: 'img1.jpg' },
  { id: '2', name: 'Plat Test 2', description: 'Desc 2', price: 12.50, category: 'entrees', image_url: 'img2.jpg' },
];
const mockUsers = [
  { id: 'u1', nom: 'Doe', prenom: 'John', email: 'john@example.com', role: 'user' },
];
const mockOrders = [
  { id: 'o1', User: { email: 'john@example.com' }, total_amount: 25.00, order_date: '2024-01-01', status: 'pending', OrderItems: [] },
];

describe('AdminDashboard', () => {
  // Réinitialiser les mocks avant chaque test
  beforeEach(() => {
    jest.clearAllMocks(); // Nettoie l'historique des appels des mocks

    // Configurez les mocks de l'API pour les appels initiaux
    mockedApiGet.mockImplementation((url) => {
      if (url === '/dishes') {
        return Promise.resolve({ data: mockDishes, status: 200 });
      }
      if (url === '/users') {
        return Promise.resolve({ data: mockUsers, status: 200 });
      }
      if (url === '/orders') {
        return Promise.resolve({ data: mockOrders, status: 200 });
      }
      return Promise.reject(new Error('URL non mockée'));
    });
  });

  // Test 1: Le composant se rend et charge les données initiales
  test('renders and fetches initial data for admin user', async () => {
    // Rend le composant avec un utilisateur administrateur
    render(
      <AuthContext.Provider value={{
        user: { id: 'admin1', role: 'admin', email: 'admin@example.com' },
        loading: false, login: mockLogin, logout: mockLogout, signup: mockSignup, forgotPassword: mockForgotPassword, setError: mockSetError
      }}>
        <AdminDashboard />
      </AuthContext.Provider>
    );

    // Attendre que les appels API soient effectués
    await waitFor(() => {
      expect(mockedApiGet).toHaveBeenCalledWith('/dishes');
      expect(mockedApiGet).toHaveBeenCalledWith('/users');
      expect(mockedApiGet).toHaveBeenCalledWith('/orders');
    });

    // Vérifier que le titre du dashboard est présent
    expect(screen.getByText('Tableau de bord Administrateur')).toBeInTheDocument();
    
    // Vérifier que certains plats sont affichés
    expect(screen.getByText('Plat Test 1')).toBeInTheDocument();
    expect(screen.getByText('Plat Test 2')).toBeInTheDocument();
  });

  // Test 2: Ajout d'un nouveau plat
  test('allows adding a new dish', async () => {
    // Mock pour l'appel POST de l'ajout
    mockedApiPost.mockResolvedValueOnce({ data: { message: 'Plat ajouté avec succès !', dish: { id: '3', name: 'Nouveau Plat', price: 18.00, category: 'plats', image_url: 'new.jpg' } }, status: 201 });
    
    // Après l'ajout, le composant refait un fetchDishes, donc mettez à jour mockDishes
    const updatedDishes = [...mockDishes, { id: '3', name: 'Nouveau Plat', description: 'Description du nouveau plat', price: 18.00, category: 'plats', image_url: 'new.jpg' }];
    mockedApiGet.mockImplementation((url) => {
      if (url === '/dishes') {
        return Promise.resolve({ data: updatedDishes, status: 200 });
      }
      if (url === '/users') {
        return Promise.resolve({ data: mockUsers, status: 200 });
      }
      if (url === '/orders') {
        return Promise.resolve({ data: mockOrders, status: 200 });
      }
      return Promise.reject(new Error('URL non mockée'));
    });

    // Rend le composant
    render(
      <AuthContext.Provider value={{
        user: { id: 'admin1', role: 'admin', email: 'admin@example.com' },
        loading: false, login: mockLogin, logout: mockLogout, signup: mockSignup, forgotPassword: mockForgotPassword, setError: mockSetError
      }}>
        <AdminDashboard />
      </AuthContext.Provider>
    );

    // Attendre que les données initiales soient chargées
    await waitFor(() => expect(screen.getByText('Plat Test 1')).toBeInTheDocument());

    // Cliquer sur le bouton "Ajouter un Plat" pour ouvrir le modal
    fireEvent.click(screen.getByText('Ajouter un Plat'));

    // Attendre que le modal apparaisse et que le titre soit "Ajouter un Nouveau Plat"
    await waitFor(() => expect(screen.getByText('Ajouter un Nouveau Plat')).toBeInTheDocument());

    // Remplir le formulaire du modal
    fireEvent.change(screen.getByLabelText(/Nom/i), { target: { value: 'Nouveau Plat' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Description du nouveau plat' } });
    fireEvent.change(screen.getByLabelText(/Prix/i), { target: { value: '18.00' } });
    fireEvent.change(screen.getByLabelText(/Catégorie/i), { target: { value: 'plats' } });
    fireEvent.change(screen.getByLabelText(/URL de l'Image/i), { target: { value: 'new.jpg' } });

    // Soumettre le formulaire
    fireEvent.click(screen.getByRole('button', { name: /Ajouter/i }));

    // Attendre que l'appel POST soit fait
    await waitFor(() => {
      expect(mockedApiPost).toHaveBeenCalledWith('/dishes', {
        name: 'Nouveau Plat',
        description: 'Description du nouveau plat',
        price: 18.00,
        category: 'plats',
        image_url: 'new.jpg',
      });
    });

    // Attendre que le message de succès s'affiche
    expect(await screen.findByText('Plat ajouté avec succès !')).toBeInTheDocument();

    // Vérifier que le nouveau plat est maintenant dans la liste
    expect(screen.getByText('Nouveau Plat')).toBeInTheDocument();
  });

  // Note: Vous pouvez ajouter plus de tests ici pour:
  // - La modification d'un plat (handleUpdateDish)
  // - La suppression d'un plat (handleDeleteDish)
  // - La gestion des erreurs (ex: afficher un message d'erreur si l'API échoue)
  // - La navigation et la protection des routes admin
  // - La gestion des commandes et des utilisateurs
});
