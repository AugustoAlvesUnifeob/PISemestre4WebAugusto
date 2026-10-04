import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import NovaConsultaModal from '.Agenda/NovaConsultaModal'
import DetalhesConsultaModal from './DetalhesConsultaModal'

export function Agenda(){
    const [eventos, setEventos] = useState([])

    // Como combinado gente, os agendamentos serão feitos através de
    // um botão que abre uma janela na tela para inserir as informacoes

    const [modalNovaAberto, setModalNovaAberto] = useState(false)

    const [eventoSelecionado, setEventoSelecionado] = useState(null)

    useEffect(() => {
        buscarAgendamentos()
    }, [])

    function buscarAgendamentos() {
        fetch('http://localhost:5000/agenda')
        .then(async res => {
            const texto = await res.text()
            let data
            try {
                data = texto ? JSON.parse(texto) : {}
            } catch {
                throw new Error('Resposta inválida da API')
            }
            if (!res.ok) throw new Error(data.message || 'Erro ao carregar agenda')
            return data
        })
        .then(data => {
            const formatados = data.agendamentos.map(a => ({
                id: a.idagenda,
                title: `Paciente #${a.pacientes_idpacientes}`,
                start: a.datahora,
                extendedProps:{
                    pacienteId: a.pacientes_idpacientes,
                    doutorId: a.doutor_iddoutor,
                    status: a.status
                }
            }))
            setEventos(formatados)
        })
        .catch(error => console.error(error))
    }

    // quando a pessoa clica em um evento(agendamento)
    function handleEventClick(info) {
        setEventoSelecionado({
            id: info.event.id,
            titulo: info.event.title,
            inicio: info.event.start,
            ...info.event.extendedProps
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

            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                locale={ptBrLocale}
                eventClick={handleEventClick}
                events={eventos}
                height={240}
                slotMinTime="06:00:00"
                slotMaxTime="19:00:00"
            />

            {modalNovaAberto && (
                <NovaConsultaModal
                aofechar={() => setModalNovaAberto(false)}
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
                />
            )}

        
        </div>
    )
}