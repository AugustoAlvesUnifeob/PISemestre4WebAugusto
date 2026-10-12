import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'

type Page =
  | 'login'
  | 'cadastro'
  | 'inicio'
    | 'agendamentos'
  | 'pacientes'
  | 'profissionais'
  | 'tags'
  | 'planos'
  | 'cadastroPaciente'
  | 'cadastroProfissional'
  | 'cadastroTag'
  | 'cadastroPlano'
  | 'editarPaciente'
  | 'editarProfissional'
  | 'editarTag'
  | 'editarPlano'
  | 'receita'
  | 'atestado'
  | 'laudo'
    | 'editarUsuario'
;

const documentLinks: { label: string; page: 'receita' | 'atestado' | 'laudo' }[] = [
    { label: 'Receita', page: 'receita' },
    { label: 'Atestado', page: 'atestado' },
    { label: 'Laudo', page: 'laudo' },
]

export function Sidebar({
        active,
        onNavigate,
        children,
    } : {
        active: Page
        onNavigate: (page: Page) => void
        children: React.ReactNode
    }) {
        const { user, logout } = useAuth()
        const [documentsOpen, setDocumentsOpen] = useState(false)

        return (

            <div className="flex min-h-screen flex-col md:flex-row">

            <aside className="w-full bg-[#e7efe9] md:sticky md:top-0 md:flex md:h-screen md:min-h-0 md:w-[260px] md:shrink-0 md:flex-col">

                <div className="bg-[#4f7161] px-5 py-6 text-white md:py-8">
                    <h2 className="text-4xl font-bold">EasyClinic</h2>

                    <div className="flex items-center gap-2">
                         <h2 className="text-1xl font-bold">
                            Bem-vindo, {user?.usuario}!
                        </h2>

                        <button
                            //Nao está implementado isso ainda
                            onClick={() => onNavigate('editarUsuario')}
                            className="cursor-pointer"
                            title="Editar usuário"
                        >
                             ✎
                        </button>
                    </div>
                </div>

                <nav className="bg-white px-4 py-5 md:min-h-0 md:flex-1 md:overflow-y-auto">
                    <ul className="flex flex-wrap gap-x-5 gap-y-3 md:block">
                        
                        <li
                        className={`cursor-pointer rounded-full px-3 py-2 transition hover:bg-[#edf4f0] md:mb-4 ${active === 'inicio' ? 'bg-[#edf4f0] font-bold text-[#27463b]' : 'text-[#2d2d2d]'}`}
                        onClick={() => onNavigate('inicio')}
                        >
                        Início
                        </li>

                        <li
                        className={`cursor-pointer rounded-full px-3 py-2 transition hover:bg-[#edf4f0] md:mb-4 ${active === 'agendamentos' ? 'bg-[#edf4f0] font-bold text-[#27463b]' : 'text-[#2d2d2d]'}`}
                        onClick={() => onNavigate('agendamentos')}
                        >
                        Agendamentos
                        </li>
                        
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

                        <li
                        className={`cursor-pointer rounded-full px-3 py-2 transition hover:bg-[#edf4f0] md:mb-4 ${active === 'planos' ? 'bg-[#edf4f0] font-bold text-[#27463b]' : 'text-[#2d2d2d]'}`}
                        onClick={() => onNavigate('planos')}
                        >
                        Planos
                        </li>

                        <li className="relative md:mb-4">
                            <button
                                type="button"
                                aria-expanded={documentsOpen}
                                aria-controls="sidebar-documents-menu"
                                onClick={() => setDocumentsOpen(!documentsOpen)}
                                className={`flex w-full cursor-pointer items-center justify-between rounded-full px-3 py-2 text-left transition hover:bg-[#edf4f0] ${
                                    active === 'receita' || active === 'atestado' || active === 'laudo'
                                        ? 'bg-[#edf4f0] font-bold text-[#27463b]'
                                        : 'text-[#2d2d2d]'
                                }`}
                            >
                                <span>Documentos</span>
                                <svg
                                    className={`ml-2 h-4 w-4 transition-transform ${documentsOpen ? 'rotate-180' : ''}`}
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
                                </svg>
                            </button>
                            {documentsOpen && (
                                <ul
                                    id="sidebar-documents-menu"
                                    className="absolute left-0 top-full z-10 mt-1 min-w-44 rounded-xl border border-[#dfe7e2] bg-white p-2 text-sm shadow-lg"
                                >
                                    {documentLinks.map((documentType) => (
                                        <li key={documentType.page}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDocumentsOpen(false)
                                                    onNavigate(documentType.page)
                                                }}
                                                className={`w-full rounded-lg px-3 py-2 text-left transition hover:bg-[#edf4f0] ${
                                                    active === documentType.page
                                                        ? 'font-bold text-[#27463b]'
                                                        : 'text-[#2d2d2d]'
                                                }`}
                                            >
                                                {documentType.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>

                        <li
                        className="cursor-pointer rounded-full px-3 py-2 text-[#2d2d2d] transition hover:bg-[#edf4f0] md:mt-8"
                        onClick={logout}
                        >
                        Sair
                        </li>


                    </ul>
                </nav>

            </aside>

            <main className="min-w-0 flex-1 p-6 md:p-10">{children}</main>

            </div>
        )

}
