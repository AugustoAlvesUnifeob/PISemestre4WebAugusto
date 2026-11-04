const Agenda = require('../models/Agenda')

module.exports = class AgendaController {
    static async listAll(req, res) {
        try {
            const agendamentos = await Agenda.findAll({
                where: { clinica_cnpj: req.user.clinica_cnpj }
            })
            return res.status(200).json({ agendamentos })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    static async register(req, res) {
        const {
            datahora,
            doutor_iddoutor,
            pacientes_idpacientes,
        } = req.body

        try {
            const agendamento = await Agenda.create({
                datahora,
                doutor_iddoutor,
                pacientes_idpacientes,
                clinica_cnpj: req.user.clinica_cnpj
            })
            return res.status(201).json({ agendamento })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    static async delete(req, res) {
        const { idagenda } = req.params
        const clinica_cnpj = req.user.clinica_cnpj

        try {
            const agendamento = await Agenda.findOne({
                where: { idagenda, clinica_cnpj }
            })
            if (!agendamento) {
                return res.status(404).json({ message: 'Agendamento não encontrado' })
            }

            await agendamento.destroy()
            return res.status(200).json({ message: 'Agendamento apagado com sucesso' })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}
