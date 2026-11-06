
export type Page =
  | 'login'
  | 'cadastro'
  | 'inicio'
  | 'agendamentos'
  | 'pacientes'
  | 'profissionais'
  | 'tags'
  | 'planos'
  | 'servicos'
  | 'cadastroUsuario'
  | 'cadastroPaciente'
  | 'cadastroProfissional'
  | 'cadastroTag'
  | 'cadastroPlano'
  | 'cadastroServico'
  | 'editarPaciente'
  | 'editarProfissional'
  | 'editarTag'
  | 'editarPlano'
  | 'editarServico'
  | 'receita'
  | 'atestado'
  | 'laudo'
  | 'financeiro'
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

export type ServicoItem = {
  idservico: number
  nome: string
  preco: number
}

export type EditingItem = RecordItem | TagItem | PlanoItem | ServicoItem

export type SelectOption = { label: string; value: string }

export type EntityFieldConfig = {
    label: string
    name: string
    optional?: boolean
  } & (
  | {
    type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea'
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
