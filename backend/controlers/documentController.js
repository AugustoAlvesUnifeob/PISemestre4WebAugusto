const Clinica = require('../models/Clinica')
const Doutor = require('../models/Doutor')
const Paciente = require('../models/Paciente')
const {
    generatePrescriptionPdf,
    generateAtestadoPdf,
    generateLaudoPdf
} = require('../services/documentPdf')

function isPositiveInteger(value) {
    return Number.isSafeInteger(Number(value)) && Number(value) > 0
}

module.exports = class DocumentController {
    static async gerarReceita(req, res) {
        const clinicaCnpj = req.user.clinica_cnpj
        const { idpaciente, iddoutor, prescricao } = req.body

        if (!clinicaCnpj) {
            return res.status(401).json({ message: 'Clínica não identificada no token.' })
        }
        if (!isPositiveInteger(idpaciente) || !isPositiveInteger(iddoutor)) {
            return res.status(400).json({ message: 'Selecione um paciente e um doutor válidos.' })
        }
        if (typeof prescricao !== 'string' || !prescricao.trim()) {
            return res.status(400).json({ message: 'A prescrição é obrigatória.' })
        }
        if (prescricao.trim().length > 10000) {
            return res.status(400).json({ message: 'A prescrição deve ter no máximo 10.000 caracteres.' })
        }

        try {
            const [clinic, patient, doctor] = await Promise.all([
                Clinica.findByPk(clinicaCnpj),
                Paciente.findOne({
                    where: { idpacientes: Number(idpaciente), clinica_cnpj: clinicaCnpj }
                }),
                Doutor.findOne({
                    where: { iddoutor: Number(iddoutor), clinica_cnpj: clinicaCnpj }
                })
            ])

            if (!clinic) return res.status(404).json({ message: 'Clínica não encontrada.' })
            if (!patient) return res.status(404).json({ message: 'Paciente não encontrado nesta clínica.' })
            if (!doctor) return res.status(404).json({ message: 'Doutor não encontrado nesta clínica.' })

            const pdf = await generatePrescriptionPdf({
                clinic,
                patient,
                doctor,
                prescription: prescricao.trim()
            })

            res.status(200)
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="receita-${patient.idpacientes}.pdf"`
            )
            res.setHeader('Content-Length', pdf.length)
            return res.end(pdf)
        } catch (error) {
            console.error('Erro ao gerar receita em PDF:', error)
            return res.status(500).json({ message: 'Não foi possível gerar a receita em PDF.' })
        }
    }

    static async gerarAtestado(req, res) {
        const clinicaCnpj = req.user.clinica_cnpj
        const { idpaciente, iddoutor, dias, complemento } = req.body

        if (!clinicaCnpj) {
            return res.status(401).json({ message: 'Clínica não identificada no token.' })
        }
        if (!isPositiveInteger(idpaciente) || !isPositiveInteger(iddoutor)) {
            return res.status(400).json({ message: 'Selecione um paciente e um doutor válidos.' })
        }
        if (!isPositiveInteger(dias)) {
            return res.status(400).json({ message: 'Informe uma quantidade válida de dias.' })
        }
        if (complemento !== undefined && typeof complemento !== 'string') {
            return res.status(400).json({ message: 'O complemento deve ser um texto.' })
        }
        if (typeof complemento === 'string' && complemento.length > 10000) {
            return res.status(400).json({ message: 'O complemento deve ter no máximo 10.000 caracteres.' })
        }

        try {
            const [clinic, patient, doctor] = await Promise.all([
                Clinica.findByPk(clinicaCnpj),
                Paciente.findOne({
                    where: { idpacientes: Number(idpaciente), clinica_cnpj: clinicaCnpj }
                }),
                Doutor.findOne({
                    where: { iddoutor: Number(iddoutor), clinica_cnpj: clinicaCnpj }
                })
            ])

            if (!clinic) return res.status(404).json({ message: 'Clínica não encontrada.' })
            if (!patient) return res.status(404).json({ message: 'Paciente não encontrado nesta clínica.' })
            if (!doctor) return res.status(404).json({ message: 'Doutor não encontrado nesta clínica.' })

            const pdf = await generateAtestadoPdf({
                clinic,
                patient,
                doctor,
                days: Number(dias),
                complement: complemento?.trim()
            })

            res.status(200)
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="atestado-${patient.idpacientes}.pdf"`
            )
            res.setHeader('Content-Length', pdf.length)
            return res.end(pdf)
        } catch (error) {
            console.error('Erro ao gerar atestado em PDF:', error)
            return res.status(500).json({ message: 'Não foi possível gerar o atestado em PDF.' })
        }
    }

    static async gerarLaudo(req, res) {
        const clinicaCnpj = req.user.clinica_cnpj
        const { idpaciente, iddoutor, laudo } = req.body

        if (!clinicaCnpj) {
            return res.status(401).json({ message: 'Clínica não identificada no token.' })
        }
        if (!isPositiveInteger(idpaciente) || !isPositiveInteger(iddoutor)) {
            return res.status(400).json({ message: 'Selecione um paciente e um doutor válidos.' })
        }
        if (typeof laudo !== 'string' || !laudo.trim()) {
            return res.status(400).json({ message: 'O conteúdo do laudo é obrigatório.' })
        }
        if (laudo.trim().length > 10000) {
            return res.status(400).json({ message: 'O laudo deve ter no máximo 10.000 caracteres.' })
        }

        try {
            const [clinic, patient, doctor] = await Promise.all([
                Clinica.findByPk(clinicaCnpj),
                Paciente.findOne({
                    where: { idpacientes: Number(idpaciente), clinica_cnpj: clinicaCnpj }
                }),
                Doutor.findOne({
                    where: { iddoutor: Number(iddoutor), clinica_cnpj: clinicaCnpj }
                })
            ])

            if (!clinic) return res.status(404).json({ message: 'Clínica não encontrada.' })
            if (!patient) return res.status(404).json({ message: 'Paciente não encontrado nesta clínica.' })
            if (!doctor) return res.status(404).json({ message: 'Doutor não encontrado nesta clínica.' })

            const pdf = await generateLaudoPdf({
                clinic,
                patient,
                doctor,
                laudo: laudo?.trim()
            })

            res.status(200)
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="laudo-${patient.idpacientes}.pdf"`
            )
            res.setHeader('Content-Length', pdf.length)
            return res.end(pdf)
        } catch (error) {
            console.error('Erro ao gerar laudo em PDF:', error)
            return res.status(500).json({ message: 'Não foi possível gerar o laudo em PDF.' })
        }
    }
}
