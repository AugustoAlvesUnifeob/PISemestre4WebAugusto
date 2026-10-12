//requerer o model do plano
const Plano = require('../models/Plano')

function toTinyInt(value){
    if(value === true || value === 1 || value === '1' || value === 'true') return 1
    if(value === false || value === 0 || value === '0' || value === 'false') return 0
    return null
}

module.exports = class PlanoController{
    static async register(req, res){
        const {descricao, aplicadesconto, valordesconto, exonera} = req.body
        const clinica_cnpj = req.user.clinica_cnpj
        const aplicaDescontoInt = toTinyInt(aplicadesconto)
        const exoneraInt = toTinyInt(exonera)

        if(aplicaDescontoInt === null || exoneraInt === null){
            return res.status(400).json({message: 'Desconto e exoneração devem ser Sim ou Não'})
        }

        //criar novo plano
        try{
            await Plano.create({
                descricao: descricao,
                aplicadesconto: aplicaDescontoInt,
                valordesconto: valordesconto,
                exonera: exoneraInt,
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
        const aplicaDescontoInt = toTinyInt(aplicadesconto)
        const exoneraInt = toTinyInt(exonera)

        if(aplicaDescontoInt === null || exoneraInt === null){
            return res.status(400).json({message: 'Desconto e exoneração devem ser Sim ou Não'})
        }

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
                    aplicadesconto: aplicaDescontoInt,
                    valordesconto: valordesconto,
                    exonera: exoneraInt,
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

    static async listarOne(req, res){
        const idplano = req.params

        try{
            const Planos = await Plano.findOne({where: idplano})
            if(!Planos){
                Planos = "Plano não cadastrado"
            }
        }
        catch(error){
            res.status(500).json({error: error})
        }
    }
}