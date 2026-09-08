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