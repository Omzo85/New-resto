import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

const db = {
  Sequelize,
  sequelize,
  MenuItem: require('./menuItem')(sequelize, Sequelize),
  Order: require('./order')(sequelize, Sequelize),
  User: require('./user')(sequelize, Sequelize),
};

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;