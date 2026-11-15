// --------------------
import { useEffect, useState } from 'react';
import './index.css';
import { useAuth } from './context/AuthContext'

// --------------------

import type {
  Page,
  RecordItem,
  TagItem,
  PlanoItem,
  ServicoItem,
  EditingItem
} from './types'

import { Login } from './pages/LoginPage'
import { Register } from './pages/RegisterPage'
import { Dashboard } from './pages/DashboardPage'
import { AppointmentsPage } from './pages/AppointmentsPage'
import { EditUserPage } from './pages/EditUserPage'
import { RecordsPage } from './pages/RecordsPage'
import { TagsPage } from './pages/TagsPage'
import { PlanosPage } from './pages/PlanosPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { Sidebar } from './components/Sidebar/Sidebar'
import { GuidedTour, TutorialContext } from './components/Tutorial/GuidedTour'
import { ServicosPage } from './pages/ServicosPage'
import { PatientForm } from './components/forms/PatientForm'
import { ProfessionalForm } from './components/forms/ProfessionalForm'
import { TagForm } from './components/forms/TagForm'
import { PlanoForm } from './components/forms/PlanoForm'
import { ServicoForm } from './components/forms/ServicoForm'
import { UsuarioForm } from './components/forms/UsuarioForm'
import { ReceitaForm, AtestadoForm, LaudoForm, FinanceiroForm } from './components/forms/DocumentForms'

const protectedPages: Page[] = [
  'inicio',
  'agendamentos',
  'pacientes',
  'profissionais',
  'tags',
  'planos',
  'servicos',
  'cadastroUsuario',
  'cadastroPaciente',
  'cadastroProfissional',
  'cadastroTag',
  'cadastroPlano',
  'cadastroServico',
  'editarPaciente',
  'editarProfissional',
  'editarTag',
  'editarPlano',
  'editarServico',
  'receita',
  'atestado',
  'laudo',
  'financeiro',
  'editarUsuario'
]

const validPages: Page[] = ['login', 'cadastro', ...protectedPages]

// Ao recarregar uma tela de edição, volta para a lista correspondente.
const editReturnPages: Partial<Record<Page, Page>> = {
  editarPaciente: 'pacientes',
  editarProfissional: 'profissionais',
  editarTag: 'tags',
  editarPlano: 'planos',
  editarServico: 'servicos'
}

function getPageFromUrl(): Page | 'notFound' {
  const path = window.location.pathname.replace(/^\/|\/$/g, '')

  if (!path || path === 'index.html') {
    return localStorage.getItem('@App:token') ? 'inicio' : 'login'
  }

  return validPages.includes(path as Page) ? path as Page : 'notFound'
}

function App() {
  // useState guarda dados que mudam durante a interação e causam nova renderização.
  const { token, user, hasPermission } = useAuth()
  const [page, setPage] = useState<Page | 'notFound'>(getPageFromUrl)
  const [notice, setNotice] = useState('')
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null)
  const [tutorialAberto, setTutorialAberto] = useState(false)

  const chaveTutorial = user
    ? `@App:tutorial-concluido:v1:${user.clinica_cnpj}:${user.idusuario}`
    : null

  // Abre automaticamente uma única vez por usuário, neste navegador.
  useEffect(() => {
    if (
      !token ||
      !chaveTutorial ||
      page === 'login' ||
      page === 'cadastro' ||
      page === 'notFound'
    ) {
      return
    }

    if (!localStorage.getItem(chaveTutorial)) {
      setTutorialAberto(true)
    }
  }, [token, chaveTutorial, page])

  useEffect(() => {
    if (!token) setTutorialAberto(false)
  }, [token])

  const editReturnPage =
    page !== 'notFound' && !editingItem
      ? editReturnPages[page]
      : undefined

  useEffect(() => {
    if (!editReturnPage) return

    window.history.replaceState({}, '', `/${editReturnPage}`)
    setPage(editReturnPage)
  }, [editReturnPage])

  function changePage(nextPage: Page) {
    window.history.pushState(
      {},
      '',
      nextPage === 'inicio' ? '/' : `/${nextPage}`
    )
    setPage(nextPage)
  }

  useEffect(() => {
    const handlePopState = () => {
      setPage(getPageFromUrl())
      setEditingItem(null)
    }

    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // O componente pai controla a tela atual e passa esta função aos filhos via props.
  const goTo = (nextPage: Page) => {
    const hasStoredToken = Boolean(localStorage.getItem('@App:token'))

    if (
      !token &&
      !hasStoredToken &&
      protectedPages.includes(nextPage)
    ) {
      changePage('login')
      return
    }

    if (nextPage === 'cadastroUsuario' && !hasPermission(1)) {
      changePage(token || hasStoredToken ? 'inicio' : 'login')
      return
    }

    setNotice('')
    changePage(nextPage)
  }

  const isProtectedPage =
    page !== 'notFound' && protectedPages.includes(page)

  const visiblePage =
    !token && (page === 'notFound' || isProtectedPage)
      ? 'login'
      : page === 'cadastroUsuario' && !hasPermission(1)
        ? 'inicio'
        : editReturnPage ?? page

  const abrirTutorial = () => {
    goTo('inicio')
    setTutorialAberto(true)
  }

  const encerrarTutorial = () => {
    if (chaveTutorial) {
      localStorage.setItem(chaveTutorial, 'true')
    }

    setTutorialAberto(false)
  }

  const beginEdit = (
    nextPage: Extract<Page, `editar${string}`>,
    item: EditingItem
  ) => {
    setEditingItem(item)
    goTo(nextPage)
  }

  if (visiblePage === 'notFound') {
    return (
      <TutorialContext.Provider value={{ abrirTutorial }}>
        <Sidebar active="inicio" onNavigate={goTo}>
          <NotFoundPage onNavigate={goTo} />
        </Sidebar>
      </TutorialContext.Provider>
    )
  }

  return (
    <TutorialContext.Provider value={{ abrirTutorial }}>
      {visiblePage === 'login' && (
        <Login onNavigate={goTo} onNotice={setNotice} notice={notice} />
      )}

      {visiblePage === 'cadastro' && (
        <Register onNavigate={goTo} onNotice={setNotice} notice={notice} />
      )}

      {visiblePage === 'inicio' && (
        <Dashboard onNavigate={goTo} />
      )}

      {visiblePage === 'agendamentos' && (
        <AppointmentsPage onNavigate={goTo} />
      )}

      {visiblePage === 'editarUsuario' && (
        <EditUserPage onNavigate={goTo} />
      )}

      {visiblePage === 'cadastroUsuario' && (
        <UsuarioForm
          onNavigate={goTo}
          onNotice={setNotice}
          notice={notice}
        />
      )}

      {visiblePage === 'pacientes' && (
        <RecordsPage
          kind="pacientes"
          onNavigate={goTo}
          onEdit={(item) => beginEdit('editarPaciente', item)}
        />
      )}

      {visiblePage === 'profissionais' && (
        <RecordsPage
          kind="profissionais"
          onNavigate={goTo}
          onEdit={(item) => beginEdit('editarProfissional', item)}
        />
      )}

      {visiblePage === 'cadastroPaciente' && (
        <PatientForm
          onNavigate={goTo}
          onNotice={setNotice}
          notice={notice}
        />
      )}

      {visiblePage === 'editarPaciente' && editingItem && (
        <PatientForm
          onNavigate={goTo}
          onNotice={setNotice}
          notice={notice}
          item={editingItem as RecordItem}
        />
      )}

      {visiblePage === 'cadastroProfissional' && (
        <ProfessionalForm
          onNavigate={goTo}
          onNotice={setNotice}
          notice={notice}
        />
      )}

      {visiblePage === 'editarProfissional' && editingItem && (
        <ProfessionalForm
          onNavigate={goTo}
          onNotice={setNotice}
          notice={notice}
          item={editingItem as RecordItem}
        />
      )}

      {visiblePage === 'tags' && (
        <TagsPage
          onNavigate={goTo}
          onEdit={(item) => beginEdit('editarTag', item)}
        />
      )}

      {visiblePage === 'cadastroTag' && (
        <TagForm
          onNavigate={goTo}
          onNotice={setNotice}
          notice={notice}
        />
      )}

      {visiblePage === 'editarTag' && editingItem && (
        <TagForm
          onNavigate={goTo}
          onNotice={setNotice}
          notice={notice}
          item={editingItem as TagItem}
        />
      )}

      {visiblePage === 'planos' && (
        <PlanosPage
          onNavigate={goTo}
          onEdit={(item) => beginEdit('editarPlano', item)}
        />
      )}

      {visiblePage === 'cadastroPlano' && (
        <PlanoForm
          onNavigate={goTo}
          onNotice={setNotice}
          notice={notice}
        />
      )}

      {visiblePage === 'editarPlano' && editingItem && (
        <PlanoForm
          onNavigate={goTo}
          onNotice={setNotice}
          notice={notice}
          item={editingItem as PlanoItem}
        />
      )}

      {visiblePage === 'servicos' && (
        <ServicosPage
          onNavigate={goTo}
          onEdit={(item) => beginEdit('editarServico', item)}
        />
      )}

      {visiblePage === 'cadastroServico' && (
        <ServicoForm
          onNavigate={goTo}
          onNotice={setNotice}
          notice={notice}
        />
      )}

      {visiblePage === 'editarServico' && editingItem && (
        <ServicoForm
          onNavigate={goTo}
          onNotice={setNotice}
          notice={notice}
          item={editingItem as ServicoItem}
        />
      )}

      {visiblePage === 'receita' && (
        <ReceitaForm
          onNavigate={goTo}
          onNotice={setNotice}
          notice={notice}
        />
      )}

      {visiblePage === 'atestado' && (
        <AtestadoForm
          onNavigate={goTo}
          onNotice={setNotice}
          notice={notice}
        />
      )}

      {visiblePage === 'laudo' && (
        <LaudoForm
          onNavigate={goTo}
          onNotice={setNotice}
          notice={notice}
        />
      )}

      {visiblePage === 'financeiro' && (
        <FinanceiroForm
          onNavigate={goTo}
          onNotice={setNotice}
          notice={notice}
        />
      )}

      {tutorialAberto && token && (
        <GuidedTour
          paginaAtual={visiblePage}
          navegar={goTo}
          aoEncerrar={encerrarTutorial}
        />
      )}
    </TutorialContext.Provider>
  )
}

export default App