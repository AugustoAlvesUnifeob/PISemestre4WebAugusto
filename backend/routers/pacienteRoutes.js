//requerer a biblioteca router do express
const route = require('express').Router()

const { validationResult } = require('express-validator')
//requerer o controller no UserController

const PacienteController = require('../controlers/pacienteController')
//requerer as validacoes
const {registerValidationRules, validate} = require('../helpers/pacienteValidator')
//requerer a validação do token
const verifyToken = require('../helpers/verify-token.js')

//rotas
//register
route.post('/register', verifyToken, registerValidationRules(), validate, PacienteController.register)

route.post('/update/:idpaciente', verifyToken, PacienteController.update);

route.post('/delete/:idpaciente', verifyToken, PacienteController.delete);

//listar todos
route.get('/', verifyToken, PacienteController.listAll)

route.get('/listarByCNPJ', verifyToken, PacienteController.listarByCNPJ)

module.exports = route