//requerer o model dos serviços
const Servicos = require('../models/Services')

module.exports = class ServicesController{
    static async register(req, res){
        const {nome, preco} = req.body
        const clinica_cnpj = req.user.clinica_cnpj

        if (!clinica_cnpj) {
            return res.status(401).json({message: 'Clínica não identificada no token'})
        }

        //criar novo serviço
        try{
            await Servicos.create({
                nome: nome,
                preco: preco,
                clinica_cnpj: clinica_cnpj
            })
            res.status(200).json({message:'Serviço Cadastrado com sucesso'})
        }catch(error){
            res.status(500).json({message: error.message})
        }
    }

    static async update(req, res){
        const {idservico} = req.params //id do serviço na url
        const {nome, preco} = req.body
        const clinica_cnpj = req.user.clinica_cnpj

        //atualizar serviço
        try{
            //procurar serviço pelo id e pela clínica
            const Exists = await Servicos.findOne({where: {idservico, clinica_cnpj}})
            if(!Exists){
                return res.status(404).json({message: "Serviço não encontrado"})
            }

            await Servicos.update(
                {
                    nome: nome,
                    preco: preco
                },
                {
                    where: {idservico: idservico, clinica_cnpj: clinica_cnpj}
                }
            )
            res.status(200).json({message:'Serviço alterado com sucesso'})
        }catch(error){
            res.status(500).json({message: error.message})
        }
    }

    static async delete(req, res){
        const {idservico} = req.params //id do serviço na url
        const clinica_cnpj = req.user.clinica_cnpj
        try{
            const deletados = await Servicos.destroy({
                where: {idservico: idservico, clinica_cnpj: clinica_cnpj}
            })
            if(!deletados){
                return res.status(404).json({message: "Serviço não encontrado"})
            }
            res.status(200).json({message:'Serviço deletado com sucesso'})
        }
        catch(error){
            res.status(500).json({message: error.message})
        }
    }

    //metodo para listar todos os serviços
    static async listAll(req, res){
        try{
            const servicos = await Servicos.findAll({
                where: {clinica_cnpj: req.user.clinica_cnpj}
            })
            res.status(200).json({servicos: servicos})
        }
        catch(error){
            res.status(500).json({error: error})
        }
    }

    static async listarOne(req, res){
        const {idservico} = req.params
        const clinica_cnpj = req.user.clinica_cnpj

        try{
            const servico = await Servicos.findOne({where: {idservico, clinica_cnpj}})
            if(!servico){
                return res.status(404).json({message: "Serviço não cadastrado"})
            }
            res.status(200).json({servico: servico})
        }
        catch(error){
            res.status(500).json({error: error})
        }
    }
}
