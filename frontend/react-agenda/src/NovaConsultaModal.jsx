// frontend/react-agenda/src/NovaConsultaModal.jsx

import { useState } from 'react'


export default function NovaConsultaModal({ aoFechar, aoSalvar }) {

  const [pacienteId, setPacienteId] = useState('')
  const [doutorId, setDoutorId] = useState('')
  const [dataHora, setDataHora] = useState('')


  async function handleSalvar() {
    try {
      const resposta = await fetch('http://localhost:3000/api/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pacientes_idpacientes: pacienteId,
          doutor_iddoutor: doutorId,
          datahora: dataHora,
          clinica_cnpj: '30976442000139' 
        })
      })

      if (!resposta.ok) {
  
        const erro = await resposta.json()
        alert(erro.message)
        return
      }

      aoSalvar() 
    } catch (error) {
      alert('Erro ao criar agendamento')
    }
  }

  return (

    <div className="modal-overlay" onClick={aoFechar}>
      <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
        <h2>Nova Consulta</h2>

        <label>Paciente (ID)</label>
        <input
          value={pacienteId}
          onChange={(e) => setPacienteId(e.target.value)}
        />

        <label>Doutor (ID)</label>
        <input
          value={doutorId}
          onChange={(e) => setDoutorId(e.target.value)}
        />

        <label>Data e Hora</label>
        <input
          type="datetime-local"
          value={dataHora}
          onChange={(e) => setDataHora(e.target.value)}
        />

        <div className="modal-botoes">
          <button onClick={aoFechar}>Cancelar</button>
          <button onClick={handleSalvar}>Salvar</button>
        </div>
      </div>
    </div>
  )
}