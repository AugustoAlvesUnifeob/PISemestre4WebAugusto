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
        const { id } = req.params

        try{
            const tag = await Tagpaciente.findByPk(id)
            if(!tag) return res.status(404).json({message: 'Tag de paciente não cadastrada'})
            return res.status(200).json({tag})
        }
        catch(error){
            return res.status(500).json({message: error.message})
        }
    }

    static async listarPaciente(req, res){
        const { pacientes_idpacientes } = req.params

        try{
            const tags = await Tagpaciente.findAll({where: { pacientes_idpacientes }})
            return res.status(200).json({tags})
        }
        catch(error){
            return res.status(500).json({message: error.message})
        }
    }
}