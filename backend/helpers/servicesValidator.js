const {body,validationResult} = require('express-validator')

const registerValidationRules = ()=>{
    return [
        body('nome').notEmpty().withMessage('O nome é obrigatório'),
        body('nome').isLength({max: 45}).withMessage('O nome deve ter no máximo 45 caracteres'),
        body('preco').notEmpty().withMessage('O preço é obrigatório'),
        body('preco').isFloat({min: 0}).withMessage('O preço deve ser um número maior ou igual a zero'),
    ]
}

const updateValidationRules = ()=>{
    return [
        body('nome').notEmpty().withMessage('O nome é obrigatório'),
        body('nome').isLength({max: 45}).withMessage('O nome deve ter no máximo 45 caracteres'),
        body('preco').notEmpty().withMessage('O preço é obrigatório'),
        body('preco').isFloat({min: 0}).withMessage('O preço deve ser um número maior ou igual a zero'),
    ]
}

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
    updateValidationRules,
    validate
}
