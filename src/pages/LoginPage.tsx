import { useState } from 'react'
import type { FormEvent } from 'react'
import type { FormProps } from '../types'
import { API_URL, readResponse } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { AuthLayout } from '../layouts/AuthLayout'
import { Field } from '../components/common/Field'

export function Login({ onNavigate, onNotice, notice }: FormProps) {
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
      <Field label="Login" placeholder="Login" type="email" value={email} onChange={setEmail} variant="underline" />
      <Field label="Senha" placeholder="Senha" type="password" value={senha} onChange={setSenha} variant="underline" />
      <button className="mx-auto mt-8 block w-36 rounded-full bg-[#9fbea9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#789b84]" type="submit">Entrar</button>
      <div className="absolute bottom-5 left-0 right-0 text-center">
        <p className="text-xs text-gray-500">
          Novo usuário?{' '}
          <a className="font-semibold text-[#4f7161] hover:underline" href="#cadastro" onClick={() => onNavigate('cadastro')}>
            Crie uma conta aqui
          </a>
        </p>
      </div>
    </AuthLayout>
  )
}
