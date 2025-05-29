import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import DishDetail from './pages/DishDetail';
import Cart from './pages/Cart';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer/Footer';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminDashboard from './components/adminDashboard/AdminDashboard';
import Header from './components/Header/Header';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-container">
            <Header />
            <Routes>
              <Route path="/admin/dashboard" element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              } />
              <Route path="/" element={<Home />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dish/:id" element={<DishDetail />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;