
export type Page =
  | 'login'
  | 'cadastro'
  | 'inicio'
  | 'agendamentos'
  | 'pacientes'
  | 'profissionais'
  | 'tags'
  | 'planos'
  | 'cadastroUsuario'
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

export type RecordItem = {
  nome: string
  especialidade?: string
  documento?: string
  cpf?: string
  telefone?: string
  email?: string
  complemento?: string
  tag_ids?: number[]
  plano_idplano?: number
  idpaciente?: number
  idpacientes?: number
  iddoutor?: number
}

export type PatientAnamnese = {
  idanaminese: number
  queixas?: string | null
  historicoatual?: string | null
  doencaspreexistentes?: string | null
  medicamentos?: string | null
  alergias?: string | null
  cirurgiasanteriores?: string | null
  historicofamiliar?: string | null
}

export type TagItem = {
  idtag: number
  descricao: string
}

export type PlanoItem = {
  idplano: number
  descricao: string
  aplicadesconto?: boolean
  valordesconto?: number
  exonera?: boolean
}

export type EditingItem = RecordItem | TagItem | PlanoItem

export type SelectOption = { label: string; value: string }

export type EntityFieldConfig = {
    label: string
    name: string
    optional?: boolean
  } & (
  | {
    type?: 'text' | 'email' | 'password' | 'number' | 'textarea'
  }
  | {
    label: string
    name: string
    type: 'select'
    options: Array<{ label: string; value: string }>
  }
  | {
    label: string
    name: string
    type: 'multiselect'
    options: Array<{ label: string; value: string }>
  }
  | {
    label: string
    name: string
    type: 'radio'
    options: Array<{ label: string; value: string }>
  }
  )

export type DocumentPatient = { idpacientes: number; nome: string }
export type DocumentDoctor = { iddoutor: number; nome: string; especialidade?: string }

export type FormProps = {
  onNavigate: (page: Page) => void
  onNotice: (notice: string) => void
  notice: string
}
