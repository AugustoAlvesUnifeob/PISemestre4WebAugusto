// frontend/react-agenda/src/NovaConsultaModal.jsx

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../../context/AuthContext'


type NovaConsultaModalProps = {
  aoFechar: () => void
  aoSalvar: () => void
}

type PessoaOption = {
  idpacientes?: number
  iddoutor?: number
  nome: string
}

export default function NovaConsultaModal({ aoFechar, aoSalvar }: NovaConsultaModalProps) {
  const [pacienteId, setPacienteId] = useState('')
  const [doutorId, setDoutorId] = useState('')
  const [dataHora, setDataHora] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [pacientes, setPacientes] = useState<PessoaOption[]>([])
  const [doutores, setDoutores] = useState<PessoaOption[]>([])
  const [carregandoPessoas, setCarregandoPessoas] = useState(true)
  const { token, user } = useAuth()

  useEffect(() => {
    async function carregarPessoas() {
      try {
        const headers: Record<string, string> = token
          ? { Authorization: `Bearer ${token}` }
          : {}
        const [pacientesResponse, doutoresResponse] = await Promise.all([
          fetch('http://localhost:5000/pacientes/listarByCNPJ', { headers }),
          fetch('http://localhost:5000/doutores/listarByCNPJ', { headers }),
        ])
        const pacientesData = await pacientesResponse.json()
        const doutoresData = await doutoresResponse.json()
        if (!pacientesResponse.ok || !doutoresResponse.ok) {
          throw new Error(pacientesData.message || doutoresData.message || 'Não foi possível carregar pacientes e doutores.')
        }
        setPacientes(pacientesData.pacientes ?? [])
        setDoutores(doutoresData.doutores ?? [])
      } catch (error) {
        setErro(error instanceof Error ? error.message : 'Não foi possível carregar pacientes e doutores.')
      } finally {
        setCarregandoPessoas(false)
      }
    }

    carregarPessoas()
  }, [token])

  async function handleSalvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro('')
    if (!user?.clinica_cnpj) {
      setErro('Não foi possível identificar a clínica desta conta.')
      return
    }
    setSalvando(true)
    try {
      const resposta = await fetch('http://localhost:5000/agenda', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          pacientes_idpacientes: Number(pacienteId),
          doutor_iddoutor: Number(doutorId),
          datahora: dataHora,
          clinica_cnpj: user.clinica_cnpj,
        })
      })

      if (!resposta.ok) {
        const texto = await resposta.text()
        let erro
        try {
          erro = texto ? JSON.parse(texto) : {}
        } catch {
          erro = { message: texto }
        }
        setErro(erro.message || erro.error || 'Erro ao criar agendamento')
        return
      }

      aoSalvar()
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao criar agendamento')
    } finally {
      setSalvando(false)
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
        aria-labelledby="nova-consulta-titulo"
        aria-modal="true"
        className="w-full max-w-lg rounded-[10px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)] md:p-8"
        role="dialog"
      >
        <h2 id="nova-consulta-titulo" className="mb-6 text-2xl font-bold text-[#4f7161]">
          Nova Consulta
        </h2>
        <form className="space-y-4" onSubmit={handleSalvar}>
          <SearchablePersonSelect
            id="consulta-paciente"
            label="Paciente"
            loading={carregandoPessoas}
            options={pacientes.map((paciente) => ({ id: paciente.idpacientes!, nome: paciente.nome }))}
            placeholder="Buscar paciente pelo nome"
            value={pacienteId}
            onChange={setPacienteId}
          />
          <SearchablePersonSelect
            id="consulta-doutor"
            label="Doutor(a)"
            loading={carregandoPessoas}
            options={doutores.map((doutor) => ({ id: doutor.iddoutor!, nome: doutor.nome }))}
            placeholder="Buscar doutor pelo nome"
            value={doutorId}
            onChange={setDoutorId}
          />
          <div className="space-y-1">
            <label className="block text-sm text-gray-600" htmlFor="consulta-data">Data e Hora</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-[#4f7161] focus:outline-none focus:ring-2 focus:ring-[#4f7161]/20"
              id="consulta-data"
              required
              type="datetime-local"
              value={dataHora}
              onChange={(event) => setDataHora(event.target.value)}
            />
          </div>
          {erro && <p className="text-sm text-red-700" role="alert">{erro}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              type="button"
              onClick={aoFechar}
            >
              Cancelar
            </button>
            <button
              className="rounded-lg bg-[#4f7161] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3f5c4f] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={salvando || carregandoPessoas || pacientes.length === 0 || doutores.length === 0}
              type="submit"
            >
              {salvando ? 'Salvando...' : 'Salvar consulta'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

function SearchablePersonSelect({
  id,
  label,
  loading,
  options,
  placeholder,
  value,
  onChange,
}: {
  id: string
  label: string
  loading: boolean
  options: Array<{ id: number; nome: string }>
  placeholder: string
  value: string
  onChange: (value: string) => void
}) {
  const [query, setQuery] = useState('')
  const [aberto, setAberto] = useState(false)
  const selecionado = options.find((option) => String(option.id) === value)
  const filtradas = options.filter((option) => option.nome.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')))

  return (
    <div className="space-y-1">
      <label className="block text-sm text-gray-600" htmlFor={id}>{label}</label>
      <div className="relative">
        <input
          autoComplete="off"
          className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-[#4f7161] focus:outline-none focus:ring-2 focus:ring-[#4f7161]/20"
          id={id}
          placeholder={selecionado?.nome ?? placeholder}
          role="combobox"
          aria-expanded={aberto}
          aria-controls={`${id}-options`}
          aria-autocomplete="list"
          required={!value}
          value={query}
          onFocus={() => setAberto(true)}
          onChange={(event) => {
            setQuery(event.target.value)
            setAberto(true)
            if (value) onChange('')
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setAberto(false)
            if (event.key === 'Enter' && aberto && filtradas.length === 1) {
              event.preventDefault()
              onChange(String(filtradas[0].id))
              setQuery('')
              setAberto(false)
            }
          }}
        />
        {aberto && (
          <ul
            className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
            id={`${id}-options`}
            role="listbox"
          >
            {loading ? (
              <li className="px-3 py-2 text-sm text-gray-500">Carregando...</li>
            ) : filtradas.length ? filtradas.map((option) => (
              <li key={option.id} role="option" aria-selected={String(option.id) === value}>
                <button
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-[#edf4ef] focus:bg-[#edf4ef] focus:outline-none"
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onChange(String(option.id))
                    setQuery('')
                    setAberto(false)
                  }}
                >
                  {option.nome}
                </button>
              </li>
            )) : (
              <li className="px-3 py-2 text-sm text-gray-500">Nenhum resultado encontrado</li>
            )}
          </ul>
        )}
      </div>
      {selecionado && !aberto && <p className="text-xs text-[#4f7161]">Selecionado: {selecionado.nome}</p>}
    </div>
  )
}