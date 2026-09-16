// Express Router 
const route = require('express').Router()
const { validationResult } = require('express-validator')

//requerer o controller no tagController
const tagController = require('../controlers/tagController')
//requerer as validacoes
const {registerValidationRules, validate} = require('../helpers/tagValidator')

//rotas
//register
route.post('/register',registerValidationRules(), validate, tagController.register)

route.post('/update/:idtag', tagController.update);

route.post('/delete/:idtag', tagController.delete);

//listar todos
route.get('/', tagController.listAll)

module.exports = route