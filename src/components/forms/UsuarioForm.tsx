import { useEffect, useState } from 'react'
import type { FormProps, EntityFieldConfig } from '../../types'
import { EntityForm } from './EntityForm'
import { Sidebar } from '../Sidebar/Sidebar'
import { ListActions } from '../common/ListActions'
import { useAuth } from '../../context/AuthContext'
import { API_URL, fetchWithToken, readResponse, messageFrom, post } from '../../services/api'

type Usuario = {
  idusuario: number
  usuario: string
  email: string
  tipo: number
}

const campos: EntityFieldConfig[] = [
  { label: 'Nome', name: 'usuario' },
  { label: 'E-mail', name: 'email', type: 'email' },
  { label: 'Senha', name: 'senha', type: 'password' },
  {
    label: 'Tipo de usuário',
    name: 'tipo',
    type: 'select',
    options: [
      { label: 'Selecione um tipo', value: '' },
      { label: 'Usuário padrão', value: '0' },
      { label: 'Administrador', value: '1' },
    ],
  },
]

export function UsuarioForm({ onNavigate, onNotice, notice }: FormProps) {
  const { user } = useAuth()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [editando, setEditando] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [versaoForm, setVersaoForm] = useState(0)

  //buscar usuários cadastrados na clínica
  async function carregarUsuarios() {
    setCarregando(true)
    setErro('')
    try {
      const response = await fetchWithToken(`${API_URL}/users/listarByCNPJ`)
      const data = await readResponse(response) as { users?: Usuario[]; message?: string }
      if (!response.ok) throw new Error(messageFrom(data))
      if (!Array.isArray(data.users)) throw new Error('Lista de usuários inválida.')
      setUsuarios(data.users)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar usuários.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    void carregarUsuarios()
  }, [])

  //excluir usuário
  async function excluirUsuario(usuario: Usuario) {
    if (!window.confirm(`Deseja excluir ${usuario.usuario}?`)) return

    try {
      const response = await post(`/users/delete/${usuario.idusuario}`, {})
      if (!response.ok) throw new Error(messageFrom(response.data))
      onNotice('Usuário excluído com sucesso!')
      await carregarUsuarios()
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Erro ao excluir usuário.')
    }
  }

  return (
    <Sidebar active="cadastroUsuario" onNavigate={onNavigate}>
      <div className="space-y-6">
        <EntityForm
          key={versaoForm}
          title="Cadastrar usuário"
          back="inicio"
          endpoint="/users/register-user"
          onNavigate={onNavigate}
          onNotice={onNotice}
          notice={notice}
          fields={campos}
          embedded
          onCancel={() => onNavigate('inicio')}
          onSaved={() => {
            setVersaoForm((atual) => atual + 1)
            void carregarUsuarios()
          }}
        />

        {/* Lista de usuários */}
        <div className="mx-auto max-w-2xl rounded-[10px] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] md:p-8">
          <h2 className="mb-4 text-xl font-bold text-[#4f7161]">Usuários cadastrados</h2>
          {carregando ? (
            <p>Carregando usuários...</p>
          ) : erro ? (
            <div>
              <p className="text-red-700">{erro}</p>
              <button type="button" className="cursor-pointer text-[#4f7161] underline" onClick={() => void carregarUsuarios()}>Tentar novamente</button>
            </div>
          ) : (
            <ul className="max-h-[50vh] list-none overflow-y-auto">
              {usuarios.map((usuario) => (
                <li key={usuario.idusuario} className="mb-2 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#eef4ef] px-4 py-3.5 text-gray-800 last:mb-0">
                  <span className="font-bold">{usuario.usuario} — {Number(usuario.tipo) === 1 ? 'Administrador' : 'Usuário padrão'}</span>
                  {user?.idusuario === usuario.idusuario ? (
                    <span className="text-sm text-gray-500">Seu perfil</span>
                  ) : (
                    <ListActions onEdit={() => { onNotice(''); setEditando(usuario) }} onDelete={() => void excluirUsuario(usuario)} />
                  )}
                </li>
              ))}
              {!usuarios.length && (
                <li className="rounded-lg bg-[#eef4ef] px-4 py-3.5 text-center text-gray-500">Nenhum usuário cadastrado.</li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Modal de edição */}
      {editando && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Editar usuário">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[10px]">
            <EntityForm
              key={editando.idusuario}
              title="Editar usuário"
              back="cadastroUsuario"
              endpoint={`/users/admin/update/${editando.idusuario}`}
              onNavigate={onNavigate}
              onNotice={onNotice}
              notice={notice}
              initialValues={{usuario:editando.usuario, email:editando.email, tipo:editando.tipo, senha:''}}
              fields={campos.map((campo) => campo.name === 'senha' ? {...campo, label:'Nova senha (opcional)', optional:true} : campo)}
              submitLabel="Salvar alterações"
              successMessage="Usuário atualizado com sucesso!"
              embedded
              onCancel={() => setEditando(null)}
              onSaved={() => {
                setEditando(null)
                void carregarUsuarios()
              }}
            />
          </div>
        </div>
      )}
    </Sidebar>
  )
}