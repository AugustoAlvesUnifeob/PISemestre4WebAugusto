require('dotenv').config()
const Sequelize = require('sequelize')

const conn = new Sequelize(
  process.env.DB_NAME || 'easyclinic',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: 3306,
    timezone: '+00:00'
  }
)

conn.authenticate()
  .then(() => console.info('Banco de dados conectado com sucesso!'))
  .catch(error => console.info(`Não foi possível conectar ao banco: ${error}`))

module.exports = conn