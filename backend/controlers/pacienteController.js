//requerer o model do paciente
const Paciente = require('../models/Paciente')
const Tag = require('../models/Tag')
const Tagpaciente = require('../models/Tagpaciente')

async function validarTags(tagIds, clinicaCnpj) {
    if (!Array.isArray(tagIds)) {
        return { error: 'As tags devem ser enviadas como uma lista.' }
    }

    const ids = [...new Set(tagIds.map(Number))]
    if (ids.some(id => !Number.isInteger(id) || id <= 0)) {
        return { error: 'Uma ou mais tags selecionadas são inválidas.' }
    }

    const tags = ids.length
        ? await Tag.findAll({
            where: { idtag: ids, clinica_cnpj: clinicaCnpj },
            attributes: ['idtag']
        })
        : []

    if (tags.length !== ids.length) {
        return { error: 'Uma ou mais tags não pertencem à clínica.' }
    }

    return { ids }
}

async function atualizarTagsPaciente(pacienteId, tagIds, transaction) {
    await Tagpaciente.destroy({
        where: { pacientes_idpacientes: pacienteId },
        transaction
    })

    if (tagIds.length) {
        await Tagpaciente.bulkCreate(
            tagIds.map(tagId => ({
                tag_idtag: tagId,
                pacientes_idpacientes: pacienteId
            })),
            { transaction }
        )
    }
}

async function incluirTags(pacientes) {
    if (!pacientes.length) return []

    const ids = pacientes.map(paciente => paciente.idpacientes)
    const vinculos = await Tagpaciente.findAll({
        where: { pacientes_idpacientes: ids },
        attributes: ['tag_idtag', 'pacientes_idpacientes']
    })
    const tagsPorPaciente = new Map()

    for (const vinculo of vinculos) {
        const tagIds = tagsPorPaciente.get(vinculo.pacientes_idpacientes) || []
        tagIds.push(vinculo.tag_idtag)
        tagsPorPaciente.set(vinculo.pacientes_idpacientes, tagIds)
    }

    return pacientes.map(paciente => ({
        ...paciente.toJSON(),
        tag_ids: tagsPorPaciente.get(paciente.idpacientes) || []
    }))
}

module.exports = class PacienteController{
    static async register(req, res){
        const {nome, cpf, telefone, email, complemento, plano_idplano, tag_ids = []} = req.body
        const clinica_cnpj = req.user.clinica_cnpj

        if (!clinica_cnpj) {
            return res.status(401).json({message: 'Clínica não identificada no token'})
        }

        const resultadoTags = await validarTags(tag_ids, clinica_cnpj)
        if (resultadoTags.error) {
            return res.status(400).json({message: resultadoTags.error})
        }

        const transaction = await Paciente.sequelize.transaction()
        try{
            const paciente = await Paciente.create({
                nome: nome,
                cpf: cpf,
                telefone: telefone,
                email: email,
                complemento: complemento,
                plano_idplano: plano_idplano,
                clinica_cnpj: clinica_cnpj
            }, { transaction })
            await atualizarTagsPaciente(paciente.idpacientes, resultadoTags.ids, transaction)
            await transaction.commit()
            res.status(200).json({message:'Paciente Cadastrado com sucesso'})
        }catch(error){
            await transaction.rollback()
            res.status(500).json({message: error.message})
        }
    }

    static async update(req, res){
        const {idpaciente} = req.params
        const {nome, cpf, telefone, email, complemento, plano_idplano, tag_ids} = req.body
        const clinica_cnpj = req.user.clinica_cnpj

        try{
            const paciente = await Paciente.findOne({
                where: { idpacientes: idpaciente, clinica_cnpj }
            })
            if(!paciente){
                return res.status(404).json({message: "Paciente não encontrado"})
            }

            const resultadoTags = tag_ids === undefined
                ? null
                : await validarTags(tag_ids, clinica_cnpj)
            if (resultadoTags?.error) {
                return res.status(400).json({message: resultadoTags.error})
            }

            const transaction = await Paciente.sequelize.transaction()
            try {
                await paciente.update({
                    nome,
                    cpf,
                    telefone,
                    email,
                    complemento,
                    plano_idplano,
                    clinica_cnpj
                }, { transaction })
                if (resultadoTags) {
                    await atualizarTagsPaciente(paciente.idpacientes, resultadoTags.ids, transaction)
                }
                await transaction.commit()
            } catch (error) {
                await transaction.rollback()
                throw error
            }
            res.status(200).json({message:'Paciente alterado com sucesso'})
        }catch(error){
            res.status(500).json({message: error.message})
        }
    }

    static async delete(req, res){
        const {idpaciente} = req.params
        const clinica_cnpj = req.user.clinica_cnpj
        const transaction = await Paciente.sequelize.transaction()
        try{
            const paciente = await Paciente.findOne({
                where: { idpacientes: idpaciente, clinica_cnpj },
                transaction
            })
            if(!paciente){
                await transaction.rollback()
                return res.status(404).json({message: 'Paciente não encontrado'})
            }
            await Tagpaciente.destroy({
                where: { pacientes_idpacientes: paciente.idpacientes },
                transaction
            })
            await paciente.destroy({ transaction })
            await transaction.commit()
            res.status(200).json({message:'Paciente deletado com sucesso'})
        }
        catch(error){
            await transaction.rollback()
            res.status(500).json({message: error.message})
        }
    }

    //metodo para listar todos os pacientes
    static async listAll(req, res){
        try{
            const pacientes = await Paciente.findAll({
                where: {clinica_cnpj: req.user.clinica_cnpj}
            })
            res.status(200).json({pacientes: pacientes})
        }
        catch(error){
            res.status(500).json({error: error})
        }
    }

    static async listarByCNPJ(req, res){
        const clinica_cnpj = req.user.clinica_cnpj

        try{
            const pacientes = await Paciente.findAll({where: {clinica_cnpj}})
            res.status(200).json({pacientes: await incluirTags(pacientes)})
        }
        catch(error){
            res.status(500).json({message: error.message})
        }
    }

    static async listarOne(req, res){
        const {idpaciente} = req.params

        try{
            const paciente = await Paciente.findOne({
                where: { idpacientes: idpaciente, clinica_cnpj: req.user.clinica_cnpj }
            })
            if(!paciente){
                return res.status(404).json({message: 'Paciente não cadastrado'})
            }
            const [pacienteComTags] = await incluirTags([paciente])
            return res.status(200).json({paciente: pacienteComTags})
        }
        catch(error){
            return res.status(500).json({message: error.message})
        }
    }
}