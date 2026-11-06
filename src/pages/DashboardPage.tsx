import type { Page } from '../types'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { Agenda } from '../components/Agenda/AgendaWidget'
import { MovimentoPlanos } from '../components/Dashboard/MovimentoPlanos'

export function Dashboard({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <Sidebar active="inicio" onNavigate={onNavigate}>
      <div className="-m-6 min-h-screen bg-[#a4c2aa] p-6 md:-m-10 md:p-10">
        <h1 className="mb-5 text-2xl font-bold text-[#ffffff]">INÍCIO</h1>

        <section className="mb-6">
          <h2 className="rounded-t-lg bg-[#5f846e] px-4 py-3 text-sm font-bold text-white">
            AGENDA DA SEMANA
          </h2>
          <div className="rounded-b-lg bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <Agenda permitirNavegacao />
          </div>
        </section>

        <section>
          <h2 className="mb-4 rounded-lg bg-[#5f846e] px-4 py-3 text-sm font-bold text-white">
            MOVIMENTO
          </h2>
          <MovimentoPlanos />
        </section>

      </div>
    </Sidebar>
  )
}
