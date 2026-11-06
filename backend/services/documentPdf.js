const PDFDocument = require('pdfkit')

function generatePrescriptionPdf({ clinic, patient, doctor, prescription }) {
    return new Promise((resolve, reject) => {
        const pdf = new PDFDocument({ size: 'A4', margin: 50 })
        const chunks = []

        pdf.on('data', chunk => chunks.push(chunk))
        pdf.on('end', () => resolve(Buffer.concat(chunks)))
        pdf.on('error', reject)

        pdf.info.Title = 'Receita médica'
        pdf.info.Author = clinic.nome

        pdf.fontSize(18).font('Helvetica-Bold').text(clinic.nome, { align: 'center' })
        pdf.moveDown(0.3)
        pdf.fontSize(10).font('Helvetica').text(`CNPJ: ${clinic.cnpj}`, { align: 'center' })
        pdf.moveDown()
        pdf.moveTo(50, pdf.y).lineTo(545, pdf.y).strokeColor('#4f7161').stroke()

        pdf.moveDown(1.5)
        pdf.fontSize(16).font('Helvetica-Bold').text('RECEITA MÉDICA', { align: 'center' })
        pdf.moveDown(1.5)

        pdf.fontSize(11).font('Helvetica-Bold').text('Paciente')
        pdf.font('Helvetica').text(`Nome: ${patient.nome}`)
        if (patient.cpf) pdf.text(`CPF: ${patient.cpf}`)
        if (patient.telefone) pdf.text(`Telefone: ${patient.telefone}`)
        if (patient.email) pdf.text(`E-mail: ${patient.email}`)

        pdf.moveDown()
        pdf.font('Helvetica-Bold').text('Profissional')
        pdf.font('Helvetica').text(`Dr(a). ${doctor.nome}`)
        if (doctor.especialidade) pdf.text(`Especialidade: ${doctor.especialidade}`)
        if (doctor.documento) pdf.text(`CRM/Documento: ${doctor.documento}`)

        pdf.moveDown(2)
        pdf.fontSize(12).font('Helvetica-Bold').text('Prescrição')
        pdf.moveDown(0.5)
        pdf.fontSize(11).font('Helvetica').text(prescription, {
            lineGap: 4,
            paragraphGap: 6
        })

        pdf.moveDown(4)
        pdf.text(`Emitida em ${new Intl.DateTimeFormat('pt-BR').format(new Date())}`)
        pdf.moveDown(4)
        if (pdf.y > pdf.page.height - pdf.page.margins.bottom - 60) {
            pdf.addPage()
        }
        const signatureY = pdf.y
        pdf.moveTo(150, signatureY).lineTo(445, signatureY).stroke()
        pdf.moveDown(0.5)
        pdf.text(`Dr(a). ${doctor.nome}`, { align: 'center' })
        if (doctor.documento) pdf.text(doctor.documento, { align: 'center' })

        pdf.end()
    })
}

function generateAtestadoPdf({ clinic, patient, doctor, days, complement }) {
    return new Promise((resolve, reject) => {
        const pdf = new PDFDocument({ size: 'A4', margin: 50 })
        const chunks = []

        pdf.on('data', chunk => chunks.push(chunk))
        pdf.on('end', () => resolve(Buffer.concat(chunks)))
        pdf.on('error', reject)

        pdf.info.Title = 'Atestado médico'
        pdf.info.Author = clinic.nome

        pdf.fontSize(18).font('Helvetica-Bold').text(clinic.nome, { align: 'center' })
        pdf.moveDown(0.3)
        pdf.fontSize(10).font('Helvetica').text(`CNPJ: ${clinic.cnpj}`, { align: 'center' })
        pdf.moveDown()
        pdf.moveTo(50, pdf.y).lineTo(545, pdf.y).strokeColor('#4f7161').stroke()

        pdf.moveDown(1.5)
        pdf.fontSize(16).font('Helvetica-Bold').text('ATESTADO MÉDICO', { align: 'center' })
        pdf.moveDown(2)

        pdf.fontSize(11).font('Helvetica').text(
            `Atesto, para os devidos fins, que ${patient.nome}${patient.cpf ? `, inscrito(a) no CPF ${patient.cpf},` : ''} necessita de afastamento de suas atividades por ${days} ${Number(days) === 1 ? 'dia' : 'dias'}.`,
            { align: 'justify', lineGap: 5 },
        )
        if (complement) {
            pdf.moveDown()
            pdf.text(complement, { align: 'justify', lineGap: 5 })
        }

        pdf.moveDown(3)
        pdf.text(`Emitido em ${new Intl.DateTimeFormat('pt-BR').format(new Date())}`)
        pdf.moveDown(4)
        if (pdf.y > pdf.page.height - pdf.page.margins.bottom - 70) {
            pdf.addPage()
        }
        const signatureY = pdf.y
        pdf.moveTo(150, signatureY).lineTo(445, signatureY).stroke()
        pdf.moveDown(0.5)
        pdf.font('Helvetica').text(`Dr(a). ${doctor.nome}`, { align: 'center' })
        if (doctor.especialidade) pdf.text(doctor.especialidade, { align: 'center' })
        if (doctor.documento) pdf.text(doctor.documento, { align: 'center' })

        pdf.end()
    })
}

function generateLaudoPdf({ clinic, patient, doctor, laudo }) {
    return new Promise((resolve, reject) => {
        const pdf = new PDFDocument({ size: 'A4', margin: 50 })
        const chunks = []

        pdf.on('data', chunk => chunks.push(chunk))
        pdf.on('end', () => resolve(Buffer.concat(chunks)))
        pdf.on('error', reject)

        pdf.info.Title = 'Laudo médico'
        pdf.info.Author = clinic.nome

        pdf.fontSize(18).font('Helvetica-Bold').text(clinic.nome, { align: 'center' })
        pdf.moveDown(0.3)
        pdf.fontSize(10).font('Helvetica').text(`CNPJ: ${clinic.cnpj}`, { align: 'center' })
        pdf.moveDown()
        pdf.moveTo(50, pdf.y).lineTo(545, pdf.y).strokeColor('#4f7161').stroke()

        pdf.moveDown(1.5)
        pdf.fontSize(16).font('Helvetica-Bold').text('LAUDO MÉDICO', { align: 'center' })
        pdf.moveDown(2)

        pdf.fontSize(11).font('Helvetica-Bold').text('Paciente')
        pdf.font('Helvetica').text(`Nome: ${patient.nome}`)
        if (patient.cpf) pdf.text(`CPF: ${patient.cpf}`)
        if (patient.telefone) pdf.text(`Telefone: ${patient.telefone}`)
        if (patient.email) pdf.text(`E-mail: ${patient.email}`)

        pdf.moveDown()
        pdf.font('Helvetica-Bold').text('Profissional')
        pdf.font('Helvetica').text(`Dr(a). ${doctor.nome}`)
        if (doctor.especialidade) pdf.text(`Especialidade: ${doctor.especialidade}`)
        if (doctor.documento) pdf.text(`CRM/Documento: ${doctor.documento}`)

        pdf.moveDown(2)
        pdf.font('Helvetica-Bold').text('Laudo')
        pdf.moveDown(0.5)
        pdf.font('Helvetica').text(laudo, { align: 'justify', lineGap: 5 })

        pdf.moveDown(3)
        pdf.text(`Emitido em ${new Intl.DateTimeFormat('pt-BR').format(new Date())}`)
        pdf.moveDown(4)
        if (pdf.y > pdf.page.height - pdf.page.margins.bottom - 70) {
            pdf.addPage()
        }
        const signatureY = pdf.y
        pdf.moveTo(150, signatureY).lineTo(445, signatureY).stroke()
        pdf.moveDown(0.5)
        pdf.font('Helvetica').text(`Dr(a). ${doctor.nome}`, { align: 'center' })
        if (doctor.especialidade) pdf.text(doctor.especialidade, { align: 'center' })
        if (doctor.documento) pdf.text(doctor.documento, { align: 'center' })

        pdf.end()
    })
}

function generateFinancialPdf({ clinic, dataInicio, dataFim, rows, totalPeriodo }) {
    return new Promise((resolve, reject) => {
        const margin = 40
        const pdf = new PDFDocument({ size: 'A4', margin })
        const chunks = []
        const columns = [
            { label: 'Paciente', width: 78 },
            { label: 'Plano', width: 68 },
            { label: 'Desconto', width: 58 },
            { label: 'Serviço (qtd.)', width: 90 },
            { label: 'Preço', width: 62 },
            { label: 'Aplicado', width: 68 },
            { label: 'Total período', width: 91 }
        ]
        const formatCurrency = value => new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
        const formatDate = value => new Intl.DateTimeFormat('pt-BR', {
            timeZone: 'UTC'
        }).format(new Date(`${value}T00:00:00.000Z`))

        pdf.on('data', chunk => chunks.push(chunk))
        pdf.on('end', () => resolve(Buffer.concat(chunks)))
        pdf.on('error', reject)

        pdf.info.Title = 'Relatório financeiro'
        pdf.info.Author = clinic.nome

        function drawHeader() {
            pdf.font('Helvetica-Bold').fontSize(16).text(clinic.nome, margin, margin, {
                width: pdf.page.width - margin * 2,
                align: 'center'
            })
            pdf.font('Helvetica').fontSize(9).text(`CNPJ: ${clinic.cnpj}`, {
                align: 'center'
            })
            pdf.moveDown()
            pdf.font('Helvetica-Bold').fontSize(13).text('RELATÓRIO FINANCEIRO', {
                align: 'center'
            })
            pdf.moveDown(0.5)
            pdf.font('Helvetica').fontSize(9).text(
                `Período: ${formatDate(dataInicio)} a ${formatDate(dataFim)}`,
                { align: 'center' }
            )
            pdf.fontSize(8).fillColor('#666666').text(
                'Cálculo baseado nos preços e planos atuais.',
                { align: 'center' }
            )
            pdf.fillColor('#222222').moveDown(1.5)
        }

        function drawTableHeader() {
            const y = pdf.y
            let x = margin
            pdf.font('Helvetica-Bold').fontSize(7)
            for (const column of columns) {
                pdf.text(column.label, x + 3, y, { width: column.width - 6 })
                x += column.width
            }
            pdf.moveTo(margin, pdf.y + 3).lineTo(pdf.page.width - margin, pdf.y + 3)
                .strokeColor('#4f7161').stroke()
            pdf.y += 9
        }

        drawHeader()
        drawTableHeader()

        if (!rows.length) {
            pdf.moveDown()
            pdf.fontSize(10).text('Nenhum agendamento encontrado neste período.', {
                align: 'center'
            })
        } else {
            for (const row of rows) {
                const values = [
                    row.nome,
                    row.plano,
                    row.desconto,
                    `${row.servico} (${row.quantidade})`,
                    formatCurrency(row.preco),
                    formatCurrency(row.precoAplicado),
                    formatCurrency(row.totalPeriodo)
                ]
                const rowHeight = Math.max(...values.map((value, index) =>
                    pdf.heightOfString(value, {
                        width: columns[index].width - 6,
                        font: 'Helvetica',
                        fontSize: 7
                    })
                )) + 8
                if (pdf.y + rowHeight > pdf.page.height - margin - 24) {
                    pdf.addPage()
                    drawHeader()
                    drawTableHeader()
                }

                const y = pdf.y
                let x = margin
                pdf.fillColor('#222222').font('Helvetica').fontSize(7)
                values.forEach((value, index) => {
                    pdf.text(value, x + 3, y + 3, {
                        width: columns[index].width - 6
                    })
                    x += columns[index].width
                })
                pdf.y = y + rowHeight
                pdf.moveTo(margin, pdf.y).lineTo(pdf.page.width - margin, pdf.y)
                    .strokeColor('#dfe7e2').stroke()
                pdf.y += 3
            }
        }

        if (pdf.y + 30 > pdf.page.height - margin) pdf.addPage()
        pdf.moveDown()
        pdf.font('Helvetica-Bold').fontSize(11)
            .text(`TOTAL FINAL DO PERÍODO: ${formatCurrency(totalPeriodo)}`, { align: 'right' })

        pdf.end()
    })
}

module.exports = {
    generatePrescriptionPdf,
    generateAtestadoPdf,
    generateLaudoPdf,
    generateFinancialPdf
}
