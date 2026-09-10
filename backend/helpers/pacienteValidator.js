const {body,validationResult} = require('express-validator')

// validando o usuário
const registerValidationRules = ()=>{
    return [
        body('nome').notEmpty().withMessage('O nome é obrigatório'),
        body('cpf').notEmpty().withMessage('O CPF é obrigatório.'),
        body('cpf').isLength({min:11, max:11}).withMessage('O CPF deve ter 11 dígitos'),
        body('email').notEmpty().withMessage('O e-mail é obrigatório'),
        body('email').isEmail(),
    ]
}


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
    validate
}