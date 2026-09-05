//requerer o model do doutor
const Doutor = require('../models/Doutor')

module.exports = class DoutorController{
    static async register(req, res){
        const {nome, especialidade, clinica_cnpj} = req.body

        //criar novo doutor
        try{
            await Doutor.create({
                nome: nome,
                especialidade: especialidade,
                clinica_cnpj: clinica_cnpj
            })
            res.status(200).json({message:'Doutor(a) Cadastrado com sucesso'})
        }catch(error){
            res.status(500).json({message: error})
        }
    }

    //metodo para listar todos os doutores
    static async listAll(req, res){
        try{
            const doutores = await Doutor.findAll()
            res.status(200).json({doutores: doutores})
        }
        catch(error){
            res.status(500).json({error: error})
        }
    }
}