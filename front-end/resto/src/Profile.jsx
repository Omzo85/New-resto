import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    email: '',
    password: ''
  });
  const { user } = useAuth();

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminCredentials.email === 'admin@chezkhadija.com' && adminCredentials.password === 'admin123') {
      setIsAdminMode(true);
      alert('Connexion admin réussie !');
    } else {
      alert('Identifiants admin incorrects');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Profil</h2>
      
      {user ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">Informations utilisateur</h3>
          <p className="text-gray-600">Email : {user.email}</p>
        </div>
      ) : (
        <p className="text-gray-600 mb-8">Veuillez vous connecter pour voir votre profil.</p>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Connexion Administrateur</h3>
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email Admin
            </label>
            <input
              id="adminEmail"
              type="email"
              value={adminCredentials.email}
              onChange={(e) => setAdminCredentials({
                ...adminCredentials,
                email: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe Admin
            </label>
            <input
              id="adminPassword"
              type="password"
              value={adminCredentials.password}
              onChange={(e) => setAdminCredentials({
                ...adminCredentials,
                password: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Connexion Admin
          </button>
        </form>
        
        {isAdminMode && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              Connecté en tant qu'administrateur
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;