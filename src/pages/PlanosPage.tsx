import { useEffect, useState } from 'react'
import type { Page, PlanoItem } from '../types'
import { API_URL, fetchWithToken, readResponse, messageFrom, post } from '../services/api'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { ListActions } from '../components/common/ListActions'

export function PlanosPage({ onNavigate, onEdit }: { onNavigate: (page: Page) => void; onEdit: (item: PlanoItem) => void }) {
  const [planos, setPlanos] = useState<PlanoItem[]>([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchWithToken(`${API_URL}/plano/listarByCNPJ`)
      .then(async (response) => {
        const data = await readResponse(response)
        if (!response.ok) throw new Error()
        setPlanos(data.planos || [])
      })
      .catch(() => setError(true))
  }, [])

  const filtered = planos.filter((plano) =>
    plano.descricao?.toLowerCase().includes(query.trim().toLowerCase()),
  )

  const deletePlano = async (plano: PlanoItem) => {
    if (!window.confirm(`Deseja excluir o plano ${plano.descricao}?`)) return
    try {
      const response = await post(`/plano/delete/${plano.idplano}`, {})
      if (!response.ok) throw new Error(messageFrom(response.data))
      setPlanos((current) => current.filter(({ idplano }) => idplano !== plano.idplano))
    } catch (deleteError) {
      window.alert(deleteError instanceof Error ? deleteError.message : 'Não foi possível excluir o plano.')
    }
  }

  return (
    <Sidebar active="planos" onNavigate={onNavigate}>
      <div className="mb-6 flex items-center gap-4">
        <input
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-[#4f7161] focus:outline-none focus:ring-2 focus:ring-[#4f7161]/20"
          placeholder="Pesquisar plano"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button
          className="h-11 w-11 shrink-0 rounded-lg bg-[#4f7161] text-2xl leading-none text-white transition hover:bg-[#3f5c4f]"
          type="button"
          onClick={() => onNavigate('cadastroPlano')}
        >
          +
        </button>
      </div>
      <div className="rounded-[10px] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <ul className="max-h-[65vh] list-none overflow-y-auto">
          {error ? (
            <li className="rounded-lg bg-[#eef4ef] px-4 py-3.5 text-center text-gray-500">
              Não foi possível carregar os planos.
            </li>
          ) : filtered.length ? (
            filtered.map((plano) => (
              <li
                className="mb-2 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#eef4ef] px-4 py-3.5 text-gray-800 last:mb-0"
                key={plano.idplano}
              >
                <span className="font-bold">{plano.idplano} — {plano.descricao.toUpperCase()}</span>
                <ListActions onEdit={() => onEdit(plano)} onDelete={() => deletePlano(plano)} />
              </li>
            ))
          ) : (
            <li className="rounded-lg bg-[#eef4ef] px-4 py-3.5 text-center text-gray-500">
              {planos.length
                ? 'Nenhum resultado encontrado.'
                : 'Nenhum plano cadastrado ainda.'}
            </li>
          )}
        </ul>
      </div>
    </Sidebar>
  )
}
