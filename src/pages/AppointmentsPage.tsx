import type { Page } from '../types'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { Agenda } from '../components/Agenda/AgendaWidget'

export function AppointmentsPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <Sidebar active="agendamentos" onNavigate={onNavigate}>
      <div className="-m-6 min-h-screen bg-[#a4c2aa] p-4 md:-m-10 md:p-6">
        <section>
          <div className="rounded-lg bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <Agenda permitirNavegacao />
          </div>
        </section>
      </div>
    </Sidebar>
  )
}