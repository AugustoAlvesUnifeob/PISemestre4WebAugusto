import { useEffect, useState } from 'react'
import type { Page, ServicoItem } from '../types'
import { API_URL, fetchWithToken, readResponse, messageFrom, post } from '../services/api'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { ListActions } from '../components/common/ListActions'

export function ServicosPage({ onNavigate, onEdit }: { onNavigate: (page: Page) => void; onEdit: (item: ServicoItem) => void }) {
  const [servicos, setServicos] = useState<ServicoItem[]>([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchWithToken(`${API_URL}/servicos`)
      .then(async (response) => {
        const data = await readResponse(response)
        if (!response.ok) throw new Error()
        setServicos(data.servicos || [])
      })
      .catch(() => setError(true))
  }, [])

  const filtered = servicos.filter((servico) =>
    servico.nome?.toLowerCase().includes(query.trim().toLowerCase())
    || String(servico.idservico).includes(query.trim()),
  )

  const deleteServico = async (servico: ServicoItem) => {
    if (!window.confirm(`Deseja excluir o serviço ${servico.nome}?`)) return
    try {
      const response = await post(`/servicos/delete/${encodeURIComponent(servico.idservico)}`, {})
      if (!response.ok) throw new Error(messageFrom(response.data))
      setServicos((current) => current.filter(({ idservico }) => idservico !== servico.idservico))
    } catch (deleteError) {
      window.alert(deleteError instanceof Error ? deleteError.message : 'Não foi possível excluir o serviço.')
    }
  }

  return (
    <Sidebar active="servicos" onNavigate={onNavigate}>
      <div className="mb-6 flex items-center gap-4">
        <input
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-[#4f7161] focus:outline-none focus:ring-2 focus:ring-[#4f7161]/20"
          placeholder="Pesquisar serviço"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button
          className="h-11 w-11 shrink-0 rounded-lg bg-[#4f7161] text-2xl leading-none text-white transition hover:bg-[#3f5c4f]"
          type="button"
          onClick={() => onNavigate('cadastroServico')}
        >
          +
        </button>
      </div>
      <div className="rounded-[10px] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <ul className="max-h-[65vh] list-none overflow-y-auto">
          {error ? (
            <li className="rounded-lg bg-[#eef4ef] px-4 py-3.5 text-center text-gray-500">
              Não foi possível carregar os serviços.
            </li>
          ) : filtered.length ? (
            filtered.map((servico) => (
              <li
                className="mb-2 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#eef4ef] px-4 py-3.5 text-gray-800 last:mb-0"
                key={servico.idservico}
              >
                <span className="font-bold">
                  {servico.idservico} — {servico.nome.toUpperCase()} — R$ {Number(servico.preco).toFixed(2)}
                </span>
                <ListActions onEdit={() => onEdit(servico)} onDelete={() => deleteServico(servico)} />
              </li>
            ))
          ) : (
            <li className="rounded-lg bg-[#eef4ef] px-4 py-3.5 text-center text-gray-500">
              {servicos.length
                ? 'Nenhum resultado encontrado.'
                : 'Nenhum serviço cadastrado ainda.'}
            </li>
          )}
        </ul>
      </div>
    </Sidebar>
  )
}
