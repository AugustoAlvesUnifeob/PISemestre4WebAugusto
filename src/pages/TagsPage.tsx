import { useEffect, useState } from 'react'
import type { Page, TagItem } from '../types'
import { API_URL, fetchWithToken, readResponse, messageFrom, post } from '../services/api'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { ListActions } from '../components/common/ListActions'

export function TagsPage({ onNavigate, onEdit }: { onNavigate: (page: Page) => void; onEdit: (item: TagItem) => void }) {
  const [tags, setTags] = useState<TagItem[]>([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchWithToken(`${API_URL}/tag/listarByCNPJ`)
      .then(async (response) => {
        const data = await readResponse(response)
        if (!response.ok) throw new Error()
        setTags(data.tags || [])
      })
      .catch(() => setError(true))
  }, [])

  const filtered = tags.filter((tag) =>
    tag.descricao?.toLowerCase().includes(query.trim().toLowerCase()),
  )

  const deleteTag = async (tag: TagItem) => {
    if (!window.confirm(`Deseja excluir a tag ${tag.descricao}?`)) return
    try {
      const response = await post(`/tag/delete/${tag.idtag}`, {})
      if (!response.ok) throw new Error(messageFrom(response.data))
      setTags((current) => current.filter(({ idtag }) => idtag !== tag.idtag))
    } catch (deleteError) {
      window.alert(deleteError instanceof Error ? deleteError.message : 'Não foi possível excluir a tag.')
    }
  }

  return (
    <Sidebar active="tags" onNavigate={onNavigate}>
      <div className="mb-6 flex items-center gap-4">
        <input
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-[#4f7161] focus:outline-none focus:ring-2 focus:ring-[#4f7161]/20"
          placeholder="Pesquisar tag"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button
          className="h-11 w-11 shrink-0 rounded-lg bg-[#4f7161] text-2xl leading-none text-white transition hover:bg-[#3f5c4f]"
          type="button"
          onClick={() => onNavigate('cadastroTag')}
        >
          +
        </button>
      </div>
      <div className="rounded-[10px] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <ul className="max-h-[65vh] list-none overflow-y-auto">
          {error ? (
            <li className="rounded-lg bg-[#eef4ef] px-4 py-3.5 text-center text-gray-500">
              Não foi possível carregar as tags.
            </li>
          ) : filtered.length ? (
            filtered.map((tag) => (
              <li
                className="mb-2 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#eef4ef] px-4 py-3.5 text-gray-800 last:mb-0"
                key={tag.idtag}
              >
                <span className="font-bold">{tag.idtag} — {tag.descricao.toUpperCase()}</span>
                <ListActions onEdit={() => onEdit(tag)} onDelete={() => deleteTag(tag)} />
              </li>
            ))
          ) : (
            <li className="rounded-lg bg-[#eef4ef] px-4 py-3.5 text-center text-gray-500">
              {tags.length
                ? 'Nenhum resultado encontrado.'
                : 'Nenhuma tag cadastrada ainda.'}
            </li>
          )}
        </ul>
      </div>
    </Sidebar>
  )
}
