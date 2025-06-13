// src/setupTests.js
import '@testing-library/jest-dom';

// Polyfill minimal import.meta.env pour l'environnement Jest
// Jest s'exécute dans Node.js où import.meta n'est pas nativement disponible comme dans les bundlers (Vite).
// Ce mock garantit que import.meta.env existe et a VITE_API_URL pour les tests,
// évitant ainsi le "SyntaxError: Cannot use 'import.meta' outside a module".
if (typeof global.import_meta === 'undefined') {
  global.import_meta = {
    env: {
      VITE_API_URL: 'http://localhost:5000' // Fournissez une URL de test pour votre backend
    }
  };
} else if (typeof global.import_meta.env === 'undefined') {
  global.import_meta.env = {
    VITE_API_URL: 'http://localhost:5000'
  };
}
