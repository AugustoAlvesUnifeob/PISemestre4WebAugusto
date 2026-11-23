require('dotenv').config()
//requerer a biblioteca jwt
const jwt = require('jsonwebtoken')
//requerer o metodo parar recuperar o token
const getToken = require('./get-token.js')

const User = require('../models/Users')
//criar metodo para verificar o token
const checkToken = async (req, res, next)=>{
    //1-caso o cabeçalho esteja vazio
    if(!req.headers.authorization){
        return res.status(401).json({message: 'Acesso negado'})
    }

    //recuperar o token
    const token = getToken(req)

    //2-caso o token seja inexistente
    if(!token){
        return res.status(401).json({message: 'Acesso negado'})
    }

    //3-verificar validade do token
    try{
        const verified = jwt.verify(token, process.env.CHAVETOKEN)

// Verificar se o usuário ainda existe no banco
const usuarioAtual = await User.findByPk(verified.idusuario)

if (!usuarioAtual) {
    return res.status(401).json({
        message: 'Usuário não encontrado'
    })
}

// Utilizar os dados atuais do banco
req.user = {
    idusuario: usuarioAtual.idusuario,
    usuario: usuarioAtual.usuario,
    tipo: Number(usuarioAtual.tipo),
    clinica_cnpj: usuarioAtual.clinica_cnpj
}

next()

    }
    catch(error){
        return res.status(401).json({message: 'Acesso negado'})
    }
}

module.exports = checkToken