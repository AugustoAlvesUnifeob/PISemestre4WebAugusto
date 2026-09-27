import { useAuth } from '../../context/AuthContext'

type Page =
  | 'login'
  | 'cadastro'
  | 'inicio'
  | 'pacientes'
  | 'profissionais'
  | 'tags'
  | 'planos'
  | 'cadastroPaciente'
  | 'cadastroProfissional'
  | 'cadastroTag'
  | 'cadastroPlano'
;

export function Sidebar({
        active,
        onNavigate,
        children,
    } : {
        active: Page
        onNavigate: (page: Page) => void
        children: React.ReactNode
    }) {
        const { user } = useAuth()

        return (

            <div className="flex min-h-screen flex-col md:flex-row">

            <aside className="w-full bg-[#e7efe9] md:min-h-screen md:w-[260px] md:shrink-0">

                <div className="bg-[#4f7161] px-5 py-6 text-white md:py-8">
                    <h2 className="text-4xl font-bold">EasyClinic</h2>
                    <h2 className="text-1xl font-bold">Bem-vindo, {user?.usuario}!</h2>
                </div>

                <nav className="bg-white px-4 py-5 md:min-h-[calc(100vh-120px)]">
                    <ul className="flex flex-wrap gap-x-5 gap-y-3 md:block">
                        
                        <li
                        className={`cursor-pointer rounded-full px-3 py-2 transition hover:bg-[#edf4f0] md:mb-4 ${active === 'inicio' ? 'bg-[#edf4f0] font-bold text-[#27463b]' : 'text-[#2d2d2d]'}`}
                        onClick={() => onNavigate('inicio')}
                        >
                        Início
                        </li>

                        <li className="cursor-pointer rounded-full px-3 py-2 text-[#2d2d2d] transition hover:bg-[#edf4f0] md:mb-4" onClick={() => onNavigate('inicio')}>Agendamentos</li>
                        
                        <li
                        className={`cursor-pointer rounded-full px-3 py-2 transition hover:bg-[#edf4f0] md:mb-4 ${active === 'pacientes' ? 'bg-[#edf4f0] font-bold text-[#27463b]' : 'text-[#2d2d2d]'}`}
                        onClick={() => onNavigate('pacientes')}
                        >
                        Pacientes
                        </li>

                        <li
                        className={`cursor-pointer rounded-full px-3 py-2 transition hover:bg-[#edf4f0] ${active === 'profissionais' ? 'bg-[#edf4f0] font-bold text-[#27463b]' : 'text-[#2d2d2d]'}`}
                        onClick={() => onNavigate('profissionais')}
                        >
                        Profissionais
                        </li>

                        <div className="my-4 h-px bg-[#dfe7e2]" />

                        <li 
                        className={`cursor-pointer rounded-full px-3 py-2 transition hover:bg-[#edf4f0] md:mb-4 ${active === 'tags' ? 'bg-[#edf4f0] font-bold text-[#27463b]' : 'text-[#2d2d2d]'}`}
                        onClick={() => onNavigate('tags')}
                        >
                        Tags
                        </li>

                        <li className="cursor-pointer rounded-full px-3 py-2 text-[#2d2d2d] transition hover:bg-[#edf4f0] md:mb-4" onClick={() => onNavigate('inicio')}>Planos</li>

                        <li className="cursor-pointer rounded-full px-3 py-2 text-[#2d2d2d] transition hover:bg-[#edf4f0] md:mb-4" onClick={() => onNavigate('inicio')}>Documentos</li>

                    </ul>
                </nav>

            </aside>

            <main className="min-w-0 flex-1 p-6 md:p-10">{children}</main>

            </div>
        )

}