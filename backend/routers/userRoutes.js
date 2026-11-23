//requerer a biblioteca router do express
const route = require('express').Router()

//requerer o controller no UserController
const UserController = require('../controlers/userController')

//requerer as validacoes
const {adminRegisterValidationRules,editUserValidationRules,adminEditUserValidationRules,validate} = require('../helpers/userValidator')
// const {registerValidationRules, adminRegisterValidationRules, validate} = require('../helpers/userValidator')

//requerer a validação do token
const verifyToken = require('../helpers/verify-token.js')
const verifyAdmin = require('../helpers/verify-admin.js')

//rotas
//register
//route.post('/register',registerValidationRules(), validate, UserController.register)

route.post(
    '/register-user',
    verifyToken,
    verifyAdmin,
    adminRegisterValidationRules(),
    validate,
    UserController.registerForClinic
)

//login
route.post('/login', UserController.login);

//editar o próprio perfil
route.post('/update/:idusuario', verifyToken, editUserValidationRules(), validate, UserController.update);

//administrador editar outro usuário
route.post('/admin/update/:idusuario', verifyToken, verifyAdmin, adminEditUserValidationRules(), validate, UserController.adminUpdate);

route.post('/delete/:idusuario', verifyToken, verifyAdmin, UserController.delete);

//listar todos
route.get('/', verifyToken, verifyAdmin, UserController.listAll)

route.get('/listarByCNPJ', verifyToken, verifyAdmin, UserController.listarByCNPJ)

route.get('/:idusuario', verifyToken, UserController.listarOne)

module.exports = route