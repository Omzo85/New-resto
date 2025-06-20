// src/setupTests.js
// Ce fichier est exécuté après la configuration de l'environnement de test global de Jest
// et avant l'exécution de chaque suite de tests.

// Il est couramment utilisé pour importer des bibliothèques d'extension ou
// configurer des mocks globaux.

// Par exemple, pour les extensions de @testing-library/jest-dom, qui ajoutent des matchers personnalisés
// pour faciliter le test du DOM dans Jest.
import '@testing-library/jest-dom';

// Vous pouvez ajouter d'autres configurations globales ici si nécessaire.
// Par exemple, si vous utilisez Enzyme:
// import { configure } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
// configure({ adapter: new Adapter() });

// Ou pour configurer des mocks globaux:
// global.fetch = jest.fn(() =>
//   Promise.resolve({ json: () => Promise.resolve({ success: true }) })
// );
