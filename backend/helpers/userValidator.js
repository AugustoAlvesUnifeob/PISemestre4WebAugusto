///requerer as bibliotecas do validator
const {body,validationResult} = require('express-validator')

//validações
const registerValidationRules = ()=>{
    return [
        body('usuario').notEmpty().withMessage('O nome é obrigatorio'),    
        body('email').notEmpty().withMessage('O email é obrigatorio e deve ser válido'),
        body('senha').notEmpty().withMessage('A senha é obrigatoria'),
    ]
}

const adminRegisterValidationRules = () => [
    ...registerValidationRules(),
    body('email').isEmail().withMessage('Informe um e-mail válido'),
    body('tipo').isInt({ min: 0, max: 1 }).withMessage('Tipo de usuário inválido'),
]

//regras do usuário master criado junto com a clínica (o tipo é definido no back).
const masterRegisterValidationRules = () => [
    ...registerValidationRules(),
    body('email').isEmail().withMessage('Informe um e-mail válido'),
]

//validação
const validate = (req, res, next) => {
    const erros = validationResult(req)
    if(erros.isEmpty()){
        return next()
    }
    //retornar o primeiro erro encontrado
    return res.status(422).json({message: erros.array()[0].msg})
}

module.exports = {
    registerValidationRules,
    adminRegisterValidationRules,
    masterRegisterValidationRules,
    validate
}