///requerer as bibliotecas do validator
const {body,validationResult} = require('express-validator')

//validações
const registerValidationRules = ()=>{
    return [
        body('cnpj').notEmpty().withMessage('O CNPJ é obrigatorio'),
        body('cnpj').isLength({min: 14, max: 14}).withMessage('O CNPJ deve ter 14 caracteres'),
        body('nome').notEmpty().withMessage('O nome é obrigatorio'),
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