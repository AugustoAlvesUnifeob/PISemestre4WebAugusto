// Express Router 
const route = require('express').Router()
const { validationResult } = require('express-validator')

//requerer o controller no planorController
const planoController = require('../controlers/planoController')
//requerer as validacoes
const {registerValidationRules, validate} = require('../helpers/planoValidator')

//rotas
//register
route.post('/register',registerValidationRules(), validate, planoController.register)

route.post('/update/:idplano', planoController.update);

route.post('/delete/:idplano', planoController.delete);

//listar todos
route.get('/', planoController.listAll)

module.exports = route