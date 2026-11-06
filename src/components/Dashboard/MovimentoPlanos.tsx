import { useEffect, useState } from 'react'
import { API_URL, fetchWithToken, messageFrom, readResponse } from '../../services/api'

type MovimentoPlano = {
  idplano: number
  descricao: string
  movimento: number[]
}

type MovimentoResponse = {
  meses: string[]
  planos: MovimentoPlano[]
  message?: string
  errors?: { msg?: string }[]
}

function abreviarMes(mes: string) {
  const [ano, numeroMes] = mes.split('-').map(Number)
  return new Date(Date.UTC(ano, numeroMes - 1, 1)).toLocaleDateString('pt-BR', {
    month: 'short',
    timeZone: 'UTC',
  })
}

function GraficoMovimento({ plano, meses }: { plano: MovimentoPlano; meses: string[] }) {
  const maiorValor = Math.max(0, ...plano.movimento)
  const escala = maiorValor || 1
  const esquerda = 34
  const direita = 350
  const topo = 18
  const base = 142
  const marcas = [...new Set([0, Math.ceil(escala / 2), escala])]
  const pontos = plano.movimento.map((valor, indice) => ({
    x: esquerda + (direita - esquerda) * (indice / Math.max(plano.movimento.length - 1, 1)),
    y: base - (valor / escala) * (base - topo),
    valor,
  }))
  const linha = pontos.map(({ x, y }) => `${x},${y}`).join(' ')

  return (
    <article className="rounded-lg bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <h3 className="mb-1 text-sm font-semibold text-[#4f7161]">{plano.descricao}</h3>
      <p className="mb-2 text-xs text-gray-500">Agendamentos por mês · últimos 6 meses</p>
      <svg
        aria-label={`Agendamentos por mês para o plano ${plano.descricao}`}
        className="h-auto w-full"
        role="img"
        viewBox="0 0 370 184"
      >
        {marcas.map((valor) => {
          const y = base - (valor / escala) * (base - topo)
          return (
            <g key={valor}>
              <line x1={esquerda} x2={direita} y1={y} y2={y} stroke="#e1e8e3" strokeDasharray="3 4" />
              <text x="27" y={y + 4} textAnchor="end" fill="#6b7280" fontSize="10">{valor}</text>
            </g>
          )
        })}
        <polyline
          fill="none"
          points={linha}
          stroke="#4f7161"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        {pontos.map(({ x, y, valor }, indice) => (
          <g key={`${meses[indice]}-${indice}`}>
            <circle cx={x} cy={y} r="4" fill="#4f7161">
              <title>{`${abreviarMes(meses[indice])}: ${valor} agendamentos`}</title>
            </circle>
            <text x={x} y="169" textAnchor="middle" fill="#6b7280" fontSize="10">
              {abreviarMes(meses[indice])}
            </text>
          </g>
        ))}
      </svg>
      {maiorValor === 0 && (
        <p className="text-center text-xs text-gray-500">Nenhum agendamento neste período.</p>
      )}
    </article>
  )
}

export function MovimentoPlanos() {
  const [dados, setDados] = useState<MovimentoResponse | null>(null)
  const [erro, setErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function carregarMovimento() {
      setErro('')
      try {
        const response = await fetchWithToken(`${API_URL}/agenda/movimento-por-plano`, {
          signal: controller.signal,
        })
        const resultado = await readResponse(response) as MovimentoResponse
        if (!response.ok) throw new Error(messageFrom(resultado))
        if (!Array.isArray(resultado.meses) || !Array.isArray(resultado.planos)) {
          throw new Error('A API retornou dados de movimento inválidos.')
        }
        setDados(resultado)
      } catch (error) {
        if (controller.signal.aborted) return
        setErro(error instanceof Error ? error.message : 'Não foi possível carregar o movimento.')
      }
    }

    void carregarMovimento()
    return () => controller.abort()
  }, [tentativa])

  if (erro) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
        <p>{erro}</p>
        <button
          className="mt-2 font-semibold underline"
          onClick={() => setTentativa((atual) => atual + 1)}
          type="button"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  if (!dados) {
    return <p className="rounded-lg bg-white p-5 text-center text-sm text-gray-500">Carregando movimento...</p>
  }

  if (!dados.planos.length) {
    return <p className="rounded-lg bg-white p-5 text-center text-sm text-gray-500">Nenhum plano cadastrado ainda.</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {dados.planos.map((plano) => (
        <GraficoMovimento key={plano.idplano} plano={plano} meses={dados.meses} />
      ))}
    </div>
  )
}
