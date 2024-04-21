const Sequelize = require('sequelize');
const process = require('process');
require('dotenv').config(); // Para cargar las variables de entorno del archivo .env

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: 'postgres',
  }
);

module.exports = sequelize;
