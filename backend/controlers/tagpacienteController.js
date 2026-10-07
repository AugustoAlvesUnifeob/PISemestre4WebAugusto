//requerer o model da tagpaciente
const Tagpaciente = require('../models/Tagpaciente')

module.exports = class TagpacienteController{
    static async register(req, res){
        const {tag_idtag, pacientes_idpacientes} = req.body

        //criar nova tagpaciente
        try{
            await Tagpaciente.create({
                tag_idtag: tag_idtag,
                pacientes_idpacientes: pacientes_idpacientes
            })
            res.status(200).json({message:'Tagpaciente Cadastrada com sucesso'})
        }catch(error){
            res.status(500).json({message: error})
        }
    }


    static async delete(req, res){
        const {id} = req.params //id do tagpaciente na url
        try{
            await Tagpaciente.destroy({
                where: {id: id}
            })
            res.status(200).json({message:'Tagpaciente deletado com sucesso'})
        }
        catch(error){
            res.status(500).json({message: error})
        }
    }

    //metodo para listar todas as tagpaciente
    static async listAll(req, res){
        try{
            const tags = await Tagpaciente.findAll()
            res.status(200).json({tags: tags})
        }
        catch(error){
            res.status(500).json({error: error})
        }
    }

    static async listarOne(req, res){
        const id = req.params

        try{
            const Tags = await Tagpaciente.findOne({where: id})
            if(!Tags){
                Tags = "Tagpaciente não cadastrado"
            }
        }
        catch(error){
            res.status(500).json({error: error})
        }
    }

    static async listarPaciente(req, res){
        const pacientes_idpacientes = req.params

        try{
            const Tags = await Tagpaciente.findAll({where: pacientes_idpacientes})
            if(!Tags){
                Tags = "Tagpaciente não cadastrado"
            }
        }
        catch(error){
            res.status(500).json({error: error})
        }
    }
}