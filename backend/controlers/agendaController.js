const Agenda = require('../models/Agenda')

module.exports = class AgendaController {
    static async listAll(req, res) {
        try {
            const agendamentos = await Agenda.findAll()
            res.status(200).json({ agendamentos })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static async register(req, res) {
        const {
            datahora,
            doutor_iddoutor,
            pacientes_idpacientes,
            clinica_cnpj
        } = req.body

        try {
            const agendamento = await Agenda.create({
                datahora,
                doutor_iddoutor,
                pacientes_idpacientes,
                clinica_cnpj
            })
            res.status(201).json({ agendamento })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}
