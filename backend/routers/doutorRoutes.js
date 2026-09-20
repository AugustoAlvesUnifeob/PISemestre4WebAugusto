// Express Router 
const route = require('express').Router()
const { validationResult } = require('express-validator')

//requerer o controller no DoutorController
const DoutorController = require('../controlers/doutorController')
//requerer as validacoes
const {registerValidationRules, validate} = require('../helpers/doutorValidator')
//requerer a validação do token
const verifyToken = require('../helpers/verify-token.js')

//rotas
//register
route.post('/register', verifyToken, registerValidationRules(), validate, DoutorController.register)

route.post('/update/:iddoutor', verifyToken, DoutorController.update);

route.post('/delete/:iddoutor', verifyToken, DoutorController.delete);

//listar todos
route.get('/', verifyToken, DoutorController.listAll)

route.get('/listarByCNPJ', verifyToken, DoutorController.listarByCNPJ)

module.exports = route