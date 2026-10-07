// Express Router 
const route = require('express').Router()
//const { validationResult } = require('express-validator')

//requerer o controller no tagController
const tagpacienteController = require('../controlers/tagpacienteController')
//requerer as validacoes
//const {registerValidationRules, validate} = require('../helpers/tagValidator')
//requerer a validação do token
const verifyToken = require('../helpers/verify-token.js')

//rotas
//register
route.post('/register', verifyToken, tagpacienteController.register)

route.post('/delete/:id', verifyToken, tagpacienteController.delete)

//listar todos
route.get('/', verifyToken, tagpacienteController.listAll)

route.get('/:id', verifyToken, tagpacienteController.listarOne)

route.get('/:pacientes_idpacientes', verifyToken, tagpacienteController.listarPaciente)

module.exports = route