//requerer a biblioteca router do express
const route = require('express').Router()

const { validationResult } = require('express-validator')
//requerer o controller no UserController

const PacienteController = require('../controlers/pacienteController')
//requerer as validacoes
const {registerValidationRules, validate} = require('../helpers/pacienteValidator')

//rotas
//register
route.post('/register',registerValidationRules(), validate, PacienteController.register)

//listar todos
route.get('/', PacienteController.listAll)

module.exports = route