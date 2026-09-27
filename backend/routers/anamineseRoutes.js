// Express Router 
const route = require('express').Router()

//requerer o controller no tagController
const anamineseController = require('../controlers/anamineseController')

//requerer a validação do token
const verifyToken = require('../helpers/verify-token.js')

//rotas
//register
route.post('/register', verifyToken, anamineseController.register)

route.post('/update/:idtag', verifyToken, anamineseController.update)

route.post('/delete/:idtag', verifyToken, anamineseController.delete)

//listar todos
route.get('/', verifyToken, anamineseController.listAll)

route.get('/:idtag', verifyToken, anamineseController.listarOne)

route.get('/listarByCNPJ', verifyToken, anamineseController.listarByCNPJ)

module.exports = route