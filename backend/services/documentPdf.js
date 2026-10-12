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

module.exports = { generatePrescriptionPdf, generateAtestadoPdf, generateLaudoPdf }
