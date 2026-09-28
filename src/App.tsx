// --------------------
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Agenda } from './components/Agenda/AgendaWidget';
import './index.css';
import { Assets } from './components/AssetsClass';
import { useAuth } from './context/AuthContext'
import { Sidebar } from './components/Sidebar/Sidebar'

// --------------------

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
  | 'editarUsuario'

type RecordItem = {
  nome: string
  especialidade?: string
  idpaciente?: number
  idpacientes?: number
  iddoutor?: number
}

type TagItem = {
  idtag: number
  descricao: string
}

type PlanoItem = {
  idplano: number
  descricao: string
}

type SelectOption = { label: string; value: string }

const API_URL = 'http://localhost:5000'
const protectedPages: Page[] = [
  'inicio',
  'pacientes',
  'profissionais',
  'tags',
  'planos',
  'cadastroPaciente',
  'cadastroProfissional',
  'cadastroTag',
  'cadastroPlano',
  'editarUsuario'
]

function App() {
  // useState guarda dados que mudam durante a interação e causam nova renderização.
  const { token } = useAuth()
  const [page, setPage] = useState<Page>(() =>
    localStorage.getItem('@App:token') ? 'inicio' : 'login',
  )
  const [notice, setNotice] = useState('')

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

  return (
    <>
      {visiblePage === 'login' && (
        <Login onNavigate={goTo} onNotice={setNotice} notice={notice} />
      )}
      {visiblePage === 'cadastro' && (
        <Register onNavigate={goTo} onNotice={setNotice} notice={notice} />
      )}
      {visiblePage === 'inicio' && <Dashboard onNavigate={goTo} />}
      {visiblePage === 'pacientes' && (
        <RecordsPage kind="pacientes" onNavigate={goTo} />
      )}
      {visiblePage === 'profissionais' && (
        <RecordsPage kind="profissionais" onNavigate={goTo} />
      )}
      {visiblePage === 'cadastroPaciente' && (
        <PatientForm onNavigate={goTo} onNotice={setNotice} notice={notice} />
      )}
      {visiblePage === 'cadastroProfissional' && (
        <ProfessionalForm
          onNavigate={goTo}
          onNotice={setNotice}
          notice={notice}
        />
      )}

      {visiblePage === 'tags' && <TagsPage onNavigate={goTo} />}
      {visiblePage === 'cadastroTag' && (
        <TagForm onNavigate={goTo} onNotice={setNotice} notice={notice} />
      )}

      {visiblePage === 'planos' && <PlanosPage onNavigate={goTo} />}
      {visiblePage === 'cadastroPlano' && (
        <PlanoForm onNavigate={goTo} onNotice={setNotice} notice={notice} />
      )}

      {visiblePage === 'editarUsuario' && (
        <EditUserPage onNavigate={goTo} />
      )}
    </>
  )
}

function Login({ onNavigate, onNotice, notice }: FormProps) {
  // Estes são estados controlados: o valor exibido no input vem do React.
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const { login } = useAuth()

  async function submit(event: FormEvent) {
    // Evita o recarregamento padrão do formulário HTML.
    event.preventDefault()
    if (!email || !senha)
      return onNotice('Por favor, preencha todos os campos!')
    try {
      // await pausa esta função até a API responder, sem bloquear a interface.
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      })
      const data = await readResponse(response)
      if (!response.ok)
        throw new Error(data.message || 'Erro ao realizar login.')
      if (!data.token) throw new Error('A API não retornou um token de acesso.')
      login(data.token)
      onNotice('Login efetuado com sucesso!')
      onNavigate('inicio')
    } catch (error) {
      onNotice(
        error instanceof Error ? error.message : 'Erro ao realizar login.',
      )
    }
  }

  return (
    <AuthLayout title="EasyClinic" onSubmit={submit} notice={notice}>
      <Field label="E-mail" type="email" value={email} onChange={setEmail} />
      <Field label="Senha" type="password" value={senha} onChange={setSenha} />
      <button className="w-full rounded-lg bg-[#4f7161] px-3 py-3 text-[15px] text-white transition hover:bg-[#3f5c4f]" type="submit">Entrar</button>
      <div className="mt-5 text-center">
        <p className="text-sm text-gray-600">
          Novo usuário?{' '}
          <a className="font-bold text-[#4f7161] hover:underline" href="#cadastro" onClick={() => onNavigate('cadastro')}>
            Começar agora
          </a>
        </p>
      </div>
    </AuthLayout>
  )
}

function Register({ onNavigate, onNotice, notice }: FormProps) {
  const [values, setValues] = useState({
    nomeClinica: '',
    cnpj: '',
    usuario: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  })
  // Atualiza somente o campo alterado, preservando os demais campos do objeto.
  const update = (key: keyof typeof values) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (values.senha !== values.confirmarSenha)
      return onNotice('As senhas não coincidem!')
    try {
      const clinicResponse = await post('/clinicas/register', {
        nome: values.nomeClinica,
        cnpj: values.cnpj,
      })
      if (!clinicResponse.ok)
        throw new Error(`Erro na Clínica: ${messageFrom(clinicResponse.data)}`)
      const userResponse = await post('/users/register', {
        usuario: values.usuario,
        email: values.email,
        senha: values.senha,
        tipo: 1,
        clinica_cnpj: values.cnpj,
      })
      if (!userResponse.ok)
        throw new Error(`Erro no Usuário: ${messageFrom(userResponse.data)}`)
      onNotice('Clínica e Usuário cadastrados com sucesso!')
      onNavigate('login')
    } catch (error) {
      onNotice(
        error instanceof Error ? error.message : 'Erro ao realizar cadastro.',
      )
    }
  }

  return (
    <AuthLayout title="Criar Acesso" onSubmit={submit} notice={notice}>
      <h3 className="pt-2 text-lg font-semibold text-[#4f7161]">Informações da Clínica</h3>
      <Field
        label="Nome da Clínica"
        value={values.nomeClinica}
        onChange={update('nomeClinica')}
      />
      <Field label="CNPJ" value={values.cnpj} onChange={update('cnpj')} />
      <h3 className="pt-2 text-lg font-semibold text-[#4f7161]">Usuário Master</h3>
      <Field
        label="Usuário"
        value={values.usuario}
        onChange={update('usuario')}
      />
      <Field
        label="E-mail"
        type="email"
        value={values.email}
        onChange={update('email')}
      />
      <Field
        label="Senha"
        type="password"
        value={values.senha}
        onChange={update('senha')}
      />
      <Field
        label="Confirmar Senha"
        type="password"
        value={values.confirmarSenha}
        onChange={update('confirmarSenha')}
      />
      <button className="w-full rounded-lg bg-[#4f7161] px-3 py-3 text-[15px] text-white transition hover:bg-[#3f5c4f]" type="submit">Cadastrar</button>
      <div className="mt-5 text-center">
        <p className="text-sm text-gray-600">
          Já possui conta?{' '}
          <a className="font-bold text-[#4f7161] hover:underline" href="#login" onClick={() => onNavigate('login')}>
            Fazer login
          </a>
        </p>
      </div>
    </AuthLayout>
  )
}

function AuthLayout({
  title,
  onSubmit,
  children,
  notice,
}: {
  title: string
  onSubmit: (event: FormEvent) => void
  children: React.ReactNode
  notice: string
}) {
  // children permite reutilizar a mesma estrutura visual para login e cadastro.
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="flex min-h-[220px] w-full items-center justify-center bg-[#4f7161] md:min-h-screen md:w-[45%]">
        <div className="text-center text-white">
          <h1 className="mb-4 text-8xl font-bold">EasyClinic</h1>
          <p className="text-lg">Sistema de Gestão para Clínicas</p>
          <br></br>
          <img src={Assets.Imagens.people} alt='people' />
        </div>
      </div>
      <div className="flex min-h-[calc(100vh-220px)] w-full items-center justify-center bg-white px-5 py-8 md:min-h-screen md:w-[55%]">
        <div className="w-full max-w-[450px]">
          <h2 className="mb-6 text-center text-2xl font-bold text-[#4f7161]">{title}</h2>
          {notice && <p className="mb-4 text-center text-[#3f5c4f]">{notice}</p>}
          <form className="space-y-4" onSubmit={onSubmit}>{children}</form>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  type = 'text',
  value,
  onChange,
}: {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
}) {
  // onChange envia o novo valor para o componente pai, mantendo o input controlado.
  return (
    <div className="space-y-1">
      <label className="block text-sm text-gray-600">{label}</label>
      <input
        className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-[#4f7161] focus:outline-none focus:ring-2 focus:ring-[#4f7161]/20"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

function EntityField({
  field,
  value,
  onChange,
}: {
  field: EntityFieldConfig
  value: string
  onChange: (value: string) => void
}) {
  if (field.type === 'select') {
    return (
      <div className="space-y-1">
        <label className="block text-sm text-gray-600">{field.label}</label>
        <select
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm focus:border-[#4f7161] focus:outline-none focus:ring-2 focus:ring-[#4f7161]/20"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {field.options.map((option) => (
            <option key={option.value || `${field.name}-empty`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (field.type === 'radio') {
    return (
      <div className="space-y-1">
        <label className="block text-sm text-gray-600">{field.label}</label>
        <div className="flex gap-6 pt-1">
          {field.options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"
            >
              <input
                type="radio"
                name={field.name}
                value={option.value}
                checked={value === option.value}
                onChange={(event) => onChange(event.target.value)}
                className="h-4 w-4 accent-[#4f7161]"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm text-gray-600">{field.label}</label>
      <input
        className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-[#4f7161] focus:outline-none focus:ring-2 focus:ring-[#4f7161]/20"
        type={field.type ?? 'text'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

function Dashboard({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <Sidebar active="inicio" onNavigate={onNavigate}>
      <h1 className="mb-7 text-3xl font-bold text-[#4f7161]">Início</h1>
      <div className="rounded-[10px] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <h3 className="mb-4 text-lg font-semibold text-[#4f7161]">Login realizado com sucesso</h3>
        <p className="mb-2">Esta é a tela inicial do sistema.</p>
        <p className="mb-2">Em breve aqui serão exibidos:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>Agendamentos do dia</li>
          <li>Pacientes cadastrados</li>
          <li>Profissionais cadastrados</li>
          <li>Informações da clínica</li>
          <li> ISTO ESTÁ EM DESENVOLVIMENTO (só um adendo rs)</li>
          <Agenda />
        </ul>
      </div>
    </Sidebar>
  )
}

function EditUserPage({
  onNavigate,
}: {
  onNavigate: (page: Page) => void
}) {
  const { user } = useAuth()

  const [usuario, setUsuario] = useState(user?.usuario || '')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mensagem, setMensagem] = useState('')

  function salvarUsuario() {
    if (!usuario.trim()) {
      setMensagem('Preencha o nome do usuário.')
      return
    }

    if (!email.trim()) {
      setMensagem('Preencha o e-mail.')
      return
    }

    if (senha && senha !== confirmarSenha) {
      setMensagem('As senhas não coincidem.')
      return
    }

    setMensagem(
      'Dados validados. A atualização será concluída após a integração com a API.'
    )
  }

  return (
    <Sidebar active="editarUsuario" onNavigate={onNavigate}>
      <div className="mx-auto max-w-2xl rounded-[10px] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] md:p-8">

        <h1 className="mb-2 text-2xl font-bold text-[#4f7161]">
          Editar Usuário
        </h1>

        <p className="mb-7 text-sm text-gray-500">
          Atualize os dados da sua conta.
        </p>

        <div className="space-y-4">

          <Field
            label="Usuário"
            value={usuario}
            onChange={setUsuario}
          />

          <Field
            label="E-mail"
            type="email"
            value={email}
            onChange={setEmail}
          />

          <div className="border-t border-gray-200 pt-5">
            <h2 className="mb-1 font-semibold text-[#4f7161]">
              Alterar senha
            </h2>

            <p className="mb-4 text-sm text-gray-500">
              Preencha os campos abaixo somente se desejar alterar sua senha.
            </p>

            <div className="space-y-4">
              <Field
                label="Nova senha"
                type="password"
                value={senha}
                onChange={setSenha}
              />

              <Field
                label="Confirmar nova senha"
                type="password"
                value={confirmarSenha}
                onChange={setConfirmarSenha}
              />
            </div>
          </div>

          {mensagem && (
            <p className="text-center text-sm text-[#4f7161]">
              {mensagem}
            </p>
          )}

          <div className="flex gap-3 pt-2">

            <button
              type="button"
              onClick={() => onNavigate('inicio')}
              className="cursor-pointer w-full rounded-lg border border-[#4f7161] px-3 py-3 text-[#4f7161] transition hover:bg-[#edf4f0]"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={salvarUsuario}
              className="cursor-pointer w-full rounded-lg bg-[#4f7161] px-3 py-3 text-white transition hover:bg-[#3f5c4f]"
            >
              Salvar alterações
            </button>

          </div>

        </div>
      </div>
    </Sidebar>
  )
}

function RecordsPage({
  kind,
  onNavigate,
}: {
  kind: 'pacientes' | 'profissionais'
  onNavigate: (page: Page) => void
}) {
  const [items, setItems] = useState<RecordItem[]>([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState(false)
  const isPatients = kind === 'pacientes'

  // useEffect executa o carregamento quando a página é montada ou quando kind muda.
  useEffect(() => {
    fetchWithToken(
      `${API_URL}/${isPatients ? 'pacientes' : 'doutores'}/listarByCNPJ`,
    )
      .then(async (response) => {
        const data = await readResponse(response)
        if (!response.ok) throw new Error()
        setItems(data[isPatients ? 'pacientes' : 'doutores'] || [])
      })
      .catch(() => setError(true))
  }, [isPatients])
  const filtered = items.filter((item) =>
    item.nome?.toLowerCase().includes(query.trim().toLowerCase()),
  )

  // JSX permite renderização condicional usando expressões JavaScript.
  return (
    <Sidebar active={kind} onNavigate={onNavigate}>
      <div className="mb-6 flex items-center gap-4">
        <input
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-[#4f7161] focus:outline-none focus:ring-2 focus:ring-[#4f7161]/20"
          placeholder={`Pesquisar ${isPatients ? 'paciente' : 'profissional'}`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button
          className="h-11 w-11 shrink-0 rounded-lg bg-[#4f7161] text-2xl leading-none text-white transition hover:bg-[#3f5c4f]"
          type="button"
          onClick={() =>
            onNavigate(isPatients ? 'cadastroPaciente' : 'cadastroProfissional')
          }
        >
          +
        </button>
      </div>
      <div className="rounded-[10px] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <ul className="max-h-[65vh] list-none overflow-y-auto">
          {error ? (
            <li className="rounded-lg bg-[#eef4ef] px-4 py-3.5 text-center text-gray-500">Não foi possível carregar os dados.</li>
          ) : filtered.length ? (
            filtered.map((item) => (
              <li className="mb-2 rounded-lg bg-[#eef4ef] px-4 py-3.5 font-bold text-gray-800 last:mb-0" key={item.idpaciente || item.idpacientes || item.iddoutor || item.nome}>
                {isPatients
                  ? item.nome
                  : `${item.nome} - ${item.especialidade}`}
              </li>
            ))
          ) : (
            <li className="rounded-lg bg-[#eef4ef] px-4 py-3.5 text-center text-gray-500">
              {items.length
                ? 'Nenhum resultado encontrado.'
                : `Nenhum ${isPatients ? 'paciente' : 'profissional'} cadastrado ainda.`}
            </li>
          )}
        </ul>
      </div>
    </Sidebar>
  )
}

function TagsPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [tags, setTags] = useState<TagItem[]>([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchWithToken(`${API_URL}/tag/listarByCNPJ`)
      .then(async (response) => {
        const data = await readResponse(response)
        if (!response.ok) throw new Error()
        setTags(data.tags || [])
      })
      .catch(() => setError(true))
  }, [])

  const filtered = tags.filter((tag) =>
    tag.descricao?.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <Sidebar active="tags" onNavigate={onNavigate}>
      <div className="mb-6 flex items-center gap-4">
        <input
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-[#4f7161] focus:outline-none focus:ring-2 focus:ring-[#4f7161]/20"
          placeholder="Pesquisar tag"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button
          className="h-11 w-11 shrink-0 rounded-lg bg-[#4f7161] text-2xl leading-none text-white transition hover:bg-[#3f5c4f]"
          type="button"
          onClick={() => onNavigate('cadastroTag')}
        >
          +
        </button>
      </div>
      <div className="rounded-[10px] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <ul className="max-h-[65vh] list-none overflow-y-auto">
          {error ? (
            <li className="rounded-lg bg-[#eef4ef] px-4 py-3.5 text-center text-gray-500">
              Não foi possível carregar as tags.
            </li>
          ) : filtered.length ? (
            filtered.map((tag) => (
              <li
                className="mb-2 rounded-lg bg-[#eef4ef] px-4 py-3.5 text-center font-bold text-gray-800 last:mb-0"
                key={tag.idtag}
              >
                {tag.descricao.toUpperCase()}
              </li>
            ))
          ) : (
            <li className="rounded-lg bg-[#eef4ef] px-4 py-3.5 text-center text-gray-500">
              {tags.length
                ? 'Nenhum resultado encontrado.'
                : 'Nenhuma tag cadastrada ainda.'}
            </li>
          )}
        </ul>
      </div>
    </Sidebar>
  )
}

function PlanosPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [planos, setPlanos] = useState<PlanoItem[]>([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchWithToken(`${API_URL}/plano/listarByCNPJ`)
      .then(async (response) => {
        const data = await readResponse(response)
        if (!response.ok) throw new Error()
        setPlanos(data.planos || [])
      })
      .catch(() => setError(true))
  }, [])

  const filtered = planos.filter((plano) =>
    plano.descricao?.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <Sidebar active="planos" onNavigate={onNavigate}>
      <div className="mb-6 flex items-center gap-4">
        <input
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-[#4f7161] focus:outline-none focus:ring-2 focus:ring-[#4f7161]/20"
          placeholder="Pesquisar plano"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button
          className="h-11 w-11 shrink-0 rounded-lg bg-[#4f7161] text-2xl leading-none text-white transition hover:bg-[#3f5c4f]"
          type="button"
          onClick={() => onNavigate('cadastroPlano')}
        >
          +
        </button>
      </div>
      <div className="rounded-[10px] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <ul className="max-h-[65vh] list-none overflow-y-auto">
          {error ? (
            <li className="rounded-lg bg-[#eef4ef] px-4 py-3.5 text-center text-gray-500">
              Não foi possível carregar os planos.
            </li>
          ) : filtered.length ? (
            filtered.map((plano) => (
              <li
                className="mb-2 rounded-lg bg-[#eef4ef] px-4 py-3.5 text-center font-bold text-gray-800 last:mb-0"
                key={plano.idplano}
              >
                {plano.descricao.toUpperCase()}
              </li>
            ))
          ) : (
            <li className="rounded-lg bg-[#eef4ef] px-4 py-3.5 text-center text-gray-500">
              {planos.length
                ? 'Nenhum resultado encontrado.'
                : 'Nenhum plano cadastrado ainda.'}
            </li>
          )}
        </ul>
      </div>
    </Sidebar>
  )
}

// Formulario
function PlanoForm({ onNavigate, onNotice, notice }: FormProps) {
  return (
    <EntityForm
      title="Cadastrar Plano"
      back="planos"
      endpoint="/plano/register"
      onNavigate={onNavigate}
      onNotice={onNotice}
      notice={notice}
      fields={[
        { label: 'Nome', name: 'descricao' },
        // os radios são obrigatórios, se não marcar Sim/Não o form não envia
        {
          label: 'Desconta',
          name: 'desconta',
          type: 'radio',
          options: [
            { label: 'Sim', value: 'true' },
            { label: 'Não', value: 'false' },
          ],
        },
        { label: 'Valor Desconto', name: 'valor_desconto' },
        {
          label: 'Exonera',
          name: 'exonera',
          type: 'radio',
          options: [
            { label: 'Sim', value: 'true' },
            { label: 'Não', value: 'false' },
          ],
        },
      ]}
    />
  )
}

type EntityFieldConfig =
  | {
    label: string
    name: string
    type?: 'text' | 'email' | 'password'
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
    type: 'radio'
    options: Array<{ label: string; value: string }>
  }

function PatientForm({ onNavigate, onNotice, notice }: FormProps) {
  const [tags, setTags] = useState<SelectOption[]>([])
  const [planos, setPlanos] = useState<SelectOption[]>([])

  useEffect(() => {
    Promise.all([
      fetchWithToken(`${API_URL}/tag/listarByCNPJ`),
      fetchWithToken(`${API_URL}/plano/listarByCNPJ`),
    ])
      .then(async ([tagsResponse, planosResponse]) => {
        const tagsData = await readResponse(tagsResponse)
        const planosData = await readResponse(planosResponse)
        if (!tagsResponse.ok) throw new Error(messageFrom(tagsData))
        if (!planosResponse.ok) throw new Error(messageFrom(planosData))
        setTags(
          (tagsData.tags || []).map(
            (tag: { idtag: number; descricao: string }) => ({
              label: tag.descricao,
              value: String(tag.idtag),
            }),
          ),
        )
        setPlanos(
          (planosData.planos || []).map(
            (plano: { idplano: number; descricao: string }) => ({
              label: plano.descricao,
              value: String(plano.idplano),
            }),
          ),
        )
      })
      .catch((error) => {
        onNotice(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar tags e planos.',
        )
      })
  }, [onNotice])

  return (
    <EntityForm
      title="Cadastrar Paciente"
      back="pacientes"
      endpoint="/pacientes/register"
      onNavigate={onNavigate}
      onNotice={onNotice}
      notice={notice}
      fields={[
        { label: 'Nome', name: 'nome' },
        { label: 'CPF', name: 'cpf' },
        { label: 'Telefone', name: 'telefone' },
        { label: 'E-mail', name: 'email', type: 'email' },
        { label: 'Complemento', name: 'complemento' },
        {
          label: 'Tag',
          name: 'tag_idtag',
          type: 'select',
          options: [
            { label: 'Selecione uma tag', value: '' },
            ...tags,
          ],
        },
        {
          label: 'Plano',
          name: 'plano_idplano',
          type: 'select',
          options: [
            { label: 'Selecione um plano', value: '' },
            ...planos,
          ],
        },
      ]}
    />
  )
}

function ProfessionalForm({ onNavigate, onNotice, notice }: FormProps) {
  return (
    <EntityForm
      title="Cadastrar Profissional"
      back="profissionais"
      endpoint="/doutores/register"
      onNavigate={onNavigate}
      onNotice={onNotice}
      notice={notice}
      fields={[
        { label: 'Nome', name: 'nome' },
        { label: 'Especialidade', name: 'especialidade' },
        { label: 'Documento/CRM', name: 'documento' },
      ]}
    />
  )
}

function TagForm({ onNavigate, onNotice, notice }: FormProps) {
  return (
    <EntityForm
      title="Cadastrar Tag"
      back="tags"
      endpoint="/tags/register"
      onNavigate={onNavigate}
      onNotice={onNotice}
      notice={notice}
      fields={[{ label: 'Nome da Tag', name: 'descricao' }]}
    />
  )
}

function EntityForm({
  title,
  back,
  fields,
  endpoint,
  onNavigate,
  onNotice,
  notice,
}: {
  title: string
  back: Page
  fields: EntityFieldConfig[]
  endpoint: string
  onNavigate: (page: Page) => void
  onNotice: (notice: string) => void
  notice: string
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.name, ''])),
  )

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (fields.some((field) => !values[field.name]))
      return onNotice('Por favor, preencha todos os campos obrigatórios!')

    const payload = Object.fromEntries(
      fields.map((field) => [field.name, values[field.name]]),
    )

    try {
      const response = await post(endpoint, payload)

      if (!response.ok) throw new Error(messageFrom(response.data))
      onNotice('Cadastro realizado com sucesso!')
      onNavigate(back)
    } catch (error) {
      onNotice(
        error instanceof Error ? error.message : 'Erro ao realizar cadastro.',
      )
    }
  }

  return (
    <Sidebar active={back} onNavigate={onNavigate}>
      <div className="mx-auto max-w-2xl rounded-[10px] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] md:p-8">
        <h1 className="mb-7 text-2xl font-bold text-[#4f7161]">{title}</h1>
        {notice && <p className="notice">{notice}</p>}
        <form onSubmit={submit}>
          {fields.map((field) => (
            <EntityField
              key={field.name}
              field={field}
              value={values[field.name]}
              onChange={(value) =>
                setValues((current) => ({ ...current, [field.name]: value }))
              }
            />
          ))}
          <button className='cadastrar' type="submit">Cadastrar</button>
        </form>
        <div className="mt-5 text-center">
          <p>
            <a className="font-bold text-[#4f7161] hover:underline" href={`#${back}`} onClick={() => onNavigate(back)}>
              Voltar
            </a>
          </p>
        </div>
      </div>
    </Sidebar>
  )
}

type FormProps = {
  onNavigate: (page: Page) => void
  onNotice: (notice: string) => void
  notice: string
}
async function post(path: string, body: object) {
  // Centraliza a configuração comum das requisições POST feitas pelos formulários.
  const response = await fetchWithToken(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...tokenHeader(),
    },
    body: JSON.stringify(body),
  })
  return { ok: response.ok, data: await readResponse(response) }
}
function tokenHeader(): Record<string, string> {
  const token = localStorage.getItem('@App:token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}
function fetchWithToken(input: RequestInfo | URL, init: RequestInit = {}) {
  return fetch(input, {
    ...init,
    headers: { ...tokenHeader(), ...init.headers },
  })
}
async function readResponse(response: Response) {
  const text = await response.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}
function messageFrom(data: { message?: string; errors?: { msg?: string }[] }) {
  if (data.errors?.[0]?.msg) return data.errors[0].msg
  if (typeof data.message === 'string') return data.message
  if (data.message) return JSON.stringify(data.message)
  return JSON.stringify(data)
}

export default App
