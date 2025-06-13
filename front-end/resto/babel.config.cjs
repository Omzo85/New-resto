// front-end/resto/babel.config.cjs (ou .js si vous n'avez pas de "type": "module" dans package.json)
module.exports = {
  presets: [
    ['@babel/preset-env', { 
      targets: { node: 'current' },
      // Le preset-env gère la transformation des imports, mais import.meta nécessite un plugin spécifique pour être parsé.
    }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: [ // <-- NOUVEAU : Ajout du plugin pour parser import.meta
    '@babel/plugin-syntax-import-meta' 
  ]
};
