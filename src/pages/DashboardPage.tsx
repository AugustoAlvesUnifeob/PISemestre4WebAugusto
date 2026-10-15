import type { Page } from '../types'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { Agenda } from '../components/Agenda/AgendaWidget'

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
            <Agenda />
          </div>
        </section>

        {/*<section>
          <h2 className="mb-4 rounded-lg bg-[#5f846e] px-4 py-3 text-sm font-bold text-white">
            MOVIMENTO
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {indicators.map((indicator) => (
              <article key={indicator} className="rounded-lg bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                <h3 className="mb-3 text-sm font-semibold text-[#4f7161]">{indicator}</h3>
                <div
                  className="flex h-36 items-center justify-center rounded border border-[#e1e8e3] text-center text-sm text-gray-500"
                  style={{
                    backgroundImage: 'linear-gradient(#e8ede9 1px, transparent 1px), linear-gradient(90deg, #e8ede9 1px, transparent 1px)',
                    backgroundSize: '100% 25%, 20% 100%',
                  }}
                >
                  <span className="bg-white/90 px-3 py-1">Sem dados disponíveis</span>
                </div>
              </article>
            ))}
          </div>
        </section>*/}

      </div>
    </Sidebar>
  )
}
