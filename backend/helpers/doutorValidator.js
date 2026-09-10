const {body,validationResult} = require('express-validator')

// validando o doutor
const registerValidationRules = ()=>{
    return [
        body('cnpj').notEmpty().withMessage('O CRO/CNPJ/CRM é obrigatorio'),
        // body('cnpj').isLength({min: 14, max: 14}).withMessage('O documento deve ter 14 caracteres'),
        // ^ Comentei pois, como há diferentes documentos para se registrar um Dr., precisamos ver se vamos fazer todos eles ou arrumar um jeito de identificar qual é pela quantidade de numeros ou algo assim
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