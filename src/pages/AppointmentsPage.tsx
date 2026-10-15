import type { Page } from '../types'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { Agenda } from '../components/Agenda/AgendaWidget'

export function AppointmentsPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <Sidebar active="agendamentos" onNavigate={onNavigate}>
      <div className="-m-6 min-h-screen bg-[#a4c2aa] p-6 md:-m-10 md:p-10">
        <h1 className="mb-5 text-2xl font-bold text-white">AGENDAMENTOS</h1>
        <section>
          <div className="rounded-lg bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <Agenda permitirNavegacao />
          </div>
        </section>
      </div>
    </Sidebar>
  )
}
