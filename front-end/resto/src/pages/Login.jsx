import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { login, signup, error, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoginMode) {
      const success = await login(formData.email, formData.password);
      if (success) {
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Les mots de passe ne correspondent pas");
        return;
      }
      const success = await signup(formData.email, formData.password);
      if (success) {
        alert("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
        setIsLoginMode(true);
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
        });
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{isLoginMode ? 'Connexion' : 'Inscription'}</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {!isLoginMode && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <button type="submit" className="login-button">
          {isLoginMode ? 'Se connecter' : 'S\'inscrire'}
        </button>

        <button 
          type="button" 
          className="switch-mode-button"
          onClick={() => {
            setIsLoginMode(!isLoginMode);
            setFormData({
              email: '',
              password: '',
              confirmPassword: '',
            });
          }}
        >
          {isLoginMode ? 'Créer un compte' : 'Déjà inscrit ? Se connecter'}
        </button>
      </form>
    </div>
  );
}

export default Login;