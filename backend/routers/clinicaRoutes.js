//requerer a biblioteca router do express
const route = require('express').Router()

const { validationResult } = require('express-validator')
//requerer o controller no UserController
const ClinicaController = require('../controlers/clinicaController')
//requerer as validacoes
const {registerValidationRules, validate} = require('../helpers/clinicaValidator')

//rotas
//register
route.post('/register',registerValidationRules(), validate, ClinicaController.register)

//listar todos
route.get('/', ClinicaController.listAll)

module.exports = route