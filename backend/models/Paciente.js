//requerer somente o metodo datatypes do sequelize
const {DataTypes} = require('sequelize')
//requerer a conexão
const conn = require('../db/conn.js')

//definir o model user
const Paciente = conn.define('paciente',{
    idpaciente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome:{
        type: DataTypes.STRING,
        required: true
    },
    cpf:{
        type: DataTypes.STRING,
        required: true
    },
    telefone:{
        type: DataTypes.STRING,
        required: true
    },
    email:{
        type: DataTypes.STRING,
        required: true
    },
    complemento:{
        type: DataTypes.STRING,
    },
    tag_idtag:{
        type: DataTypes.INTEGER,
    },
    plano_idplano:{
        type: DataTypes.INTEGER,
    },
    clinica_cnpj:{
        type: DataTypes.STRING,
        required: true
    }
}, {
    tableName: 'tag',
    timestamps: false
})

module.exports = Paciente