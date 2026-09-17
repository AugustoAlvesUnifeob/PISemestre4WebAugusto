import { useState, useEffect, useEffectEvent } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import NovaConsultaModal from './NovaConsultaModal'
import DetalhesConsultaModal from './DetalhesConsultaModal'

export default function AgendaWidget(){
    const [eventos, setEventos] = useState([])

    // Como combinado gente, os agendamentos serão feitos através de
    // um botão que abre uma janela na tela para inserir as informacoes

    const [modalNovaAberto, setModalNovaAberto] = useState(false)

    const [eventoSelecionado, setEventoSelecionado] = useState(null)

    useEffect(() => {
        buscarAgendamentos()
    }, [])

    function buscarAgendamentos() {
        fetch('http://localhost:3000/api/agenda')
        .then(res => res.json())
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
            <button onClick={() => setModalNovaAberto(true)}> +Nova Consulta </button>

            <FullCalendar
                plugins={[timeGruidPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                eventClick={handleEventClick}
                events={eventos}
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