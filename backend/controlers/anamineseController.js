//requerer o model da Anaminese
const Anaminese = require('../models/Anaminese')

module.exports = class anamineseController{
    static async register(req, res){
        const {queixas, historicoatual, doencaspreexistentes, medicamentos, alergias, cirurgiasanteriores, historicofamiliar, pacientes_idpacientes} = req.body

        //criar nova Anaminese
        try{
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
        const {idanaminese} = req.params //id do Anaminese na url
        const {queixas, historicoatual, doencaspreexistentes, medicamentos, alergias, cirurgiasanteriores, historicofamiliar, pacientes_idpacientes} = req.body

        //atualizar Anaminese
        try{
            //procurar Anaminese pelo id
            const Exists = await Anaminese.findByPk(idanaminese)
            if(!Exists){
                return res.status(404).json({message: "Anaminese não encontrado"})
            }

            await Anaminese.update(
                {
                    queixas: queixas,
                    historicoatual: historicoatual,
                    doencaspreexistentes: doencaspreexistentes,
                    medicamentos: medicamentos,
                    alergias: alergias,
                    cirurgiasanteriores: cirurgiasanteriores,
                    historicofamiliar: historicofamiliar,
                    pacientes_idpacientes: pacientes_idpacientes
                },
                {
                    where: {idanaminese: idanaminese}
                }
            )
            res.status(200).json({message:'Anaminese alterado com sucesso'})
        }catch(error){
            res.status(500).json({message: error})
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

    static async listarOne(req, res){
        const idanaminese = req.params

        try{
            const anamineses = await Anaminese.findOne({where: idanaminese})
            if(!anamineses){
                anamineses = "Anaminese não cadastrada"
            }
        }
        catch(error){
            res.status(500).json({error: error})
        }
    }
}