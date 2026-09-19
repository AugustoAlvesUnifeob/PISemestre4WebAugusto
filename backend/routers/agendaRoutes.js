const route = require('express').Router()
const AgendaController = require('../controlers/agendaController')

route.get('/', AgendaController.listAll)
route.post('/', AgendaController.register)

module.exports = route
