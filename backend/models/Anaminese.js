//requerer somente o metodo datatypes do sequelize
const {DataTypes} = require('sequelize')
//requerer a conexão
const conn = require('../db/conn.js')

//definir o model user
const Anaminese = conn.define('anaminese',{
    idanaminese: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    queixas:{
        type: DataTypes.STRING,
    },
    historicoatual:{
        type: DataTypes.STRING,
    },
    doencaspreexistentes:{
        type: DataTypes.STRING,
    },
    medicamentos:{
        type: DataTypes.STRING,
    },
    alergias:{
        type: DataTypes.STRING,
    },
    cirurgiasanteriores:{
        type: DataTypes.STRING,
    },
    historicofamiliar:{
        type: DataTypes.STRING,
    },
    pacientes_idpacientes:{
        type: DataTypes.INTEGER,
        required: true
    }
}, {
    tableName: 'anaminese',
    timestamps: false
})

module.exports = Anaminese