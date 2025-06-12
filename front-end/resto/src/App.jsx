import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login'; // Assurez-vous que c'est bien 'Login' et non 'components/Login'
import DishDetail from './pages/DishDetail'; // Assurez-vous que c'est bien 'DishDetail' et non 'components/DishDetail'
import Cart from './pages/Cart';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer/Footer';
import ProtectedAdminRoute from './ProtectedAdminRoute';
import AdminDashboard from './components/adminDashboard/AdminDashboard';
import Header from './components/Header/Header';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';
import PrivateRoute from './components/PrivateRoute/PrivateRoute'; // <-- Importez PrivateRoute
import ProfilePage from './pages/ProfilePage'; // <-- Importez ProfilePage


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-container">
            <Header />
            <Routes>
              {/* Routes protégées pour l'administration */}
              <Route path="/admin/dashboard" element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Routes publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dish/:id" element={<DishDetail />} />
              <Route path="/cart" element={<Cart />} />

              {/* Nouvelle route pour la page de profil, protégée */}
              <Route path="/profile" element={
                <PrivateRoute> {/* Utilise PrivateRoute pour protéger la page */}
                  <ProfilePage />
                </PrivateRoute>
              } />

              {/* Route 404 pour les chemins non trouvés */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
