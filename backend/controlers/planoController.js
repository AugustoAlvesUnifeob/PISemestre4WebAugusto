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

    static async update(req, res){
        const {idplano} = req.params //id do plano na url
        const {descricao, aplicadesconto, valordesconto, exonera, clinica_cnpj} = req.body

        //atualizar plano
        try{
            //procurar plano pelo id
            const Exists = await Plano.findByPk(idplano)
            if(!Exists){
                return res.status(404).json({message: "Plano não encontrado"})
            }

            await Plano.update(
                {
                    descricao: descricao,
                    aplicadesconto: aplicadesconto,
                    valordesconto: valordesconto,
                    exonera: exonera,
                    clinica_cnpj: clinica_cnpj
                },
                {
                    where: {idplano: idplano}
                }
            )
            res.status(200).json({message:'Plano alterado com sucesso'})
        }catch(error){
            res.status(500).json({message: error})
        }
    }

    static async delete(req, res){
        const {idplano} = req.params //id do plano na url
        try{
            await Plano.destroy({
                where: {idplano: idplano}
            })
            res.status(200).json({message:'Plano deletado com sucesso'})
        }
        catch(error){
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

    static async listarByCNPJ(req, res){
        const clinica_cnpj = req.user.clinica_cnpj

        try{
            const planos = await Plano.findAll({where: {clinica_cnpj}})
            res.status(200).json({planos})
        }
        catch(error){
            res.status(500).json({message: error.message})
        }
    }
}