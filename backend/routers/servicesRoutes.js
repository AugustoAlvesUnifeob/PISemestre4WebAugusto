// Express Router
const route = require('express').Router()

//requerer o controller dos serviços
const servicesController = require('../controlers/servicesController')
//requerer as validacoes
const {registerValidationRules, updateValidationRules, validate} = require('../helpers/servicesValidator')
//requerer a validação do token
const verifyToken = require('../helpers/verify-token.js')

//rotas
route.post('/register', verifyToken, registerValidationRules(), validate, servicesController.register)

route.post('/update/:idservico', verifyToken, updateValidationRules(), validate, servicesController.update)

route.post('/delete/:idservico', verifyToken, servicesController.delete)

//listar todos
route.get('/', verifyToken, servicesController.listAll)

route.get('/:idservico', verifyToken, servicesController.listarOne)

module.exports = route
