const route = require('express').Router()
const AgendaController = require('../controlers/agendaController')
const verifyToken = require('../helpers/verify-token.js')

route.get('/', AgendaController.listAll)
route.post('/', AgendaController.register)
route.delete('/delete/:idagenda', verifyToken, AgendaController.delete)

module.exports = route
