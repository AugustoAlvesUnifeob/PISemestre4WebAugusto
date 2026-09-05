//requerer o model do plano
const Plano = require('../models/Plano')

module.exports = class PlanoController{
    static async register(req, res){
        const {descricao, aplicadesconto, valordesconto, exonera, clinica_cnpj} = req.body

        //criar novo plano
        try{
            await Plano.create({
                descricao: descricao,
                aplicadesconto: aplicadesconto,
                valordesconto: valordesconto,
                exonera: exonera,
                clinica_cnpj: clinica_cnpj
            })
            res.status(200).json({message:'Plano Cadastrado com sucesso'})
        }catch(error){
            res.status(500).json({message: error})
        }
    }

    //metodo para listar todos os planos
    static async listAll(req, res){
        try{
            const planos = await Plano.findAll()
            res.status(200).json({planos: planos})
        }
        catch(error){
            res.status(500).json({error: error})
        }
    }
}