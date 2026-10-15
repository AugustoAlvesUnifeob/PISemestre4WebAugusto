import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Page } from '../types'
import { API_URL, fetchWithToken, readResponse, messageFrom, post } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { Field } from '../components/common/Field'

export function EditUserPage({
  onNavigate,
}: {
  onNavigate: (page: Page) => void
}) {
  const { user, login } = useAuth()
  const userId = user?.idusuario
  const [usuario, setUsuario] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState(false)
  const [carregando, setCarregando] = useState(Boolean(userId))
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (!userId) return

    let cancelado = false

    async function carregarUsuario() {
      try {
        const response = await fetchWithToken(`${API_URL}/users/${userId}`)
        const data = await readResponse(response)
        if (!response.ok) throw new Error(messageFrom(data))
        if (!data.user) throw new Error('Não foi possível carregar os dados do usuário.')

        if (!cancelado) {
          setUsuario(data.user.usuario || '')
          setEmail(data.user.email || '')
        }
      } catch (error) {
        if (!cancelado) {
          setMensagem(error instanceof Error ? error.message : 'Erro ao carregar usuário.')
          setErro(true)
        }
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }

    void carregarUsuario()
    return () => {
      cancelado = true
    }
  }, [userId])

  const mensagemVisivel = userId ? mensagem : 'Não foi possível identificar o usuário da sessão.'
  const erroVisivel = !userId || erro

  async function salvarUsuario(event: FormEvent) {
    event.preventDefault()
    if (!usuario.trim()) {
      setMensagem('Preencha o nome do usuário.')
      setErro(true)
      return
    }

    if (!email.trim()) {
      setMensagem('Preencha o e-mail.')
      setErro(true)
      return
    }

    if (senha && senha !== confirmarSenha) {
      setMensagem('As senhas não coincidem.')
      setErro(true)
      return
    }

    if (!user?.idusuario) return

    setSalvando(true)
    setMensagem('')
    setErro(false)

    try {
      const response = await post(`/users/update/${user.idusuario}`, {
        usuario: usuario.trim(),
        email: email.trim(),
        senha,
        tipo: user.tipo,
        clinica_cnpj: user.clinica_cnpj,
      })
      if (!response.ok) throw new Error(messageFrom(response.data))
      if (response.data.token) login(response.data.token)

      setSenha('')
      setConfirmarSenha('')
      setMensagem('Dados atualizados com sucesso.')
    } catch (error) {
      setMensagem(error instanceof Error ? error.message : 'Erro ao atualizar usuário.')
      setErro(true)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Sidebar active="editarUsuario" onNavigate={onNavigate}>
      <div className="mx-auto max-w-2xl rounded-[10px] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] md:p-8">
        <h1 className="mb-2 text-2xl font-bold text-[#4f7161]">Editar usuário</h1>
        <p className="mb-7 text-sm text-gray-500">Atualize os dados da sua conta.</p>

        <form className="space-y-5" onSubmit={salvarUsuario}>
          <fieldset disabled={carregando || salvando} className="space-y-4">
            <Field label="Usuário" value={usuario} onChange={setUsuario} />
            <Field label="E-mail" type="email" value={email} onChange={setEmail} />

            <div className="border-t border-gray-200 pt-5">
              <h2 className="mb-1 font-semibold text-[#4f7161]">Alterar senha</h2>
              <p className="mb-4 text-sm text-gray-500">
                Deixe os campos em branco para manter a senha atual.
              </p>
              <div className="space-y-4">
                <Field label="Nova senha" type="password" value={senha} onChange={setSenha} />
                <Field label="Confirmar nova senha" type="password" value={confirmarSenha} onChange={setConfirmarSenha} />
              </div>
            </div>
          </fieldset>

          {carregando && <p className="text-sm text-gray-500">Carregando dados...</p>}
          {mensagemVisivel && (
            <p role={erroVisivel ? 'alert' : 'status'} className={`text-sm ${erroVisivel ? 'text-red-700' : 'text-[#4f7161]'}`}>
              {mensagemVisivel}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={() => onNavigate('inicio')}
              className="w-full cursor-pointer rounded-lg border border-[#4f7161] px-3 py-3 text-[#4f7161] transition hover:bg-[#edf4f0]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={carregando || salvando}
              className="w-full cursor-pointer rounded-lg bg-[#4f7161] px-3 py-3 text-white transition hover:bg-[#3f5c4f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </Sidebar>
  )
}
