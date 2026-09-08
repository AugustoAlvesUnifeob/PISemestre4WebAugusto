//requer o sequelize
const Sequelize = require('sequelize')

//parametros de conexao
const conn = new Sequelize(
    'easyclinic',
    'root',
    '',
    {
        host:'localhost',
        dialect:'mysql',
        port:3306
    }
)

try{
    conn.authenticate
    console.info('Banco de dados conectado com sucesso!')
}catch(error){
    console.info(`Não foi possivel conectar ao banco: ${error}`)
}

module.exports = conn