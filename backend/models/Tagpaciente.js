//requerer somente o metodo datatypes do sequelize
const {DataTypes} = require('sequelize')
//requerer a conexão
const conn = require('../db/conn.js')

//definir o model tagpaciente
const Tagpaciente = conn.define('tagpaciente',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tag_idtag:{
        type: DataTypes.INTEGER,
        required: true
    },
    pacientes_idpacientes:{
        type: DataTypes.INTEGER,
        required: true
    }
}, {
    tableName: 'tagpaciente',
    timestamps: false
})

module.exports = Tagpaciente