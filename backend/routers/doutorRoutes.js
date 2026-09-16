// Express Router 
const route = require('express').Router()
const { validationResult } = require('express-validator')

//requerer o controller no DoutorController
const DoutorController = require('../controlers/doutorController')
//requerer as validacoes
const {registerValidationRules, validate} = require('../helpers/doutorValidator')

//rotas
//register
route.post('/register',registerValidationRules(), validate, DoutorController.register)

route.post('/update/:iddoutor', DoutorController.update);

route.post('/delete/:iddoutor', DoutorController.delete);

//listar todos
route.get('/', DoutorController.listAll)

module.exports = route