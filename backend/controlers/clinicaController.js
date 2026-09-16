//requerer o model do usuario
const Clinica = require('../models/Clinica')

module.exports = class ClinicaController{
    static async register(req, res){
        const {cnpj, nome} = req.body

        //criar novo usuario
        try{
            await Clinica.create({
                cnpj: cnpj,
                nome: nome
            })
            res.status(200).json({message:'Clinica Cadastrada com sucesso'})
        }catch(error){
            res.status(500).json({message: error})
        }
    }

    static async update(req, res){
        const {cnpj} = req.params //id do Clinica na url
        const {nome} = req.body

        //atualizar Clinica
        try{
            //procurar Clinica pelo id
            const Exists = await Clinica.findByPk(cnpj)
            if(!Exists){
                return res.status(404).json({message: "Clinica não encontrado"})
            }

            await Clinica.update(
                {
                    nome: nome
                },
                {
                    where: {cnpj: cnpj}
                }
            )
            res.status(200).json({message:'Clinica alterado com sucesso'})
        }catch(error){
            res.status(500).json({message: error})
        }
    }

    //metodo para listar todos os usuarios
    static async listAll(req, res){
        try{
            const clinicas = await Clinica.findAll()
            res.status(200).json({clinicas: clinicas})
        }
        catch(error){
            res.status(500).json({error: error})
        }
    }
}