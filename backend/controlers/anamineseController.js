//requerer o model da Anaminese
const Anaminese = require('../models/Anaminese')
const Paciente = require('../models/Paciente')

module.exports = class anamineseController{
    static async register(req, res){
        const {queixas, historicoatual, doencaspreexistentes, medicamentos, alergias, cirurgiasanteriores, historicofamiliar, pacientes_idpacientes} = req.body

        try{
            const paciente = await Paciente.findOne({
                where: {
                    idpacientes: pacientes_idpacientes,
                    clinica_cnpj: req.user.clinica_cnpj
                }
            })
            if(!paciente){
                return res.status(404).json({message: 'Paciente não encontrado'})
            }

            await Anaminese.create({
                queixas: queixas,
                historicoatual: historicoatual,
                doencaspreexistentes: doencaspreexistentes,
                medicamentos: medicamentos,
                alergias: alergias,
                cirurgiasanteriores: cirurgiasanteriores,
                historicofamiliar: historicofamiliar,
                pacientes_idpacientes: pacientes_idpacientes
            })
            res.status(200).json({message:'Anaminese Cadastrada com sucesso'})
        }catch(error){
            res.status(500).json({message: error})
        }
    }

    static async update(req, res){
        const {idanaminese} = req.params
        const {queixas, historicoatual, doencaspreexistentes, medicamentos, alergias, cirurgiasanteriores, historicofamiliar} = req.body

        try{
            const anaminese = await Anaminese.findByPk(idanaminese)
            if(!anaminese){
                return res.status(404).json({message: "Anaminese não encontrado"})
            }

            const paciente = await Paciente.findOne({
                where: {
                    idpacientes: anaminese.pacientes_idpacientes,
                    clinica_cnpj: req.user.clinica_cnpj
                }
            })
            if(!paciente){
                return res.status(404).json({message: 'Anamnese não encontrada'})
            }

            await anaminese.update({
                queixas,
                historicoatual,
                doencaspreexistentes,
                medicamentos,
                alergias,
                cirurgiasanteriores,
                historicofamiliar
            })
            res.status(200).json({message:'Anaminese alterado com sucesso'})
        }catch(error){
            res.status(500).json({message: error.message})
        }
    }

    static async delete(req, res){
        const {idanaminese} = req.params //id do Anaminese na url
        try{
            await Anaminese.destroy({
                where: {idanaminese: idanaminese}
            })
            res.status(200).json({message:'Anaminese deletada com sucesso'})
        }
        catch(error){
            res.status(500).json({message: error})
        }
    }

    //metodo para listar todas as Anamineses (provavelmente n vai usar)
    static async listAll(req, res){
        try{
            const anamineses = await Anaminese.findAll()
            res.status(200).json({anamineses: anamineses})
        }
        catch(error){
            res.status(500).json({error: error})
        }
    }

    static async listarByCNPJ(req, res){
        const clinica_cnpj = req.user.clinica_cnpj

        try{
            const anamineses = await Anaminese.findAll({where: {clinica_cnpj}})
            res.status(200).json({anamineses})
        }
        catch(error){
            res.status(500).json({message: error.message})
        }
    }

    static async listarPorPaciente(req, res){
        const {pacientes_idpacientes} = req.params

        try{
            const paciente = await Paciente.findOne({
                where: {
                    idpacientes: pacientes_idpacientes,
                    clinica_cnpj: req.user.clinica_cnpj
                }
            })
            if(!paciente){
                return res.status(404).json({message: 'Paciente não encontrado'})
            }

            const anaminese = await Anaminese.findOne({
                where: {pacientes_idpacientes}
            })
            return res.status(200).json({anaminese})
        }
        catch(error){
            return res.status(500).json({message: error.message})
        }
    }

    static async listarOne(req, res){
        const {idanaminese} = req.params

        try{
            const anaminese = await Anaminese.findByPk(idanaminese)
            if(!anaminese){
                return res.status(404).json({message: 'Anamnese não cadastrada'})
            }
            return res.status(200).json({anaminese})
        }
        catch(error){
            return res.status(500).json({message: error.message})
        }
    }
}