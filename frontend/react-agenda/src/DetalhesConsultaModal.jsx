

export default function DetalhesConsultaModal({ consulta, aoFechar }) {
  return (
    <div className="modal-overlay" onClick={aoFechar}>
      <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
        <h2>Detalhes da Consulta</h2>

        <p><strong>Paciente ID:</strong> {consulta.pacienteId}</p>
        <p><strong>Doutor ID:</strong> {consulta.doutorId}</p>
        {/* toLocaleString formata a data pro padrão brasileiro (dd/mm/aaaa hh:mm) */}
        <p><strong>Data:</strong> {consulta.inicio.toLocaleString('pt-BR')}</p>
        <p><strong>Status:</strong> {consulta.status}</p>

        <button onClick={aoFechar}>Fechar</button>
      </div>
    </div>
  )
}