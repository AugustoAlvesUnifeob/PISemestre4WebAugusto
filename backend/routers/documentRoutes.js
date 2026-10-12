const route = require('express').Router()
const DocumentController = require('../controlers/documentController')
const verifyToken = require('../helpers/verify-token.js')

route.post('/receita', verifyToken, DocumentController.gerarReceita)
route.post('/atestado', verifyToken, DocumentController.gerarAtestado)
route.post('/laudo', verifyToken, DocumentController.gerarLaudo)

module.exports = route
