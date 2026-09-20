//requerer o model do doutor
const Doutor = require('../models/Doutor')

module.exports = class DoutorController{
    static async register(req, res){
        const {nome, especialidade, documento} = req.body
        const clinica_cnpj = req.user.clinica_cnpj

        if (!clinica_cnpj) {
            return res.status(401).json({message: 'Clínica não identificada no token'})
        }

        //criar novo doutor
        try{
            await Doutor.create({
                nome: nome,
                especialidade: especialidade,
                clinica_cnpj: clinica_cnpj,
                documento: documento,
            })
            res.status(200).json({message:'Doutor(a) Cadastrado com sucesso'})
        }catch(error){
            res.status(500).json({message: error.message})
        }
    }

    static async update(req, res){
        const {iddoutor} = req.params //id do doutor na url
        const {nome, especialidade, clinica_cnpj, documento} = req.body

        //atualizar doutor
        try{
            //procurar doutor pelo id
            const Exists = await Doutor.findByPk(iddoutor)
            if(!Exists){
                return res.status(404).json({message: "Doutor não encontrado"})
            }

            await Doutor.update(
                {
                    nome: nome,
                    especialidade: especialidade,
                    clinica_cnpj: clinica_cnpj,
                    documento: documento
                },
                {
                    where: {iddoutor: iddoutor}
                }
            )
            res.status(200).json({message:'Doutor alterado com sucesso'})
        }catch(error){
            res.status(500).json({message: error})
        }
    }

    static async delete(req, res){
        const {iddoutor} = req.params //id do doutor na url
        try{
            await Doutor.destroy({
                where: {iddoutor: iddoutor}
            })
            res.status(200).json({message:'Doutor deletado com sucesso'})
        }
        catch(error){
            res.status(500).json({message: error})
        }
    }

    //metodo para listar todos os doutores
    static async listAll(req, res){
        try{
            const doutores = await Doutor.findAll({
                where: {clinica_cnpj: req.user.clinica_cnpj}
            })
            res.status(200).json({doutores: doutores})
        }
        catch(error){
            res.status(500).json({error: error})
        }
    }

    static async listarByCNPJ(req, res){
        const clinica_cnpj = req.user.clinica_cnpj

        try{
            const doutores = await Doutor.findAll({where: {clinica_cnpj}})
            res.status(200).json({doutores})
        }
        catch(error){
            res.status(500).json({message: error.message})
        }
    }
}