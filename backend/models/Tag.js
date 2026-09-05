//requerer somente o metodo datatypes do sequelize
const {DataTypes} = require('sequelize')
//requerer a conexão
const conn = require('../db/conn.js')

//definir o model user
const Tag = conn.define('tag',{
    idtag: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descricao:{
        type: DataTypes.STRING,
        required: true
    },
    clinica_cnpj:{
        type: DataTypes.STRING,
        required: true
    }
}, {
    tableName: 'tag',
    timestamps: false
})

module.exports = Tag