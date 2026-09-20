// Express Router 
const route = require('express').Router()
const { validationResult } = require('express-validator')

//requerer o controller no planorController
const planoController = require('../controlers/planoController')
//requerer as validacoes
const {registerValidationRules, validate} = require('../helpers/planoValidator')
//requerer a validação do token
const verifyToken = require('../helpers/verify-token.js')

//rotas
//register
route.post('/register', verifyToken, registerValidationRules(), validate, planoController.register)

route.post('/update/:idplano', verifyToken, planoController.update);

route.post('/delete/:idplano', verifyToken, planoController.delete);

//listar todos
route.get('/', verifyToken, planoController.listAll)

route.get('/listarByCNPJ', verifyToken, planoController.listarByCNPJ)

module.exports = route