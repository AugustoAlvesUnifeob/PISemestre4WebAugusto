//requerer o model da tag
const Tag = require('../models/Tag')

module.exports = class TagController{
    static async register(req, res){
        const {descricao, clinica_cnpj} = req.body

        //criar nova tag
        try{
            await Tag.create({
                descricao: descricao,
                clinica_cnpj: clinica_cnpj
            })
            res.status(200).json({message:'Tag Cadastrada com sucesso'})
        }catch(error){
            res.status(500).json({message: error})
        }
    }

    //metodo para listar todas as tags
    static async listAll(req, res){
        try{
            const tags = await Tag.findAll()
            res.status(200).json({tags: tags})
        }
        catch(error){
            res.status(500).json({error: error})
        }
    }
}