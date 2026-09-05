//requerer somente o metodo datatypes do sequelize
const {DataTypes} = require('sequelize')
//requerer a conexão
const conn = require('../db/conn.js')

//definir o model user
const Agenda = conn.define('agenda',{
    idagenda: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    datahora:{
        type: DataTypes.DATE,
        required: true
    },
    doutor_iddoutor:{
        type: DataTypes.STRING,
        required: true
    },
    pacientes_idpacientes:{
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

module.exports = Agenda