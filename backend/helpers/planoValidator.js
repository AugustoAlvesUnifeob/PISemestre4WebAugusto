const {body,validationResult} = require('express-validator')

// validando o doutor
const registerValidationRules = ()=>{
    return [
        body('descricao').notEmpty().withMessage('O nome é obrigatorio'),
        body('aplicadesconto').notEmpty().withMessage('O nome é obrigatorio'),
        body('exonera').notEmpty().withMessage('O nome é obrigatorio'),
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