//requerer a biblioteca router do express
const route = require('express').Router()

const { validationResult } = require('express-validator')
//requerer o controller no UserController
const UserController = require('../controlers/userController')
//requerer as validacoes
const {registerValidationRules, validate} = require('../helpers/userValidator')
//requerer a validação do token
const verifyToken = require('../helpers/verify-token.js')

//rotas
//register
route.post('/register',registerValidationRules(), validate, UserController.register)

//login
route.post('/login', UserController.login);

route.post('/update/:idusuario', verifyToken, UserController.update);

route.post('/delete/:idusuario', verifyToken, UserController.delete);

//listar todos
route.get('/', verifyToken, UserController.listAll)

route.get('/listarByCNPJ', verifyToken, UserController.listarByCNPJ)

module.exports = route