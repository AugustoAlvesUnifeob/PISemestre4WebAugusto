import { createContext, useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../../context/AuthContext'
import type { Page } from '../../types'

type TutorialContextType = {
  abrirTutorial: () => void
}

export const TutorialContext = createContext<TutorialContextType | null>(null)

export function useTutorial() {
  return useContext(TutorialContext)
}

type Etapa = {
  titulo: string
  descricao: string
  pagina: Page
  alvo?: string
  apenasAdmin?: boolean
}

// Cada etapa informa o texto, a página e o elemento que será destacado
const todasEtapas: Etapa[] = [
  {
    titulo: 'Bem-vindo ao EasyClinic!',
    descricao: 'Vamos conhecer as principais funcionalidades do sistema. Você não precisa cadastrar ou alterar nenhum dado durante o tutorial.',
    pagina: 'inicio',
  },
  {
    titulo: 'Menu lateral',
    descricao: 'Use este menu para navegar pelas páginas do EasyClinic.',
    pagina: 'inicio',
    alvo: '[data-tour="menu-lateral"]',
  },
  {
    titulo: 'Início',
    descricao: 'Na página inicial você encontra a agenda da semana e o painel de movimento da clínica.',
    pagina: 'inicio',
    alvo: '[data-tour="menu-inicio"]',
  },
  {
    titulo: 'Agendamentos',
    descricao: 'Acompanhe as consultas pelo calendário, use as setas para navegar entre as semanas e o botão Semana atual para voltar à semana de hoje. Clique em uma consulta para ver seus detalhes.',
    pagina: 'agendamentos',
    alvo: '[data-tour="menu-agendamentos"]',
  },
  {
    titulo: 'Nova consulta',
    descricao: 'Use este botão para criar uma consulta. Escolha o paciente, o profissional, o serviço, a data e o horário. Se precisar, utilize os atalhos para cadastrar novos pacientes ou profissionais.',
    pagina: 'agendamentos',
    alvo: '[data-tour="nova-consulta"]',
  },
  {
    titulo: 'Pacientes',
    descricao: 'Cadastre, pesquise e edite pacientes. Os ícones da lista permitem acessar a anamnese e o histórico de consultas.',
    pagina: 'pacientes',
    alvo: '[data-tour="menu-pacientes"]',
  },
  {
    titulo: 'Profissionais',
    descricao: 'Cadastre e gerencie os profissionais da clínica. Eles ficam disponíveis na hora de criar um agendamento.',
    pagina: 'profissionais',
    alvo: '[data-tour="menu-profissionais"]',
  },
  {
    titulo: 'Tags',
    descricao: 'As tags ajudam a identificar e organizar os pacientes de acordo com as necessidades da clínica.',
    pagina: 'tags',
    alvo: '[data-tour="menu-tags"]',
  },
  {
    titulo: 'Planos',
    descricao: 'Cadastre e gerencie os planos que podem ser vinculados aos pacientes, incluindo seus descontos.',
    pagina: 'planos',
    alvo: '[data-tour="menu-planos"]',
  },
  {
    titulo: 'Serviços',
    descricao: 'Cadastre os serviços e seus valores. Depois, eles podem ser selecionados nos agendamentos.',
    pagina: 'servicos',
    alvo: '[data-tour="menu-servicos"]',
  },
  {
    titulo: 'Cadastrar usuário',
    descricao: 'Usuários administradores podem cadastrar outras pessoas para utilizar o EasyClinic.',
    pagina: 'inicio',
    alvo: '[data-tour="menu-cadastro-usuario"]',
    apenasAdmin: true,
  },
  {
    titulo: 'Documentos',
    descricao: 'Neste menu você encontra os formulários de receita, atestado, laudo e relatório financeiro.',
    pagina: 'inicio',
    alvo: '[data-tour="menu-documentos"]',
  },
  {
    titulo: 'Editar usuário',
    descricao: 'O ícone de lápis, ao lado do seu nome, dá acesso à edição das informações do usuário.',
    pagina: 'inicio',
    alvo: '[data-tour="menu-editar-usuario"]',
  },
  {
    titulo: 'Como usar o EasyClinic',
    descricao: 'Se precisar rever essas explicações, clique nesta opção do menu lateral para iniciar o tutorial novamente.',
    pagina: 'inicio',
    alvo: '[data-tour="menu-tutorial"]',
  },
  {
    titulo: 'Sair',
    descricao: 'Clique em Sair para encerrar sua sessão e voltar à tela de login.',
    pagina: 'inicio',
    alvo: '[data-tour="menu-sair"]',
  },
]

type AreaDestacada = {
  top: number
  left: number
  width: number
  height: number
}

export function GuidedTour({
  paginaAtual,
  navegar,
  aoEncerrar,
}: {
  paginaAtual: Page | 'notFound'
  navegar: (pagina: Page) => void
  aoEncerrar: () => void
}) {
  const { user } = useAuth()

  const etapas = todasEtapas.filter(
    (etapa) => !etapa.apenasAdmin || user?.tipo === 1
  )

  const [indice, setIndice] = useState(0)
  const [area, setArea] = useState<AreaDestacada | null>(null)
  const etapa = etapas[indice]

  useEffect(() => {
    // Localiza o elemento destacado e acompanha sua posição na tela
    let primeiroElemento: HTMLElement | null = null

    const atualizar = () => {
      const elemento = etapa.alvo
        ? document.querySelector<HTMLElement>(etapa.alvo)
        : null

      if (!elemento) {
        setArea(null)
        return
      }

      if (primeiroElemento !== elemento) {
        primeiroElemento = elemento

        elemento.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
        })
      }

      const posicao = elemento.getBoundingClientRect()

      if (posicao.width === 0 || posicao.height === 0) {
        setArea(null)
        return
      }

      setArea((anterior) => {
        const nova = {
          top: Math.max(4, posicao.top - 4),
          left: Math.max(4, posicao.left - 4),
          width: posicao.width + 8,
          height: posicao.height + 8,
        }

        if (
          anterior &&
          anterior.top === nova.top &&
          anterior.left === nova.left &&
          anterior.width === nova.width &&
          anterior.height === nova.height
        ) {
          return anterior
        }

        return nova
      })
    }

    atualizar()

    const intervalo = window.setInterval(atualizar, 250)

    window.addEventListener('resize', atualizar)
    window.addEventListener('scroll', atualizar, true)

    return () => {
      window.clearInterval(intervalo)
      window.removeEventListener('resize', atualizar)
      window.removeEventListener('scroll', atualizar, true)
    }
  }, [indice, etapa.alvo, paginaAtual])

  useEffect(() => {
    const aoTeclar = (event: KeyboardEvent) => {
      if (event.key === 'Escape') aoEncerrar()
    }

    window.addEventListener('keydown', aoTeclar)

    return () => window.removeEventListener('keydown', aoTeclar)
  }, [aoEncerrar])

  function irPara(proximoIndice: number) {
    if (proximoIndice < 0 || proximoIndice >= etapas.length) return

    const proxima = etapas[proximoIndice]

    // Limpa o destaque antigo antes de procurar o próximo elemento.
    setArea(null)

    if (paginaAtual !== proxima.pagina) {
      navegar(proxima.pagina)
    }

    setIndice(proximoIndice)
  }

  const larguraPopup = Math.min(370, window.innerWidth - 24)
  const alturaEstimada = 265
  const esquerda = area &&
    window.innerWidth - (area.left + area.width) >= larguraPopup + 24
      ? area.left + area.width + 14
      : area && area.left >= larguraPopup + 24
        ? area.left - larguraPopup - 14
        : (window.innerWidth - larguraPopup) / 2

  const topo = area
    ? Math.max(
        12,
        Math.min(
          area.top - 12,
          window.innerHeight - alturaEstimada - 12
        )
      )
    : Math.max(
        12,
        (window.innerHeight - alturaEstimada) / 2
      )

  const mostrarPopup = !etapa.alvo || area !== null

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="presentation">
      {/* Escurece o restante da tela enquanto o tutorial está aberto. */}
      <div
        className="absolute inset-0"
        style={{
          background: area
            ? 'transparent'
            : 'rgba(0,0,0,0.60)',
        }}
      />

      {area && (
        <div
          className="pointer-events-none fixed rounded-lg border-[3px] border-[#a4d2b6]"
          style={{
            ...area,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.60)',
          }}
        />
      )}

      {mostrarPopup && (
        <section
          aria-labelledby="titulo-tutorial"
          aria-modal="true"
          className="fixed z-[101] max-h-[85vh] overflow-y-auto rounded-xl bg-white p-5 shadow-2xl"
          role="dialog"
          style={{
            width: larguraPopup,
            top: topo,
            left: Math.max(
              12,
              Math.min(
                esquerda,
                window.innerWidth - larguraPopup - 12
              )
            ),
          }}
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#4f7161]">
              Passo {indice + 1} de {etapas.length}
            </span>

            <button
              aria-label="Fechar tutorial"
              className="rounded px-2 text-xl text-gray-500 hover:bg-gray-100"
              onClick={aoEncerrar}
              type="button"
            >
              ×
            </button>
          </div>

          <h2
            className="mb-2 text-xl font-bold text-[#4f7161]"
            id="titulo-tutorial"
          >
            {etapa.titulo}
          </h2>

          <p className="mb-5 text-sm leading-relaxed text-gray-700">
            {etapa.descricao}
          </p>

          <div
            className="mb-4 flex gap-1"
            aria-label="Progresso do tutorial"
          >
            {etapas.map((item, posicao) => (
              <span
                key={item.titulo}
                className={`h-1.5 flex-1 rounded-full ${
                  posicao <= indice
                    ? 'bg-[#4f7161]'
                    : 'bg-[#e2e9e4]'
                }`}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              className="text-sm text-gray-500 hover:underline"
              onClick={aoEncerrar}
              type="button"
            >
              Pular tutorial
            </button>

            <div className="flex gap-2">
              {indice > 0 && (
                <button
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => irPara(indice - 1)}
                  type="button"
                >
                  Voltar
                </button>
              )}

              <button
                className="rounded-lg bg-[#4f7161] px-3 py-2 text-sm font-semibold text-white hover:bg-[#3f5c4f]"
                onClick={() =>
                  indice === etapas.length - 1
                    ? aoEncerrar()
                    : irPara(indice + 1)
                }
                type="button"
              >
                {indice === etapas.length - 1
                  ? 'Concluir'
                  : 'Próximo'}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>,
    document.body,
  )
}