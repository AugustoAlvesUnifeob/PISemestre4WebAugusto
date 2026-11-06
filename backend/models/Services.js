//requerer somente o metodo datatypes do sequelize
const {DataTypes} = require('sequelize')
//requerer a conexão
const conn = require('../db/conn.js')

//definir o model user
const Servicos = conn.define('servicos',{
    idservico: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome:{
        type: DataTypes.STRING,
        required: true
    },
    preco:{
        type: DataTypes.FLOAT,
        required: true
    },
    clinica_cnpj:{
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'servicos',
    timestamps: false
})

module.exports = Servicos