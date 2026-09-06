//requere o express
const express = require('express')
//instacia do express
const api = express()
//require cors
const cors = require('cors')
//requerer a conexão
const conn = require('./db/conn.js')
//requerer os Models
const User = require('./models/Users.js')
const Clinica = require('./models/Clinica.js')
const Tag = require('./models/Tag.js')
const Plano = require('./models/Plano.js')
const Paciente = require('./models/Paciente.js')
const Doutor = require('./models/Doutor.js')
const Agenda = require('./models/Agenda.js')
//requer a rotas ros usuarios (user)
const userRoutes = require('./routers/userRoutes.js')
const clinicaRoutes = require('./routers/clinicaRoutes.js')

//configurando JSON response
api.use(express.json())

//salve cors
//api.use(cors({credentials: true, origin: 'http://localhost:5000'}))
api.use(cors())

api.use('/users',userRoutes)
api.use('/clinicas', clinicaRoutes)

//start api
conn.sync()
    .then(()=>{api.listen(5000)})
    .catch(error=>{console.info(error)})
