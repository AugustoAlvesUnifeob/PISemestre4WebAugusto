 // --------------------
import { useState } from 'react';
import './index.css';
import { useAuth } from './context/AuthContext'

// --------------------

import type {
  Page,
  RecordItem,
  TagItem,
  PlanoItem,
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

import { PatientForm } from './components/forms/PatientForm'
import { ProfessionalForm } from './components/forms/ProfessionalForm'
import { TagForm } from './components/forms/TagForm'
import { PlanoForm } from './components/forms/PlanoForm'
import { ReceitaForm, AtestadoForm, LaudoForm } from './components/forms/DocumentForms'

const protectedPages: Page[] = [
  'inicio',
  'agendamentos',
  'pacientes',
  'profissionais',
  'tags',
  'planos',
  'cadastroPaciente',
  'cadastroProfissional',
  'cadastroTag',
  'cadastroPlano',
  'editarPaciente',
  'editarProfissional',
  'editarTag',
  'editarPlano',
  'receita',
  'atestado',
  'laudo',
  'editarUsuario'
]

function App() {
  // useState guarda dados que mudam durante a interação e causam nova renderização.
  const { token } = useAuth()
  const [page, setPage] = useState<Page>(() =>
    localStorage.getItem('@App:token') ? 'inicio' : 'login',
  )
  const [notice, setNotice] = useState('')
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null)

  // O componente pai controla a tela atual e passa esta função aos filhos via props.
  const goTo = (nextPage: Page) => {
    const hasStoredToken = Boolean(localStorage.getItem('@App:token'))
    if (!token && !hasStoredToken && protectedPages.includes(nextPage)) {
      setPage('login')
      return
    }
    setNotice('')
    setPage(nextPage)
  }

  const visiblePage = token || !protectedPages.includes(page) ? page : 'login'
  const beginEdit = (nextPage: Extract<Page, `editar${string}`>, item: EditingItem) => {
    setEditingItem(item)
    goTo(nextPage)
  }

  return (
    <>
      {visiblePage === 'login' && (
        <Login onNavigate={goTo} onNotice={setNotice} notice={notice} />
      )}
      {visiblePage === 'cadastro' && (
        <Register onNavigate={goTo} onNotice={setNotice} notice={notice} />
      )}
      {visiblePage === 'inicio' && <Dashboard onNavigate={goTo} />}
      {visiblePage === 'agendamentos' && <AppointmentsPage onNavigate={goTo} />}
      {visiblePage === 'editarUsuario' && (
        <EditUserPage onNavigate={goTo} />
      )}
      {visiblePage === 'pacientes' && (
        <RecordsPage kind="pacientes" onNavigate={goTo} onEdit={(item) => beginEdit('editarPaciente', item)} />
      )}
      {visiblePage === 'profissionais' && (
        <RecordsPage kind="profissionais" onNavigate={goTo} onEdit={(item) => beginEdit('editarProfissional', item)} />
      )}
      {visiblePage === 'cadastroPaciente' && (
        <PatientForm onNavigate={goTo} onNotice={setNotice} notice={notice} />
      )}
      {visiblePage === 'editarPaciente' && editingItem && (
        <PatientForm onNavigate={goTo} onNotice={setNotice} notice={notice} item={editingItem as RecordItem} />
      )}
      {visiblePage === 'cadastroProfissional' && (
        <ProfessionalForm
          onNavigate={goTo}
          onNotice={setNotice}
          notice={notice}
        />
      )}
      {visiblePage === 'editarProfissional' && editingItem && (
        <ProfessionalForm onNavigate={goTo} onNotice={setNotice} notice={notice} item={editingItem as RecordItem} />
      )}

      {visiblePage === 'tags' && <TagsPage onNavigate={goTo} onEdit={(item) => beginEdit('editarTag', item)} />}
      {visiblePage === 'cadastroTag' && (
        <TagForm onNavigate={goTo} onNotice={setNotice} notice={notice} />
      )}
      {visiblePage === 'editarTag' && editingItem && (
        <TagForm onNavigate={goTo} onNotice={setNotice} notice={notice} item={editingItem as TagItem} />
      )}

      {visiblePage === 'planos' && <PlanosPage onNavigate={goTo} onEdit={(item) => beginEdit('editarPlano', item)} />}
      {visiblePage === 'cadastroPlano' && (
        <PlanoForm onNavigate={goTo} onNotice={setNotice} notice={notice} />
      )}
      {visiblePage === 'editarPlano' && editingItem && (
        <PlanoForm onNavigate={goTo} onNotice={setNotice} notice={notice} item={editingItem as PlanoItem} />
      )}
      {visiblePage === 'receita' && (
        <ReceitaForm onNavigate={goTo} onNotice={setNotice} notice={notice} />
      )}
      {visiblePage === 'atestado' && (
        <AtestadoForm onNavigate={goTo} onNotice={setNotice} notice={notice} />
      )}
      {visiblePage === 'laudo' && (
        <LaudoForm onNavigate={goTo} onNotice={setNotice} notice={notice} />
      )}
    </>
  )
}

export default App
