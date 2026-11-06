const Clinica = require('../models/Clinica')
const Doutor = require('../models/Doutor')
const Paciente = require('../models/Paciente')
const Agenda = require('../models/Agenda')
const { QueryTypes } = require('sequelize')
const {
    generatePrescriptionPdf,
    generateAtestadoPdf,
    generateLaudoPdf,
    generateFinancialPdf
} = require('../services/documentPdf')

function isPositiveInteger(value) {
    return Number.isSafeInteger(Number(value)) && Number(value) > 0
}

function isValidDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false
    }

    const date = new Date(`${value}T00:00:00.000Z`)
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function roundCurrency(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100
}

module.exports = class DocumentController {
    static async gerarFinanceiro(req, res) {
        const clinicaCnpj = req.user.clinica_cnpj
        const { dataInicio, dataFim } = req.body

        if (!clinicaCnpj) {
            return res.status(401).json({ message: 'Clínica não identificada no token.' })
        }
        if (!isValidDate(dataInicio) || !isValidDate(dataFim) || dataInicio > dataFim) {
            return res.status(400).json({ message: 'Informe um período válido, com data inicial anterior ou igual à final.' })
        }

        try {
            const clinic = await Clinica.findByPk(clinicaCnpj)
            if (!clinic) return res.status(404).json({ message: 'Clínica não encontrada.' })

            const diaSeguinte = new Date(`${dataFim}T00:00:00.000Z`)
            diaSeguinte.setUTCDate(diaSeguinte.getUTCDate() + 1)
            const registros = await Agenda.sequelize.query(`
                SELECT
                    pa.idpacientes,
                    pa.nome,
                    p.descricao AS plano,
                    p.aplicadesconto,
                    p.valordesconto,
                    p.exonera,
                    s.idservico,
                    s.nome AS servico,
                    s.preco AS preco,
                    COUNT(a.idagenda) AS quantidade
                FROM agenda a
                INNER JOIN pacientes pa
                    ON pa.idpacientes = a.pacientes_idpacientes
                    AND pa.clinica_cnpj = a.clinica_cnpj
                LEFT JOIN plano p
                    ON p.idplano = pa.plano_idplano
                    AND p.clinica_cnpj = pa.clinica_cnpj
                LEFT JOIN servicos s
                    ON s.idservico = a.servico_idservico
                    AND s.clinica_cnpj = a.clinica_cnpj
                WHERE a.clinica_cnpj = :clinicaCnpj
                    AND a.datahora >= :inicio
                    AND a.datahora < :fim
                GROUP BY
                    pa.idpacientes,
                    pa.nome,
                    p.descricao,
                    p.aplicadesconto,
                    p.valordesconto,
                    p.exonera,
                    s.idservico,
                    s.nome,
                    s.preco
                ORDER BY pa.nome, s.nome
            `, {
                replacements: {
                    clinicaCnpj,
                    inicio: `${dataInicio} 00:00:00`,
                    fim: `${diaSeguinte.toISOString().slice(0, 10)} 00:00:00`
                },
                type: QueryTypes.SELECT
            })

            const rows = registros.map(registro => {
                if (
                    registro.plano == null ||
                    registro.aplicadesconto == null ||
                    registro.valordesconto == null ||
                    registro.exonera == null ||
                    registro.idservico == null ||
                    registro.servico == null ||
                    registro.preco == null
                ) {
                    throw new Error('Um agendamento do período está sem plano ou serviço financeiro válido.')
                }

                const preco = Number(registro.preco)
                const quantidade = Number(registro.quantidade)
                const exonerado = Number(registro.exonera) === 1
                const descontoAplicavel = Number(registro.aplicadesconto) === 1
                const percentual = descontoAplicavel ? Number(registro.valordesconto) : 0

                if (
                    !Number.isFinite(preco) || preco < 0 ||
                    !Number.isSafeInteger(quantidade) || quantidade <= 0 ||
                    !Number.isFinite(percentual) || percentual < 0 || percentual > 100
                ) {
                    throw new Error('Os dados financeiros de um serviço ou plano são inválidos.')
                }

                const precoAplicado = exonerado
                    ? 0
                    : roundCurrency(preco * (1 - percentual / 100))

                return {
                    nome: registro.nome,
                    plano: registro.plano,
                    desconto: exonerado
                        ? 'Exonerado'
                        : descontoAplicavel
                            ? `${percentual}%`
                            : 'Sem desconto',
                    servico: registro.servico || 'Serviço não identificado',
                    quantidade,
                    preco,
                    precoAplicado,
                    totalPeriodo: roundCurrency(precoAplicado * quantidade)
                }
            })
            const totalPeriodo = roundCurrency(
                rows.reduce((total, row) => total + row.totalPeriodo, 0)
            )
            const pdf = await generateFinancialPdf({
                clinic,
                dataInicio,
                dataFim,
                rows,
                totalPeriodo
            })

            res.status(200)
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="financeiro-${dataInicio}-${dataFim}.pdf"`
            )
            res.setHeader('Content-Length', pdf.length)
            res.setHeader('Cache-Control', 'private, no-store')
            return res.end(pdf)
        } catch (error) {
            console.error('Erro ao gerar relatório financeiro em PDF:', error)
            return res.status(500).json({ message: 'Não foi possível gerar o relatório financeiro em PDF.' })
        }
    }

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
