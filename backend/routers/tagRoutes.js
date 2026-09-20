// Express Router 
const route = require('express').Router()
const { validationResult } = require('express-validator')

//requerer o controller no tagController
const tagController = require('../controlers/tagController')
//requerer as validacoes
const {registerValidationRules, validate} = require('../helpers/tagValidator')
//requerer a validação do token
const verifyToken = require('../helpers/verify-token.js')

//rotas
//register
route.post('/register', verifyToken, registerValidationRules(), validate, tagController.register)

route.post('/update/:idtag', verifyToken, tagController.update)

route.post('/delete/:idtag', verifyToken, tagController.delete)

//listar todos
route.get('/', verifyToken, tagController.listAll)

route.get('/listarByCNPJ', verifyToken, tagController.listarByCNPJ)

module.exports = route