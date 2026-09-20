const {body,validationResult} = require('express-validator')

// validando o doutor
const registerValidationRules = ()=>{
    return [
        body('nome').notEmpty().withMessage('O nome é obrigatorio'),
        body('especialidade').notEmpty().withMessage("Obrigatório Definir"),
        body('documento').notEmpty().withMessage('O documento é obrigatório')
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