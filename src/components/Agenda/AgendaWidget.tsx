import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import type { EventClickArg, EventInput } from '@fullcalendar/core'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import NovaConsultaModal from './NovaConsultaModal'
import DetalhesConsultaModal from './DetalhesConsultaModal'

type AgendamentoApi = {
    idagenda: number
    pacientes_idpacientes: number
    datahora: string
    doutor_iddoutor: number
    status: string
}

type PessoaApi = {
    idpacientes?: number
    iddoutor?: number
    nome: string
}

type ConsultaSelecionada = {
    id: string
    titulo: string
    inicio: Date
    pacienteId: number
    doutorId: number
    pacienteNome: string
    doutorNome: string
    status: string
}

export function Agenda({ permitirNavegacao = false }: { permitirNavegacao?: boolean }){
    const [eventos, setEventos] = useState<EventInput[]>([])
    const inicioSemana = new Date()
    inicioSemana.setDate(inicioSemana.getDate() - ((inicioSemana.getDay() + 6) % 7))
    inicioSemana.setHours(0, 0, 0, 0)
    const fimSemana = new Date(inicioSemana)
    fimSemana.setDate(fimSemana.getDate() + 7)

    // Como combinado gente, os agendamentos serão feitos através de
    // um botão que abre uma janela na tela para inserir as informacoes

    const [modalNovaAberto, setModalNovaAberto] = useState(false)

    const [eventoSelecionado, setEventoSelecionado] = useState<ConsultaSelecionada | null>(null)

    useEffect(() => {
        buscarAgendamentos()
    }, [])

    async function buscarAgendamentos() {
        try {
            const token = localStorage.getItem('@App:token')
            const headers: Record<string, string> = token
                ? { Authorization: `Bearer ${token}` }
                : {}
            const [agendaResponse, pacientesResponse, doutoresResponse] = await Promise.all([
                fetch('http://localhost:5000/agenda'),
                fetch('http://localhost:5000/pacientes/listarByCNPJ', { headers }),
                fetch('http://localhost:5000/doutores/listarByCNPJ', { headers }),
            ])
            if (!agendaResponse.ok) throw new Error('Erro ao carregar agenda')

            const agendaData: { agendamentos: AgendamentoApi[] } = await agendaResponse.json()
            const pacientesData: { pacientes: PessoaApi[] } = pacientesResponse.ok
                ? await pacientesResponse.json()
                : { pacientes: [] }
            const doutoresData: { doutores: PessoaApi[] } = doutoresResponse.ok
                ? await doutoresResponse.json()
                : { doutores: [] }
            const nomesPacientes = new Map(pacientesData.pacientes.map(paciente => [paciente.idpacientes!, paciente.nome]))
            const nomesDoutores = new Map(doutoresData.doutores.map(doutor => [doutor.iddoutor!, doutor.nome]))

            setEventos(agendaData.agendamentos.map((agendamento) => {
                const pacienteNome = nomesPacientes.get(agendamento.pacientes_idpacientes) ?? `Paciente #${agendamento.pacientes_idpacientes}`
                const doutorNome = nomesDoutores.get(agendamento.doutor_iddoutor) ?? `Doutor #${agendamento.doutor_iddoutor}`
                return {
                    id: String(agendamento.idagenda),
                    title: `${pacienteNome} · ${doutorNome}`,
                    start: agendamento.datahora,
                    extendedProps: {
                        pacienteId: agendamento.pacientes_idpacientes,
                        doutorId: agendamento.doutor_iddoutor,
                        pacienteNome,
                        doutorNome,
                        status: agendamento.status,
                    },
                }
            }))
        } catch (error) {
            console.error(error)
        }
    }

    // quando a pessoa clica em um evento(agendamento)
    function handleEventClick(info: EventClickArg) {
        const detalhes = info.event.extendedProps as Pick<ConsultaSelecionada, 'pacienteId' | 'doutorId' | 'pacienteNome' | 'doutorNome' | 'status'>
        setEventoSelecionado({
            id: info.event.id,
            titulo: info.event.title,
            inicio: info.event.start ?? new Date(),
            ...detalhes
        })
    }
    
    return(
        <div>
            <button
                className="mb-3 rounded-md bg-[#4f7161] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#3f5c4f]"
                onClick={() => setModalNovaAberto(true)}
            >
                + Nova consulta
            </button>

            <div className="agenda-calendar overflow-x-auto">
                <FullCalendar
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    initialDate={new Date()}
                    firstDay={1}
                    validRange={permitirNavegacao ? undefined : { start: inicioSemana, end: fimSemana }}
                    headerToolbar={permitirNavegacao
                        ? { left: 'title', right: 'prev,next today' }
                        : false}
                    allDaySlot={false}
                    locale={ptBrLocale}
                    eventClick={handleEventClick}
                    events={eventos}
                    height="auto"
                    slotMinTime="06:00:00"
                    slotMaxTime="19:00:00"
                    slotEventOverlap={false}
                    eventContent={(info) => (
                        <div className="flex min-w-0 flex-col overflow-hidden px-1 py-0.5 text-xs leading-tight">
                            <span className="truncate font-semibold">{info.event.extendedProps.pacienteNome}</span>
                            <span className="truncate opacity-90">{info.event.extendedProps.doutorNome}</span>
                        </div>
                    )}
                />
            </div>

            {modalNovaAberto && (
                <NovaConsultaModal
                aoFechar={() => setModalNovaAberto(false)}
                aoSalvar={() => {
                    setModalNovaAberto(false)
                    buscarAgendamentos()
                }}
                />
            )}

            {eventoSelecionado && (
                <DetalhesConsultaModal
                    consulta={eventoSelecionado}
                    aoFechar={() => setEventoSelecionado(null)}
                    aoExcluir={() => {
                        setEventoSelecionado(null)
                        buscarAgendamentos()
                    }}
                />
            )}

        
        </div>
    )
}