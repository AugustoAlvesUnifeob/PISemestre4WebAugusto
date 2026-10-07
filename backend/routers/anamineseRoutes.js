// Express Router 
const route = require('express').Router()

//requerer o controller no tagController
const anamineseController = require('../controlers/anamineseController')

//requerer a validação do token
const verifyToken = require('../helpers/verify-token.js')

//rotas
//register
route.post('/register', verifyToken, anamineseController.register)

route.post('/update/:idanaminese', verifyToken, anamineseController.update)

route.post('/delete/:idanaminese', verifyToken, anamineseController.delete)

//listar todos
route.get('/', verifyToken, anamineseController.listAll)

route.get('/paciente/:pacientes_idpacientes', verifyToken, anamineseController.listarPorPaciente)

route.get('/listarByCNPJ', verifyToken, anamineseController.listarByCNPJ)

route.get('/:idanaminese', verifyToken, anamineseController.listarOne)

module.exports = route