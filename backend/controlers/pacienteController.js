//requerer o model do paciente
const Paciente = require('../models/Paciente')

module.exports = class PacienteController{
    static async register(req, res){
        const {nome, cpf, telefone, email, complemento, tag_idtag, plano_idplano, clinica_cnpj} = req.body

        //criar novo paciente
        try{
            await Paciente.create({
                nome: nome,
                cpf: cpf,
                telefone: telefone,
                email: email,
                complemento: complemento,
                tag_idtag: tag_idtag,
                plano_idplano: plano_idplano,
                clinica_cnpj: clinica_cnpj
            })
            res.status(200).json({message:'Paciente Cadastrado com sucesso'})
        }catch(error){
            res.status(500).json({message: error})
        }
    }

    static async update(req, res){
        const {idpaciente} = req.params //id do paciente na url
        const {nome, cpf, telefone, email, complemento, tag_idtag, plano_idplano, clinica_cnpj} = req.body

        //atualizar paciente
        try{
            //procurar paciente pelo id
            const Exists = await Paciente.findByPk(idpaciente)
            if(!Exists){
                return res.status(404).json({message: "Paciente não encontrado"})
            }

            await Paciente.update(
                {
                    nome: nome,
                    cpf: cpf,
                    telefone: telefone,
                    email: email,
                    complemento: complemento,
                    tag_idtag: tag_idtag,
                    plano_idplano: plano_idplano,
                    clinica_cnpj: clinica_cnpj,
                },
                {
                    where: {idpaciente: idpaciente}
                }
            )
            res.status(200).json({message:'Paciente alterado com sucesso'})
        }catch(error){
            res.status(500).json({message: error})
        }
    }

    static async delete(req, res){
        const {idpaciente} = req.params //id do paciente na url
        try{
            await Paciente.destroy({
                where: {idpaciente: idpaciente}
            })
            res.status(200).json({message:'Paciente deletado com sucesso'})
        }
        catch(error){
            res.status(500).json({message: error})
        }
    }

    //metodo para listar todos os pacientes
    static async listAll(req, res){
        try{
            const pacientes = await Paciente.findAll()
            res.status(200).json({pacientes: pacientes})
        }
        catch(error){
            res.status(500).json({error: error})
        }
    }
}