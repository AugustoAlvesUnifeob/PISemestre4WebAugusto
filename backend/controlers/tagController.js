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

    static async update(req, res){
        const {idtag} = req.params //id do tag na url
        const {descricao, clinica_cnpj} = req.body

        //atualizar tag
        try{
            //procurar tag pelo id
            const Exists = await Tag.findByPk(idtag)
            if(!Exists){
                return res.status(404).json({message: "Tag não encontrado"})
            }

            await Tag.update(
                {
                    descricao: descricao,
                    clinica_cnpj: clinica_cnpj
                },
                {
                    where: {idtag: idtag}
                }
            )
            res.status(200).json({message:'Tag alterado com sucesso'})
        }catch(error){
            res.status(500).json({message: error})
        }
    }

    static async delete(req, res){
        const {idtag} = req.params //id do tag na url
        try{
            await Tag.destroy({
                where: {idtag: idtag}
            })
            res.status(200).json({message:'Tag deletado com sucesso'})
        }
        catch(error){
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

    static async listarByCNPJ(req, res){
        const clinica_cnpj = req.user.clinica_cnpj

        try{
            const tags = await Tag.findAll({where: {clinica_cnpj}})
            res.status(200).json({tags})
        }
        catch(error){
            res.status(500).json({message: error.message})
        }
    }
}