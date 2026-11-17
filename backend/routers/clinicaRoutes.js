//requerer a biblioteca router do express
const route = require('express').Router()

const {masterRegisterValidationRules} = require('../helpers/userValidator')

const { validationResult } = require('express-validator')
//requerer o controller no UserController
const ClinicaController = require('../controlers/clinicaController')
//requerer as validacoes
const {registerValidationRules, validate} = require('../helpers/clinicaValidator')

//rotas
//register
// route.post('/register',registerValidationRules(), validate, ClinicaController.register)

//register da clínica + usuário master numa única operação
route.post('/register-completo', registerValidationRules(), masterRegisterValidationRules(), validate, ClinicaController.registerCompleto)

route.post('/update/:idclinica', ClinicaController.update);

//listar todos
route.get('/', ClinicaController.listAll)

route.get('/:idclinica', ClinicaController.listarOne)

module.exports = route