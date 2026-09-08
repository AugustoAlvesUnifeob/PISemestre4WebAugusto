//requerer a biblioteca router do express
const route = require('express').Router()

const { validationResult } = require('express-validator')
//requerer o controller no UserController
const UserController = require('../controlers/userController')
//requerer as validacoes
const {registerValidationRules, validate} = require('../helpers/userValidator')

//rotas
//register
route.post('/register',registerValidationRules(), validate, UserController.register)

//login
route.post('/login', UserController.login);

//listar todos
route.get('/', UserController.listAll)

module.exports = route