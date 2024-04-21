const Sequelize = require('sequelize');
const process = require('process');
require('dotenv').config(); // Para cargar las variables de entorno del archivo .env

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PSQL_HOST,
    port: 5432, // Puerto por defecto de PostgreSQL
    dialect: 'postgres',
  }
);

module.exports = sequelize;

