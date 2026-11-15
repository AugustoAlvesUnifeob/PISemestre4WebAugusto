import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import type { Page } from '../../types'
import { useTutorial } from '../Tutorial/GuidedTour'

const documentLinks: {
    label: string
    page: 'receita' | 'atestado' | 'laudo' | 'financeiro'
}[] = [
    { label: 'Receita', page: 'receita' },
    { label: 'Atestado', page: 'atestado' },
    { label: 'Laudo', page: 'laudo' },
    { label: 'Financeiro', page: 'financeiro' },
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
        const tutorial = useTutorial()
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
                            data-tour="menu-editar-usuario"
                            onClick={() => onNavigate('editarUsuario')}
                            className="cursor-pointer"
                            title="Editar usuário"
                        >
                             ✎
                        </button>
                    </div>
                </div>

                <nav
                    data-tour="menu-lateral"
                    className="bg-white px-4 py-5 md:min-h-0 md:flex-1 md:overflow-y-auto"
                >
                    <ul className="flex flex-wrap gap-x-5 gap-y-3 md:block">

                        <li
                        className={`cursor-pointer rounded-full px-3 py-2 transition hover:bg-[#edf4f0] md:mb-4 ${active === 'inicio' ? 'bg-[#edf4f0] font-bold text-[#27463b]' : 'text-[#2d2d2d]'}`}
                        data-tour="menu-inicio"
                        onClick={() => onNavigate('inicio')}
                        >
                        Início
                        </li>

                        <li
                        className={`cursor-pointer rounded-full px-3 py-2 transition hover:bg-[#edf4f0] md:mb-4 ${active === 'agendamentos' ? 'bg-[#edf4f0] font-bold text-[#27463b]' : 'text-[#2d2d2d]'}`}
                        data-tour="menu-agendamentos"
                        onClick={() => onNavigate('agendamentos')}
                        >
                        Agendamentos
                        </li>

                        <li
                        className={`cursor-pointer rounded-full px-3 py-2 transition hover:bg-[#edf4f0] md:mb-4 ${active === 'pacientes' ? 'bg-[#edf4f0] font-bold text-[#27463b]' : 'text-[#2d2d2d]'}`}
                        data-tour="menu-pacientes"
                        onClick={() => onNavigate('pacientes')}
                        >
                        Pacientes
                        </li>

                        <li
                        className={`cursor-pointer rounded-full px-3 py-2 transition hover:bg-[#edf4f0] ${active === 'profissionais' ? 'bg-[#edf4f0] font-bold text-[#27463b]' : 'text-[#2d2d2d]'}`}
                        data-tour="menu-profissionais"
                        onClick={() => onNavigate('profissionais')}
                        >
                        Profissionais
                        </li>

                        <div className="my-4 h-px bg-[#dfe7e2]" />

                        <li
                        className={`cursor-pointer rounded-full px-3 py-2 transition hover:bg-[#edf4f0] md:mb-4 ${active === 'tags' ? 'bg-[#edf4f0] font-bold text-[#27463b]' : 'text-[#2d2d2d]'}`}
                        data-tour="menu-tags"
                        onClick={() => onNavigate('tags')}
                        >
                        Tags
                        </li>

                        <li
                        className={`cursor-pointer rounded-full px-3 py-2 transition hover:bg-[#edf4f0] md:mb-4 ${active === 'planos' ? 'bg-[#edf4f0] font-bold text-[#27463b]' : 'text-[#2d2d2d]'}`}
                        data-tour="menu-planos"
                        onClick={() => onNavigate('planos')}
                        >
                        Planos
                        </li>

                        <li
                        className={`cursor-pointer rounded-full px-3 py-2 transition hover:bg-[#edf4f0] md:mb-4 ${active === 'servicos' ? 'bg-[#edf4f0] font-bold text-[#27463b]' : 'text-[#2d2d2d]'}`}
                        data-tour="menu-servicos"
                        onClick={() => onNavigate('servicos')}
                        >
                        Serviços
                        </li>

                        {user?.tipo === 1 && (
                            <li
                                className={`cursor-pointer rounded-full px-3 py-2 transition hover:bg-[#edf4f0] md:mb-4 ${
                                    active === 'cadastroUsuario'
                                        ? 'bg-[#edf4f0] font-bold text-[#27463b]'
                                        : 'text-[#2d2d2d]'
                                }`}
                                data-tour="menu-cadastro-usuario"
                                onClick={() => onNavigate('cadastroUsuario')}
                            >
                                Cadastrar usuário
                            </li>
                        )}

                        <li className="relative md:mb-4">
                            <button
                                type="button"
                                aria-expanded={documentsOpen}
                                data-tour="menu-documentos"
                                aria-controls="sidebar-documents-menu"
                                onClick={() => setDocumentsOpen(!documentsOpen)}
                                className={`flex w-full cursor-pointer items-center justify-between rounded-full px-3 py-2 text-left transition hover:bg-[#edf4f0] ${
                                    active === 'receita' || active === 'atestado' || active === 'laudo' || active === 'financeiro'
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

                        {/* Ajuda disponível em todas as páginas do sistema. */}
                        <div className="my-4 h-px bg-[#dfe7e2]" />

                        <li>
                            <button
                                data-tour="menu-tutorial"
                                className="flex w-full items-center gap-2 rounded-full px-3 py-2 text-left text-[#2d2d2d] transition hover:bg-[#edf4f0]"
                                onClick={() => tutorial?.abrirTutorial()}
                                type="button"
                            >
                                <svg
                                    aria-hidden="true"
                                    className="h-5 w-5 text-[#4f7161]"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9.5 9a2.5 2.5 0 1 1 4.5 1.5c-1.2 1-2 1.4-2 3"
                                    />
                                    <path strokeLinecap="round" d="M12 17h.01" />
                                </svg>

                                <span>Como usar o EasyClinic</span>
                            </button>
                        </li>

                        <li>
                            <button
                                data-tour="menu-sair"
                                className="flex w-full items-center gap-2 rounded-full px-3 py-2 text-left text-[#2d2d2d] transition hover:bg-[#edf4f0]"
                                onClick={logout}
                                type="button"
                            >
                                <svg
                                    aria-hidden="true"
                                    className="h-5 w-5 text-[#4f7161]"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16 17l5-5-5-5M21 12H9"
                                    />
                                </svg>

                                <span>Sair</span>
                            </button>
                        </li>

                    </ul>
                </nav>

            </aside>

            <main className="min-w-0 flex-1 p-6 md:p-10">{children}</main>

            </div>
        )
}