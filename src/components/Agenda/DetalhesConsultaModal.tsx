
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

type DetalhesConsultaModalProps = {
  consulta: {
    id: string
    pacienteId: number
    doutorId: number
    pacienteNome: string
    doutorNome: string
    inicio: Date
    status?: string
  }
  aoFechar: () => void
  aoExcluir: () => void
}

export default function DetalhesConsultaModal({ consulta, aoFechar, aoExcluir }: DetalhesConsultaModalProps) {
  const [confirmando, setConfirmando] = useState(false)
  const [apagando, setApagando] = useState(false)
  const [erro, setErro] = useState('')
  const { token } = useAuth()

  async function apagarAgendamento() {
    setApagando(true)
    setErro('')
    try {
      const response = await fetch(`http://localhost:5000/agenda/delete/${consulta.id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Não foi possível apagar o agendamento.')
      aoExcluir()
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível apagar o agendamento.')
    } finally {
      setApagando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) aoFechar()
      }}
    >
      <section
        aria-labelledby="detalhes-consulta-titulo"
        aria-modal="true"
        className="w-full max-w-md rounded-[10px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)] md:p-8"
        role="dialog"
      >
        <h2 id="detalhes-consulta-titulo" className="mb-6 text-xl font-bold text-[#4f7161]">
          Detalhes da Consulta
        </h2>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-gray-500">Paciente</dt>
            <dd className="font-semibold text-gray-800">{consulta.pacienteNome}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Doutor(a)</dt>
            <dd className="font-semibold text-gray-800">{consulta.doutorNome}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Data e hora</dt>
            <dd className="font-semibold text-gray-800">{consulta.inicio.toLocaleString('pt-BR')}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Status</dt>
            <dd className="font-semibold text-gray-800">{consulta.status || 'Não informado'}</dd>
          </div>
        </dl>
        {confirmando && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
            <p>Tem certeza que deseja apagar este agendamento? Esta ação não pode ser desfeita.</p>
            <div className="mt-3 flex justify-end gap-2">
              <button
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-white"
                disabled={apagando}
                type="button"
                onClick={() => setConfirmando(false)}
              >
                Cancelar
              </button>
              <button
                className="rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
                disabled={apagando}
                type="button"
                onClick={apagarAgendamento}
              >
                {apagando ? 'Apagando...' : 'Confirmar exclusão'}
              </button>
            </div>
          </div>
        )}
        {erro && <p className="mt-4 text-sm text-red-700" role="alert">{erro}</p>}
        <div className="mt-7 flex justify-between gap-3">
          <button
            className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
            disabled={apagando}
            type="button"
            onClick={() => {
              setErro('')
              setConfirmando(true)
            }}
          >
            Apagar agendamento
          </button>
          <button
            className="rounded-lg bg-[#4f7161] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3f5c4f]"
            disabled={apagando}
            type="button"
            onClick={aoFechar}
          >
            Fechar
          </button>
        </div>
      </section>
    </div>
  )
}